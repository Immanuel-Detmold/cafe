import { Order, OrderItems, OrdersAndItems } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

export const formatDateToTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  // Format the time to hh:mm format
  const time = date.toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return time.toString()
}

export type OpenOrder = Order & {
  OrderItems: Array<OrderItems & { Products: Product }>
}

export const getCategoriesAndProducts = (orderData?: OrdersAndItems) => {
  if (orderData) {
    // Extract unique product objects from orders
    const currentProducts: Product[] = []
    orderData.forEach((order) =>
      order.OrderItems.forEach((item) => {
        if (
          !currentProducts.some((product) => product.id === item.Products?.id)
        ) {
          item.Products && currentProducts.push(item.Products)
        }
      }),
    )

    // Extract unique category names from products
    const currentCategoriesSet = new Set<string>()
    orderData.forEach((order) =>
      order?.OrderItems.forEach((item) => {
        item.Products?.category &&
          currentCategoriesSet.add(item.Products.category)
      }),
    )
    const currentCategories = Array.from(currentCategoriesSet)

    return { currentCategories, currentProducts }
  } else {
    return { currentCategories: [], currentProducts: [] }
  }
}
