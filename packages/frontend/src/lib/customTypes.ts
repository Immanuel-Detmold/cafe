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

// Extend the existing Product type with new fields
export type ProductWithVariations = Omit<Product, 'extras' | 'options'> & {
  extras: ProductExtra[]
  options: Variation[]
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
