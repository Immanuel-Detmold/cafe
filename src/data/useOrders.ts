import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useQuery } from '@tanstack/react-query'

export type Orders = Database['public']['Tables']['Orders']['Row']
export type OrderItems = Database['public']['Tables']['OrderItems']['Row']

// Functions for Table Oders
export const useOrdersQuery = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Orders').select()

      if (error) {
        throw error
      }
      return data
    },
  })

// Functions for Tablle OrderItems
export const useOrderItemsQuery = () =>
  useQuery({
    queryKey: ['orderItems'],
    queryFn: async () => {
      const { data, error } = await supabase.from('OrderItems').select()
      if (error) {
        throw error
      }
      return data
    },
  })
