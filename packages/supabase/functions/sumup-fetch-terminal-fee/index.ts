const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

type TransactionItem = {
  transaction_code?: string
  amount?: number
  status?: string
  type?: string
  refunded_amount?: number
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { from, to } = (await req.json()) as { from: string; to: string }

  if (!from || !to) {
    return new Response(JSON.stringify({ error: 'from and to are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const SUMUP_API_KEY = Deno.env.get('SUMUP_API_KEY') ?? ''
  const SUMUP_MERCHANT_CODE = Deno.env.get('SUMUP_MERCHANT_CODE') ?? ''
  const authHeader = { Authorization: `Bearer ${SUMUP_API_KEY}` }

  // Deno's fetch re-encodes [] brackets via WHATWG URL parsing (SumUp returns 400).
  // Omit array params and filter client-side instead.
  // from/to are full ISO timestamps from the frontend representing local-timezone boundaries.
  const baseParams = new URLSearchParams({
    oldest_time: from,
    newest_time: to,
    limit: '100',
    order: 'ascending',
  })

  const allTransactions: TransactionItem[] = []
  let nextUrl: string | null =
    `https://api.sumup.com/v2.1/merchants/${encodeURIComponent(SUMUP_MERCHANT_CODE)}/transactions/history?` +
    baseParams.toString()

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, { headers: authHeader })
    const data: {
      items?: TransactionItem[]
      links?: { rel: string; href: string }[]
    } = await res.json()

    if (!res.ok) break

    // Only count non-refunded successful payments
    const items: TransactionItem[] = (data.items ?? []).filter(
      (t) =>
        t.status === 'SUCCESSFUL' &&
        t.type === 'PAYMENT' &&
        (t.refunded_amount ?? 0) < (t.amount ?? 0),
    )
    allTransactions.push(...items)

    const nextLink: { rel: string; href: string } | undefined = (
      data.links ?? []
    ).find((l) => l.rel === 'next')
    nextUrl = nextLink?.href ?? null
  }

  const grossCents = Math.round(
    allTransactions.reduce((sum, t) => sum + (t.amount ?? 0), 0) * 100,
  )
  const transactionCount = allTransactions.length

  // Fetch full transaction details in parallel to get fee_amount (capped at 100).
  // top-level fee_amount is not returned by the API; it's in the PAYOUT event.
  type EventItem = { type?: string; status?: string; fee_amount?: number }
  const feeEligible = allTransactions
    .slice(0, 100)
    .filter((t) => !!t.transaction_code)

  const feeAmounts = await Promise.all(
    feeEligible.map(async (t) => {
      try {
        const txRes: Response = await fetch(
          `https://api.sumup.com/v2.1/merchants/${encodeURIComponent(SUMUP_MERCHANT_CODE)}/transactions?` +
            new URLSearchParams({
              transaction_code: t.transaction_code!,
            }).toString(),
          { headers: authHeader },
        )
        if (!txRes.ok) return 0
        const txData = (await txRes.json()) as Record<string, unknown>
        const events = (txData.events ?? []) as EventItem[]
        const payoutEvent = events.find(
          (e) => e.type === 'PAYOUT' && e.status !== 'CANCELLED',
        )
        return payoutEvent?.fee_amount ?? 0
      } catch {
        return 0
      }
    }),
  )

  const feeCents = Math.round(feeAmounts.reduce((sum, f) => sum + f, 0) * 100)

  return new Response(
    JSON.stringify({
      gross_cents: grossCents,
      fee_cents: feeCents,
      net_cents: grossCents - feeCents,
      transaction_count: transactionCount,
      fee_complete: transactionCount <= 100,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
