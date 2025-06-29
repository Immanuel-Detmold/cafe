import { queryClient } from '@/App'
import { getStartOfDayToday } from '@/generalHelperFunctions/dateHelperFunctions.tsx'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions.tsx'

export type Order = Database['public']['Tables']['Orders']['Row']
export type GetOrder = Database['public']['Tables']['Orders']['Row']
export type InsertOrders = Database['public']['Tables']['Orders']['Insert']
export type OrderItem = Database['public']['Tables']['OrderItems']['Row']
export type InsertOrderItem =
  Database['public']['Tables']['OrderItems']['Insert']
export type UpdateOrderItem =
  Database['public']['Tables']['OrderItems']['Update']

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

// Get data from Table Orders
export const useOrder = ({
  startDate,
  endDate,
}: {
  startDate?: string
  endDate?: string
}) =>
  useQuery({
    queryKey: ['orders', startDate, endDate],
    queryFn: async () => {
      let query = supabase.from('Orders').select()

      if (startDate !== '' && startDate !== undefined) {
        query = query.gte('created_at', startDate)
      }
      if (endDate !== '' && endDate !== undefined) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query

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
      const { data, error } = await supabase
        .from('Orders')
        .insert(order)
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Save Order: ${data[0]?.order_number}`,
      })
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
    onSuccess: async (data) => {
      let productNames = ''
      for (let i = 0; i < data.length; i++) {
        productNames += data[i]?.product_name + ', '
      }

      await saveUserAction({
        action: data,
        short_description: `Save OrderItems: ${productNames.slice(0, -2)}`,
      })
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
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })

      await saveUserAction({
        action: data,
        short_description: `Delete Order: ${data[0]?.order_number}`,
      })
    },
  })
}

export type OrdersAndItems = NonNullable<
  ReturnType<typeof useOrderAndItemsQuery>['data']
>

export type OrdersAndItemsV2 = NonNullable<
  ReturnType<typeof useOrdersAndItemsQueryV2>['data']
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
        .gte('created_at', getStartOfDayToday().finalDateString)
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
  endDate,
  payment_method,
  revenue_stream_id,
}: {
  statusList?: OrderStatus[]
  searchTerm?: string
  categories?: string[]
  products?: string[]
  startDate?: string
  endDate?: string
  payment_method?: string
  revenue_stream_id?: number
}) =>
  useQuery({
    queryKey: [
      'ordersAndItems',
      statusList,
      searchTerm,
      categories,
      products,
      startDate,
      endDate,
      payment_method,
      revenue_stream_id,
    ],
    queryFn: async () => {
      let query = supabase
        .from('Orders')
        .select(
          `*, 
        OrderItems (*,
          Products (*)
        )`,
        )
        .order('created_at', { ascending: false })

      if (statusList && statusList.length > 0) {
        query = query.in('status', statusList)
      }
      if (startDate !== '' && startDate !== undefined) {
        query = query.gte('created_at', startDate)
      }
      if (revenue_stream_id !== undefined) {
        query = query.eq('revenue_stream_id', revenue_stream_id)
      }
      if (endDate !== '' && endDate !== undefined) {
        query = query.lte('created_at', endDate)
      }
      if (searchTerm && !isNaN(Number(searchTerm))) {
        // query = query.eq('id', Number(searchTerm))
        query = query.ilike('order_number', `%${searchTerm}%`)
      } else if (searchTerm && searchTerm.length > 0) {
        query = query.ilike('customer_name', `%${searchTerm}%`)
      }
      if (categories && categories.length > 0) {
        const categoryFilter = categories
          .map((category) => `categories.cs.{"${category}"}`)
          .join(', ')

        query = query.or(categoryFilter)
      }
      if (products && products.length > 0) {
        const productFilter = products
          .map((productId) => `product_ids.cs.{"${productId}"}`)
          .join(', ')
        query = query.or(productFilter)
      }
      const { data, error } = await query

      if (error) {
        throw error
      }

      const formattedData = sortDataOrderItems(data)
      return formattedData.reverse()
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
      // await saveUserAction({
      //   action: data,
      //   short_description: `Change Order Status: ${data[0]?.order_number} - ${data[0]?.status}`,
      // })
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

// Update OrderItem Status (Column finished) (click on shopping bag)
export const useUpdateOrderItemStatusMutation = () => {
  return useMutation({
    mutationFn: async ({
      orderItemId,
      newStatus,
    }: {
      orderItemId: number
      newStatus: boolean
    }) => {
      const { data, error } = await supabase
        .from('OrderItems')
        .update({ finished: newStatus })
        .eq('id', orderItemId)
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

// Sort OrderItems after product_name and then id
const sortDataOrderItems = (orderAndItems: OrdersAndItems) => {
  const formatedData = orderAndItems.map((order) => {
    const sorted = order.OrderItems.sort((a, b) => {
      // Compare by product_name
      const productComparison = a.product_name.localeCompare(b.product_name)
      if (productComparison !== 0) {
        return productComparison // Use product_name comparison if they differ
      }

      // If product_name is the same, compare by id
      return a.id - b.id
    })

    return {
      ...order,
      OrderItems: sorted,
    }
  })

  return formatedData
}

export const useSingleOrder = ({ orderId }: { orderId: string | undefined }) =>
  useQuery({
    queryKey: ['singleOrder', orderId],
    queryFn: async () => {
      if (!orderId) return null
      const { data, error } = await supabase
        .from('Orders')
        .select(
          `*, 
        OrderItems (*,
          Products (*)
        )`,
        )
        .eq('id', orderId)
        .single()

      if (error) {
        throw error
      }
      return data
    },
  })
