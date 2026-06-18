import { supabase } from '@/services/supabase'
import { useQuery } from '@tanstack/react-query'

export type SumUpPayoutSummary = {
  gross_cents: number
  fee_cents: number
  net_cents: number
  transaction_count: number
  fee_complete: boolean
}

export const useSumUpPayoutsQuery = (params: {
  from: string | undefined
  to: string | undefined
  enabled?: boolean
}) =>
  useQuery({
    queryKey: ['sumupPayouts', params.from, params.to],
    queryFn: async (): Promise<SumUpPayoutSummary> => {
      const { data, error } =
        await supabase.functions.invoke<SumUpPayoutSummary>(
          'sumup-fetch-terminal-fee',
          { body: { from: params.from, to: params.to } },
        )
      if (error) throw error
      if (!data) throw new Error('No data returned')
      return data
    },
    enabled: !!params.from && !!params.to && params.enabled !== false,
    staleTime: 5 * 60 * 1000,
  })
