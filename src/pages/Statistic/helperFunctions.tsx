import { OrdersAndItems } from '@/data/useOrders'

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
    console.log(order)
    if (order.payment_method === payment_method) {
      return total + order.price
    }
    return total
  }, 0)
  console.log('Summe: ', sum)
  return sum
}
