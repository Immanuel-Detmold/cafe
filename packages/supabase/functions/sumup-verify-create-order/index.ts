import { createClient } from '@supabase/supabase-js'

// deno.json maps '@supabase/supabase-js' → 'https://esm.sh/@supabase/supabase-js@2'

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

type RequestBody = {
  checkout_id: string
  order_items: OrderItemInput[]
  customer_name?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Public endpoint — no auth, but payment is verified server-side via SumUp API

  const body = (await req.json()) as RequestBody
  const { checkout_id, order_items, customer_name } = body

  if (!checkout_id || !order_items?.length) {
    return new Response(JSON.stringify({ error: 'Fehlende Pflichtfelder' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const SUMUP_API_KEY = Deno.env.get('SUMUP_API_KEY') ?? ''

  // 1. Verify payment status with SumUp — never trust the client
  const verifyResponse = await fetch(
    `https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(checkout_id)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${SUMUP_API_KEY}` },
    },
  )

  const checkoutData = await verifyResponse.json()

  if (!verifyResponse.ok || checkoutData.status !== 'PAID') {
    return new Response(
      JSON.stringify({
        error: 'Zahlung nicht bestätigt',
        status: checkoutData.status ?? 'UNKNOWN',
      }),
      {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // 2. Fetch product prices from DB and calculate server-side (never trust client prices)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data: products, error: productsError } = (await supabaseAdmin
    .from('Products')
    .select('id, name, price, category, extras, options')
    .in(
      'id',
      order_items.map((i) => i.product_id),
    )) as {
    data:
      | {
          id: number
          name: string
          price: number
          category: string
          extras: { id: string; name: string; price: string }[]
          options: { id: string; name: string; price: string }[]
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

  // Calculate price server-side using DB prices only
  const calculatedTotal = order_items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id)
    if (!product) return sum
    let basePrice: number
    if (item.option) {
      const dbOption = product.options?.find((o) => o.id === item.option!.id)
      basePrice = dbOption ? parseFloat(dbOption.price) : product.price
    } else {
      basePrice = product.price
    }
    const extrasPrice = item.extras.reduce((s, extra) => {
      const dbExtra = product.extras?.find((e) => e.id === extra.id)
      if (!dbExtra) return s
      return s + parseFloat(dbExtra.price) * (extra.quantity ?? 1)
    }, 0)
    return sum + Math.round((basePrice + extrasPrice) * item.quantity)
  }, 0)

  // 3. Compare server-calculated price with SumUp paid amount
  // SumUp returns amount in euros (decimal); convert to cents for comparison
  const paidAmountCents = Math.round(checkoutData.amount * 100)
  if (paidAmountCents !== calculatedTotal) {
    return new Response(
      JSON.stringify({
        error: 'Preisabweichung erkannt',
        expected: calculatedTotal,
        paid: paidAmountCents,
      }),
      {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // 4. Build categories and product_ids from DB data
  const categories = [
    ...new Set(
      order_items
        .map((item) => {
          const product = products.find((p) => p.id === item.product_id)
          return product?.category ?? ''
        })
        .filter(Boolean),
    ),
  ]
  const product_ids = order_items.map((item) => item.product_id.toString())

  // 5. Create order (order_number is auto-assigned by DB trigger)
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('Orders')
    .insert({
      status: 'waiting',
      price: calculatedTotal,
      payment_method: 'online',
      customer_name: customer_name ?? null,
      custom_price: false,
      categories,
      product_ids,
    })
    .select('id, order_number')
    .single()

  if (orderError || !orderData) {
    return new Response(
      JSON.stringify({
        error: 'Bestellung konnte nicht gespeichert werden',
        details: orderError,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // 6. Insert OrderItems with DB-verified prices
  const orderItemsPayload = order_items.map((item) => {
    const product = products.find((p) => p.id === item.product_id)!
    let itemPrice: number
    let resolvedOption: { id: string; name: string; price: string } | null =
      null
    if (item.option) {
      const dbOption = product.options.find((o) => o.id === item.option!.id)!
      itemPrice = parseFloat(dbOption.price)
      resolvedOption = dbOption
    } else {
      itemPrice = product.price
    }
    const resolvedExtras = item.extras
      .map((extra) => {
        const dbExtra = product.extras.find((e) => e.id === extra.id)
        if (!dbExtra) return null
        return { ...dbExtra, quantity: extra.quantity ?? 1 }
      })
      .filter(Boolean)

    const extrasPrice = resolvedExtras.reduce(
      (s, e) => s + parseFloat(e!.price) * (e!.quantity ?? 1),
      0,
    )
    const orderPrice = Math.round((itemPrice + extrasPrice) * item.quantity)

    return {
      order_id: orderData.id,
      product_id: item.product_id,
      product_name: product.name,
      quantity: item.quantity,
      order_price: orderPrice,
      extras: resolvedExtras ?? [],
      option: resolvedOption,
      comment: null,
      finished: false,
    }
  })

  const { error: itemsError } = await supabaseAdmin
    .from('OrderItems')
    .insert(orderItemsPayload)

  if (itemsError) {
    // Attempt rollback: delete the order
    await supabaseAdmin.from('Orders').delete().eq('id', orderData.id)
    return new Response(
      JSON.stringify({
        error: 'Bestellpositionen konnten nicht gespeichert werden',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  return new Response(
    JSON.stringify({
      success: true,
      order_id: orderData.id,
      order_number: orderData.order_number,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
