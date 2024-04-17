import { queryClient } from '@/App'
import { getTodaysDate } from '@/generalHelperFunctions.tsx/dateHelperFunctions'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type Order = Database['public']['Tables']['Orders']['Row']
export type InsertOrders = Database['public']['Tables']['Orders']['Insert']
export type OrderItems = Database['public']['Tables']['OrderItems']['Row']

export type OrderItem = {
  product_id: number
  quantity: number
  comment: string
}

export type OrderStatus = Database['public']['Enums']['order_status']
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
    onSuccess: async () => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
    },
  })
}

export type OrdersAndItems = NonNullable<
  ReturnType<typeof useOrderAndItemsQuery>['data']
>

// Get Order and Items in Order
// Functions for Table Oders
export const useOrderAndItemsQuery = (status: OrderStatus[]) =>
  useQuery({
    queryKey: ['ordersAndItems', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Orders')
        .select(
          `*, 
        OrderItems (*, 
          Products (*)
        )`,
        )
        .in('status', status)
        .gte('created_at', getTodaysDate())
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      return data
    },
  })

export const useOrdersAndItemsQueryV2 = ({
  statusList,
  searchTerm,
  categories,
  products,
  startDate,
}: {
  statusList: OrderStatus[]
  searchTerm: string
  categories: string[]
  products: string[]
  startDate: string
}) =>
  useQuery({
    queryKey: [
      'ordersAndItems',
      statusList,
      searchTerm,
      categories,
      products,
      startDate,
    ],
    queryFn: async () => {
      const categoryFilter = categories
        .map((category) => `categories.cs.{"${category}"}`)
        .join(', ')

      const productFilter = products
        .map((productId) => `product_ids.cs.{"${productId}"}`)
        .join(', ')

      let query = supabase
        .from('Orders')
        .select(
          `*, 
        OrderItems (*,
          Products (*)
        )`,
        )
        .in('status', statusList)
        .gte('created_at', startDate)
        .order('created_at', { ascending: false })

      if (searchTerm && !isNaN(Number(searchTerm))) {
        query = query.eq('id', Number(searchTerm))
      } else {
        query = query.ilike('customer_name', `%${searchTerm}%`)
      }
      if (categories.length !== 0) {
        query = query.or(categoryFilter)
      }
      if (products.length !== 0) {
        query = query.or(productFilter)
      }
      const { data, error } = await query

      if (error) {
        throw error
      }
      return data
    },
  })

export const useChageOrderStatusMutation = (orderId: number) => {
  return useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      const { data, error } = await supabase
        .from('Orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
    },
  })
}

// V2: Change Parameter position
export const useChageOrderStatusMutationV2 = () => {
  return useMutation({
    mutationFn: async ({
      newStatus,
      orderId,
    }: {
      newStatus: OrderStatus
      orderId: number
    }) => {
      const { data, error } = await supabase
        .from('Orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
    },
  })
}
