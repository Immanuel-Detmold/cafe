import { OrdersAndItems } from '@/data/useOrders'

export const getSumOrders = (dataOrders: OrdersAndItems) => {
  //   const sum = dataOrders.reduce((total, order) => total + order.amount, 0)
  console.log(dataOrders)
  const sum = dataOrders.reduce((total, order) => total + order.price, 0)
  return sum
}
