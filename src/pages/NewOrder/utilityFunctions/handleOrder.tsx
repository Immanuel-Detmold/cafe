import { AppData } from '@/data/useAppData'
import { OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { checkSameDay } from '@/generalHelperFunctions.tsx/dateHelperFunctions'

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

export const GetOrderNumber = (appData: AppData) => {
  if (appData === undefined) {
    return '1'
  }

  // if date it different, reset order number

  // checkSameDay(appData)
  const order_number_row = appData.find((data) => data.key === 'order_number')

  const orderNumber = order_number_row?.value ?? '0'

  const last_edit = order_number_row?.last_edit ?? '1'
  const sameDay = checkSameDay(last_edit)

  if (!sameDay) {
    return '1'
  }
  const number = (parseInt(orderNumber) + 1) % 100

  if (number === 0) {
    return '1'
  }
  return number.toString()
}
