import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
// import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

// export type AppData = Database['public']['Tables']['AppData']['Row']

export type AppData = ReturnType<typeof useAppData>['data']

// Returns localhost:8080 when running locally, otherwise the IP from the database
export const getServerIp = (dbIp: string): string => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'http://localhost:8080'
  }
  return dbIp
}

export const useAppData = () =>
  useQuery({
    queryKey: ['appData'],
    queryFn: async () => {
      const { data, error } = await supabase.from('AppData').select()

      if (error) {
        throw error
      }
      return data
    },
  })

export const DEFAULT_TABLE_COUNT = 30

/** Table numbers ("1".."N"), N read from the `table_count` AppData key (falls back to DEFAULT_TABLE_COUNT). */
export const getTableNumbers = (appData: AppData): string[] => {
  const entry = appData?.find((item) => item.key === 'table_count')
  const parsed = entry ? parseInt(entry.value, 10) : NaN
  const count =
    Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TABLE_COUNT
  return Array.from({ length: count }, (_, i) => String(i + 1))
}

export type GetAppData = {
  created_at: string
  description: string | null
  id: number
  key: string
  last_edit: string
  value: string
}

// Update AppData value
export const useUpdateAppData = () => {
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('AppData')
        .update({
          value: value,
          last_edit: new Date().toISOString().split('.')[0],
        })
        .eq('key', key)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appData'] })
    },
  })
}
