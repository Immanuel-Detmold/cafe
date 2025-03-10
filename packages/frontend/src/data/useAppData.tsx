import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
// import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

// export type AppData = Database['public']['Tables']['AppData']['Row']

export type AppData = ReturnType<typeof useAppData>['data']

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
