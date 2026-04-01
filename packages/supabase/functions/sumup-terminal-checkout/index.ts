import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

type OrderItemInput = {
  product_id: number
  quantity: number
  extras: unknown[]
  option: { id: string; name: string; price: string } | null
  comment: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // --- Auth: require valid staff session ---
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseForAuth = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )

  const {
    data: { user },
    error: authError,
  } = await supabaseForAuth.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { order_items, custom_price_value } = (await req.json()) as {
    order_items: OrderItemInput[]
    custom_price_value?: number | null
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
    .select('id, price')
    .in(
      'id',
      order_items.map((i) => i.product_id),
    )) as {
    data: { id: number; price: number }[] | null
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

  // --- Calculate price server-side ---
  const calculatedTotal = order_items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id)
    const basePrice = item.option
      ? parseFloat(item.option.price)
      : product?.price ?? 0
    const extrasPrice = (
      item.extras as { price: string; quantity?: number }[]
    ).reduce((s, e) => s + parseFloat(e.price) * (e.quantity ?? 1), 0)
    return sum + Math.round((basePrice + extrasPrice) * item.quantity)
  }, 0)

  const finalPrice =
    custom_price_value != null ? custom_price_value : calculatedTotal

  // --- Call SumUp terminal ---
  const SUMUP_API_KEY = Deno.env.get('SUMUP_API_KEY') ?? ''
  const SUMUP_MERCHANT_CODE = Deno.env.get('SUMUP_MERCHANT_CODE') ?? ''
  const SUMUP_READER_ID = Deno.env.get('SUMUP_READER_ID') ?? ''

  const sumupResponse = await fetch(
    `https://api.sumup.com/v0.1/merchants/${SUMUP_MERCHANT_CODE}/readers/${SUMUP_READER_ID}/checkout`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUMUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        total_amount: { currency: 'EUR', minor_unit: 2, value: finalPrice },
      }),
    },
  )

  const sumupBody = await sumupResponse.json()

  if (!sumupResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'SumUp Terminal Fehler', details: sumupBody }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // Return verified price so frontend creates the order with the correct amount
  return new Response(
    JSON.stringify({ success: true, verified_price: finalPrice }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
