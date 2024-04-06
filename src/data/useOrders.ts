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
type order_status = Database['public']['Enums']['order_status']

export const useOrderQuery = (status: order_status) =>
  useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Orders')
        .select()
        .eq('status', status)

      if (error) {
        throw error
      }
      return data
    },
  })

// Requests OrderItems with specific orderIds
export const useOrderItemsQuery = (orderIds: number[]) =>
  useQuery({
    queryKey: ['orderItems', orderIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('OrderItems')
        .select()
        .in('id', orderIds)

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

export type InsertOrderItems =
  Database['public']['Tables']['OrderItems']['Insert']
// Function save OrderItems
export const useSaveOrderItemsMutation = () => {
  return useMutation({
    mutationFn: async (orderItems: InsertOrderItems[]) => {
      const { data, error } = await supabase
        .from('OrderItems')
        .insert(orderItems)
        .select()
      if (error) {
        throw error
      }
      return data
    },
  })
}

// Function delete Order
export const useDeleteOrderMutation = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data, error } = await supabase
        .from('Orders')
        .delete()
        .eq('id', orderId)
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
