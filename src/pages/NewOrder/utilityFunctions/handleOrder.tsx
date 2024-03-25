import { OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

type propUpdatePrice = {
  dataOrderItems: OrderItem[]
  products: Product[]
}

export const calcOrderPrice = (props: propUpdatePrice) => {
  let total = 0
  props.dataOrderItems.forEach((orderItem) => {
    const product = props.products.find((product) => product.id === orderItem.product_id)
    if (product) {
      total += product.price * orderItem.quantity
    }
  })
  return total
}
