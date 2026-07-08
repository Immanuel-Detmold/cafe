import { queryClient } from '@/App'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction.tsx'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { OrderItem } from './useOrders'
import { Product } from './useProducts'
import { saveUserAction } from './useUserActions.tsx'

export type CafeCard = Database['public']['Tables']['CafeCards']['Row']
export type CafeCardInsert = Database['public']['Tables']['CafeCards']['Insert']

/**
 * Build one CafeCards insert row per unit of every finished order item
 * whose product is marked as a Cafe Card. Extras are intentionally
 * excluded from the card face value — only the product/option price counts.
 */
export const buildCafeCardInsertsFromOrderItems = (
  orderItems: OrderItem[],
  products: Product[],
  orderId: number,
): CafeCardInsert[] => {
  const inserts: CafeCardInsert[] = []
  orderItems.forEach((item) => {
    const product = products.find((p) => p.id === item.product_id)
    if (!product?.is_cafe_card) return

    const option = item.option as { price: string } | null
    const unitPrice = option ? parseFloat(option.price) : product.price

    for (let i = 0; i < item.quantity; i++) {
      inserts.push({ price: unitPrice, order_id: orderId })
    }
  })
  return inserts
}

// Get Cafe Cards
export const useCafeCards = ({
  startDate,
  endDate,
}: {
  startDate?: string
  endDate?: string
}) =>
  useQuery({
    queryKey: ['cafeCards', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('CafeCards')
        .select()
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query

      if (error) {
        console.log(error)
        throw error
      }

      return data
    },
  })

export const useCreateCafeCard = () =>
  useMutation({
    mutationFn: async (cafeCard: CafeCardInsert) => {
      const { data, error } = await supabase
        .from('CafeCards')
        .insert([cafeCard])
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })

      await saveUserAction({
        action: data,
        short_description: `Created Card: ${centsToEuro(data[0]?.price ?? 0)}`,
      })
    },
  })

export const useCreateCafeCards = () =>
  useMutation({
    mutationFn: async (cafeCards: CafeCardInsert[]) => {
      const groupId = crypto.randomUUID()
      const cardsWithGroup = cafeCards.map((c) => ({
        ...c,
        purchase_group_id: groupId,
      }))
      const { data, error } = await supabase
        .from('CafeCards')
        .insert(cardsWithGroup)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })

      await saveUserAction({
        action: data,
        short_description: `Created ${data.length} Cards: ${data.map((c) => `${centsToEuro(c.price)}€`).join(', ')}`,
      })
    },
  })
