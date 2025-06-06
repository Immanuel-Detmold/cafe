// data/useRevenueStreams.ts
import { queryClient } from '@/App'
import { OrderStatus } from '@/data/useOrders.ts'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions'

export type RevenueStream =
  Database['public']['Tables']['RevenueStreams']['Row']
export type InsertRevenueStream =
  Database['public']['Tables']['RevenueStreams']['Insert']
export type UpdateRevenueStream =
  Database['public']['Tables']['RevenueStreams']['Update']

// Get all active revenue streams for current user
export const useRevenueStreamsQuery = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: ['revenueStreams', activeOnly],
    queryFn: async (): Promise<RevenueStream[]> => {
      let query = supabase
        .from('RevenueStreams')
        .select('*')
        .order('is_default', { ascending: false })
        .eq('active', true)
        .order('name', { ascending: true })

      // Only filter by active status if activeOnly is explicitly provided
      if (activeOnly !== undefined) {
        query = query.eq('active', activeOnly)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
  })
}

// 🔒 TypeSafe helper function
export const getDefaultRevenueStream = (
  revenueStreams: RevenueStream[],
): RevenueStream | null => {
  return revenueStreams?.find((stream) => stream.is_default) || null
}

// Get default revenue stream
export const useDefaultRevenueStreamQuery = () => {
  return useQuery({
    queryKey: ['defaultRevenueStream'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('RevenueStreams')
        .select('*')
        .eq('is_default', true)
        .eq('active', true)
        .maybeSingle() // Use maybeSingle to avoid error if no default exists

      if (error) throw error
      return data
    },
  })
}

// Create new revenue stream
export const useCreateRevenueStreamMutation = () =>
  useMutation({
    mutationFn: async (newStream: InsertRevenueStream) => {
      // If this is set as default, unset all other defaults first
      if (newStream.is_default) {
        await supabase
          .from('RevenueStreams')
          .update({ is_default: false })
          .neq('id', 0) // Update all existing
      }

      const { data, error } = await supabase
        .from('RevenueStreams')
        .insert(newStream)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['revenueStreams'] })
      await queryClient.invalidateQueries({
        queryKey: ['defaultRevenueStream'],
      })

      await saveUserAction({
        action: data,
        short_description: `Created Revenue Stream: ${data.name}`,
      })
    },
  })

// Update revenue stream
export const useUpdateRevenueStreamMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number
      updates: UpdateRevenueStream
    }) => {
      // If this is being set as default, unset all other defaults first
      if (updates.is_default) {
        await supabase
          .from('RevenueStreams')
          .update({ is_default: false })
          .neq('id', id)
      }

      const { data, error } = await supabase
        .from('RevenueStreams')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['revenueStreams'] })
      await queryClient.invalidateQueries({
        queryKey: ['defaultRevenueStream'],
      })

      await saveUserAction({
        action: data,
        short_description: `Updated Revenue Stream: ${data.name}`,
      })
    },
  })

// Soft delete revenue stream (set active to false)
export const useDeleteRevenueStreamMutation = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('RevenueStreams')
        .update({ active: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['revenueStreams'] })

      await saveUserAction({
        action: data,
        short_description: `Deactivated Revenue Stream: ${data.name}`,
      })
    },
  })

// Get orders with revenue stream info
export const useOrdersWithRevenueStreamQuery = ({
  startDate,
  endDate,
  revenueStreamIds,
}: {
  startDate?: string
  endDate?: string
  revenueStreamIds?: number[]
}) => {
  return useQuery({
    queryKey: ['ordersWithRevenueStream', startDate, endDate, revenueStreamIds],
    queryFn: async () => {
      let query = supabase
        .from('Orders')
        .select(
          `
          *,
          RevenueStreams (
            id,
            name,
            color,
            icon
          ),
          OrderItems (*, Products (*))
        `,
        )
        .order('created_at', { ascending: false })

      if (startDate) query = query.gte('created_at', startDate)
      if (endDate) query = query.lte('created_at', endDate)
      if (revenueStreamIds && revenueStreamIds.length > 0) {
        query = query.in('revenue_stream_id', revenueStreamIds)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export const useOrdersWithRevenueStreamQueryV2 = ({
  statusList,
  searchTerm,
  categories,
  products,
  startDate,
  endDate,
  payment_method,
  revenueStreamIds,
}: {
  statusList?: OrderStatus[]
  searchTerm?: string
  categories?: string[]
  products?: string[]
  startDate?: string
  endDate?: string
  payment_method?: string
  revenueStreamIds?: number[]
}) =>
  useQuery({
    queryKey: [
      'ordersAndItemsWithRevenue',
      statusList,
      searchTerm,
      categories,
      products,
      startDate,
      endDate,
      payment_method,
      revenueStreamIds,
    ],
    queryFn: async () => {
      let query = supabase
        .from('Orders')
        .select(
          `
          *, 
          RevenueStreams (
            id,
            name,
            color,
            icon
          ),
          OrderItems (*,
            Products (*)
          )
        `,
        )
        .order('created_at', { ascending: false })

      if (statusList && statusList.length > 0) {
        query = query.in('status', statusList)
      }
      if (startDate) query = query.gte('created_at', startDate)
      if (endDate) query = query.lte('created_at', endDate)
      if (searchTerm && !isNaN(Number(searchTerm))) {
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
      if (revenueStreamIds && revenueStreamIds.length > 0) {
        query = query.in('revenue_stream_id', revenueStreamIds)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
