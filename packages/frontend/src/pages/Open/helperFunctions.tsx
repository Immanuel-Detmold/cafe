import { Order, OrderItem, OrdersAndItems } from '@/data/useOrders'
import { Product } from '@/data/useProducts'

export type OpenOrder = Order & {
  OrderItems: Array<OrderItem & { Products: Product }>
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
