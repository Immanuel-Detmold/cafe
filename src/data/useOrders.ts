import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type GetOrders = Database['public']['Tables']['Orders']['Row']
export type InsertOrders = Database['public']['Tables']['Orders']['Insert']
export type OrderItems = Database['public']['Tables']['OrderItems']['Row']

export type OrderItem = {
  product_id: number
  quantity: number
  comment: string
}

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

// Function save Order
export const useSaveOrderMutation = () => {
  return useMutation({
    mutationFn: async (order: InsertOrders) => {
      const { data: data, error } = await supabase
        .from('Orders')
        .insert(order)
        .select()
      if (error) {
        throw error
      }
      return data
    },
  })
}

// function useSessionStorage(key: string) {
//   const [value, setValue] = useState<OrderItem[]>(() => {
//     const storedValue: string | null = sessionStorage.getItem(key);
//     return storedValue ? JSON.parse(storedValue) : [];
//   });

//   useEffect(() => {
//     sessionStorage.setItem(key, JSON.stringify(value));
//   }, [key, value]);

//   return [value, setValue] as const;
// }

// export default useSessionStorage;
