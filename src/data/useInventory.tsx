import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useQuery } from '@tanstack/react-query'

export type Inventory = Database['public']['Tables']['Inventory']['Row']

export const useInventory = () =>
  useQuery({
    queryKey: ['userActions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Inventory')
        .select()
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data
    },
  })
