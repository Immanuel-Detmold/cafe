import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

type OrderItemInput = {
  product_id: number
  quantity: number
  extras: { id: string; name: string; price: string; quantity?: number }[]
  option: { id: string; name: string; price: string } | null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Public endpoint — no auth required (menu page customers)

  const { order_items } = (await req.json()) as {
    order_items: OrderItemInput[]
  }

  if (!order_items?.length) {
    return new Response(JSON.stringify({ error: 'Fehlende Pflichtfelder' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // --- Fetch product prices from DB (never trust client prices) ---
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data: products, error: productsError } = (await supabase
    .from('Products')
    .select('id, price, extras, options, paused, deleted')
    .in(
      'id',
      order_items.map((i) => i.product_id),
    )) as {
    data:
      | {
          id: number
          price: number
          extras: { id: string; name: string; price: string }[]
          options: { id: string; name: string; price: string }[]
          paused: boolean
          deleted: boolean | null
        }[]
      | null
    error: unknown
  }

  if (productsError || !products?.length) {
    return new Response(
      JSON.stringify({ error: 'Produkte konnten nicht geladen werden' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // --- Validate all products exist, are not paused/deleted, and validate options/extras against DB ---
  for (const item of order_items) {
    const product = products.find((p) => p.id === item.product_id)
    if (!product) {
      return new Response(
        JSON.stringify({
          error: `Produkt ${item.product_id} nicht gefunden`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    if (product.paused || product.deleted) {
      return new Response(
        JSON.stringify({
          error: `Produkt "${item.product_id}" ist nicht verfügbar`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    if (item.option) {
      const dbOption = product.options?.find((o) => o.id === item.option!.id)
      if (!dbOption) {
        return new Response(
          JSON.stringify({
            error: `Ungültige Option für Produkt ${item.product_id}`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    }
    for (const extra of item.extras) {
      const dbExtra = product.extras?.find((e) => e.id === extra.id)
      if (!dbExtra) {
        return new Response(
          JSON.stringify({
            error: `Ungültiges Extra für Produkt ${item.product_id}`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    }
  }

  // --- Calculate price server-side using DB prices ---
  const calculatedTotal = order_items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id)!
    let basePrice: number
    if (item.option) {
      const dbOption = product.options.find((o) => o.id === item.option!.id)!
      basePrice = parseFloat(dbOption.price)
    } else {
      basePrice = product.price
    }
    const extrasPrice = item.extras.reduce((s, extra) => {
      const dbExtra = product.extras.find((e) => e.id === extra.id)!
      return s + parseFloat(dbExtra.price) * (extra.quantity ?? 1)
    }, 0)
    return sum + Math.round((basePrice + extrasPrice) * item.quantity)
  }, 0)

  if (calculatedTotal <= 0) {
    return new Response(JSON.stringify({ error: 'Ungültiger Betrag' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const SUMUP_API_KEY = Deno.env.get('SUMUP_API_KEY') ?? ''
  const SUMUP_MERCHANT_CODE = Deno.env.get('SUMUP_MERCHANT_CODE') ?? ''

  // Generate a unique checkout reference
  const checkoutReference = `menu-${crypto.randomUUID()}`

  // SumUp Checkouts API expects the amount in euros (decimal), not cents
  const amountInEuros = calculatedTotal / 100

  const sumupResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUMUP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      checkout_reference: checkoutReference,
      amount: amountInEuros,
      currency: 'EUR',
      merchant_code: SUMUP_MERCHANT_CODE,
      description: 'Menükarte Bestellung',
    }),
  })

  const responseBody = await sumupResponse.json()

  if (!sumupResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'SumUp Checkout Fehler', details: responseBody }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  return new Response(
    JSON.stringify({
      checkout_id: responseBody.id as string,
      checkout_reference: checkoutReference,
      verified_price: calculatedTotal,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
