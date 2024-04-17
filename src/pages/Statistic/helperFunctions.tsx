import { OrdersAndItems } from '@/data/useOrders'

export const getSumOrders = (dataOrders: OrdersAndItems) => {
  //   const sum = dataOrders.reduce((total, order) => total + order.amount, 0)
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
