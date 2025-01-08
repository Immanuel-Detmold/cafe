import { AppData } from '@/data/useAppData'
import { Product } from '@/data/useProducts'
import { checkSameDay } from '@/generalHelperFunctions/dateHelperFunctions'

import { ProductOrder } from '../NewOrder'

type propUpdatePrice = {
  dataOrderItems: ProductOrder[]
  products: Product[]
}

/**
 * Calculate price for a single ProductOrder item
 */
export const calcSingleOrderItemPrice = (
  orderItem: ProductOrder,
  product: Product | undefined,
): number => {
  if (!product) return 0

  // If there's an option, use its price; otherwise, use the product's base price.
  const itemPrice = orderItem.option
    ? parseFloat(orderItem.option.price) // overwrite with option price
    : product.price

  // Extras price
  const extrasPrice = orderItem.extras.reduce((sum, extra) => {
    const extraQuantity = extra.quantity ?? 1
    return sum + parseFloat(extra.price) * extraQuantity
  }, 0)

  // Total for this item = (itemPrice + extras) * quantity
  const singleItemPrice = (itemPrice + extrasPrice) * orderItem.quantity
  return singleItemPrice
}

/**
 * Calculate total price for an array of ProductOrder items
 */
export const calcOrderPrice = (props: propUpdatePrice): number => {
  let total = 0

  props.dataOrderItems.forEach((orderItem) => {
    const product = props.products.find((p) => p.id === orderItem.product_id)
    total += calcSingleOrderItemPrice(orderItem, product)
  })
  return total
}

export function formatCentsToEuroString(priceInCents: string): string {
  // Convert the string to a number, interpret as cents, convert to euros
  const priceNum = parseFloat(priceInCents) / 100
  // Format the price with two decimals, then replace '.' with ','
  return priceNum.toFixed(2).replace('.', ',')
}

// String cents to string euro
export const centsToEuroString = (price: string) => {
  if (price.length <= 2) {
    // If the string has less than or equal to 2 characters, prepend "0,"
    return '0,' + price.padStart(2, '0')
  }
  // Cut the last two characters and insert a comma
  return price.slice(0, -2) + ',' + price.slice(-2)
}

export const getUniqueCategories = (
  dataOrderItems: ProductOrder[],
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

export const getProductIds = (dataOrderItems: ProductOrder[]) => {
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
