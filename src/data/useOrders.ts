import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type Orders = Database['public']['Tables']['Orders']['Row']
export type InsertOrders = Database['public']['Tables']['Orders']['Insert']
export type OrderItems = Database['public']['Tables']['OrderItems']['Row']
export type OrderItem = {
  product_id: number
  quantity: number
  comment: string
}

export type order_status = Database['public']['Enums']['order_status']
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

// Get Order and Items in Order
// Functions for Table Oders

export const useOrderAndItemsQuery = (status: order_status) =>
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
        .eq('status', status)
        .gte('created_at', new Date().toISOString().split('T')[0] + ' 00:00:00')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      return data
    },
  })
