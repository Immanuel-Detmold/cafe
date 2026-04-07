import { InsertOrderItem, OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

export type Variation = {
  id: string
  name: string
  price: string
}

export type ProductExtra = {
  id: string
  name: string
  price: string
  quantity?: number
}

export type ConsumptionItem = {
  name: string
  quantity: string
}

// Defined explicitly to avoid @typescript-eslint issues with recursive Json type from Supabase
export type ProductWithVariations = {
  advertisement: boolean
  category: string
  consumption: ConsumptionItem[] | null
  created_at: string
  deleted: boolean | null
  description: string | null
  extras: ProductExtra[]
  id: number
  image: string | null
  images: string[] | null
  method: string | null
  name: string
  only_advertisement_screen: boolean
  options: Variation[]
  paused: boolean
  price: number
  short_description: string | null
  show_consumption: boolean
  show_stock_colors: boolean
  stock: number | null
  user_id: string | null
}

export type OrderItemWithVariations = Omit<OrderItem, 'extras' | 'option'> & {
  extras: ProductExtra[]
  option: Variation
}

export type OrderItemsVariationsProduct = OrderItemWithVariations & {
  Products: Product
}

export type InsertOrderItemWithVariations = Omit<
  InsertOrderItem,
  'extras' | 'option'
> & {
  extras: ProductExtra[]
  option: Variation
}
