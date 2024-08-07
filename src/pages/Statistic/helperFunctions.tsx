import { CafeCard } from '@/data/useCafeCard'
import { OrderItems, OrdersAndItems } from '@/data/useOrders'
import { UserActionsType } from '@/data/useUserActions.tsx'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'

// Get Sum Price of Orders
export const getSumOrders = (dataOrders: OrdersAndItems) => {
  const sum = dataOrders.reduce((total, order) => total + order.price, 0)
  return centsToEuro(sum)
}

// Get Sum of Cafe Cards
export const getSumCafeCards = (dataOrders: CafeCard[]) => {
  const sum = dataOrders.reduce((total, card) => total + card.price, 0)
  return sum
}

//  Get Sum of Cafe Cards for this Year
export const getSumCafeCardsOrders = (dataOrders: OrdersAndItems) => {
  const sum = dataOrders.reduce((total, order) => {
    if (order.payment_method === 'cafe_card' && order.status === 'finished') {
      return total + order.price
    }
    return total
  }, 0)
  return sum
}

export const getSumCafeCardsGrouped = (dataCards: CafeCard[]) => {
  let tenCardCount = 0
  let fiveCardCount = 0
  dataCards.forEach((card) => {
    if (card.price === 1000) {
      tenCardCount++
    }
    if (card.price === 500) {
      fiveCardCount++
    }
  })
  return { tenCardCount, fiveCardCount }
}

// Get Distinct Dates
export const getDistinctDates = (dataOrders: OrdersAndItems) => {
  const distinctDates: string[] = []
  dataOrders.forEach((order) => {
    // Add Local Date to the List
    const date = convertUTCToLocalTime(order.created_at)
    if (!distinctDates.includes(date)) {
      distinctDates.push(date)
    }
  })

  return distinctDates
}

// Get Distinct Dates UserActions
export const getDistinctDatesUser = (dataUserActions: UserActionsType[]) => {
  const distinctDates: string[] = []
  dataUserActions.forEach((action) => {
    // Add Local Date to the List
    const date = convertUTCToLocalTime(action.created_at)
    if (!distinctDates.includes(date)) {
      distinctDates.push(date)
    }
  })

  return distinctDates
}

export const getDistinctDatesData = <T extends { created_at: string }>(
  data: T[],
) => {
  const distinctDates: string[] = []
  data.forEach((item) => {
    // Add Local Date to the List
    const date = convertUTCToLocalTime(item.created_at)
    if (!distinctDates.includes(date)) {
      distinctDates.push(date)
    }
  })

  return distinctDates
}

// Convert UTC to Local Time Input: 2021-10-06T08:00:00.000Z -> Output: 2021-10-06
export const convertUTCToLocalTime = (inputDate: string) => {
  inputDate = inputDate?.split('.')[0] || ''
  const dateUTC = new Date(inputDate)
  const finalDate = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60 * 1000,
  )

  return finalDate.toLocaleDateString('en-CA')
}

// Return sum of payment method
export const getSumOrdersPayMethod = (
  dataOrders: OrdersAndItems,
  payment_method?: string,
) => {
  if (!payment_method) {
    const sum = dataOrders.reduce((total, order) => total + order.price, 0)
    return centsToEuro(sum)
  }

  const sum = dataOrders.reduce((total, order) => {
    if (order.payment_method === payment_method) {
      return total + order.price
    }
    return total
  }, 0)
  return centsToEuro(sum)
}

type ProductData = {
  id: number
  name: string
  price: number
  quantity: number
  sum: number
}

// Transform Orders to Product Groups for Statistic Page
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
