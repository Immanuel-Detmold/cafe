import { OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

type propUpdatePrice = {
  dataOrderItems: OrderItem[]
  products: Product[]
}

export const calcOrderPrice = (props: propUpdatePrice) => {
  let total = 0
  props.dataOrderItems.forEach((orderItem) => {
    const product = props.products.find(
      (product) => product.id === orderItem.product_id,
    )
    if (product) {
      total += product.price * orderItem.quantity
    }
  })
  return total
}

export const getUniqueCategories = (
  dataOrderItems: OrderItem[],
  products: Product[],
) => {
  const categories = new Set<string>()
  dataOrderItems.forEach((orderItem) => {
    const product = products.find(
      (product) => product.id === orderItem.product_id,
    )
    if (product) {
      categories.add(product.category)
    }
  })
  const uniqueCat = Array.from(categories)
  return uniqueCat
}

export const getProductIds = (dataOrderItems: OrderItem[]) => {
  const productIds = new Array<string>()
  dataOrderItems.forEach((orderItem) => {
    productIds.push(orderItem.product_id.toString())
  })
  return productIds
}
