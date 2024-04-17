import { OrderItems, OrdersAndItems } from '@/data/useOrders'

export const getSumOrders = (dataOrders: OrdersAndItems) => {
  const sum = dataOrders.reduce((total, order) => total + order.price, 0)
  return sum
}

export const getDistinctDates = (dataOrders: OrdersAndItems) => {
  const distinctDates: string[] = []
  dataOrders.forEach((order) => {
    const date = order.created_at.split('T')[0] || '2000.01.01'
    if (!distinctDates.includes(date)) {
      distinctDates.push(date)
    }
  })

  return distinctDates
}

// Return sum of payment method
export const getSumOrdersPayMethod = (
  dataOrders: OrdersAndItems,
  payment_method?: string,
) => {
  if (!payment_method) {
    const sum = dataOrders.reduce((total, order) => total + order.price, 0)
    return sum
  }

  const sum = dataOrders.reduce((total, order) => {
    if (order.payment_method === payment_method) {
      return total + order.price
    }
    return total
  }, 0)
  return sum
}

type ProductData = {
  id: number
  name: string
  price: number
  quantity: number
  sum: number
}

export const transformOrdersToProductGroups = (dataOrders: OrdersAndItems) => {
  const productData: ProductData[] = []

  dataOrders.forEach((order) => {
    order.OrderItems.forEach((orderItem: OrderItems) => {
      const existingProduct = productData.find(
        (product) => product.id === orderItem.product_id,
      )

      if (existingProduct) {
        existingProduct.quantity += orderItem.quantity
        existingProduct.sum += orderItem.product_price * orderItem.quantity
      } else {
        productData.push({
          id: orderItem.product_id,
          name: orderItem.product_name,
          price: orderItem.product_price,
          quantity: orderItem.quantity,
          sum: orderItem.product_price * orderItem.quantity,
        })
      }
    })
  })

  const sum = productData.reduce((total, product) => total + product.sum, 0)

  return { productData, sum }
}
