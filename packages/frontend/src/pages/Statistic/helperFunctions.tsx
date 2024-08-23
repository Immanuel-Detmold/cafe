import { CafeCard } from '@/data/useCafeCard'
import { Expense } from '@/data/useExpense'
import { OrderItems, OrdersAndItems } from '@/data/useOrders'
import { UserActionsType } from '@/data/useUserActions.tsx'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'

// Get Sum Price of Orders
export const getSumPriceData = <T extends { price: number }>(
  dataOrders: T[],
) => {
  const sum = dataOrders.reduce((total, order) => total + order.price, 0)
  return centsToEuro(sum)
}

// !!! CHECK IF CORRECT
export const getSumOrdersV2 = (
  dataOrders: OrdersAndItems,
  startDate: Date,
  endDate: Date,
) => {
  const sum = dataOrders.reduce((total, order) => {
    const orderDate = new Date(order.created_at)
    if (orderDate >= startDate && orderDate <= endDate) {
      return total + order.price
    }
    return total
  }, 0)
  return sum
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
export const getDistinctDates = <T extends { created_at: string }>(
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
  console.log(distinctDates)
  return distinctDates
}

// Returns Distinct Years -> ['2024', '2025', '2026']
export const getDistinctYears = <
  T extends { created_at: string; purchase_date?: string },
>(
  data: T[],
): string[] => {
  const distinctYears: string[] = []

  data.forEach((item) => {
    // Use purchase_date if it exists, otherwise fall back to created_at
    const year = new Date(item.purchase_date || item.created_at)
      .getFullYear()
      .toString()

    if (!distinctYears.includes(year)) {
      distinctYears.push(year)
    }
  })

  return distinctYears
}

// Get distinct Months
export const getDistinctMonths = <T extends { created_at: string }>(
  data: T[],
) => {
  const distinctMonths: string[] = []
  data.forEach((item) => {
    const month = new Date(item.created_at).getMonth().toString()
    if (!distinctMonths.includes(month)) {
      distinctMonths.push(month)
    }
  })
  return distinctMonths
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

// 2024-06-25 15:49:24.767868+00 -> 2024
export const convertUTCToYear = (inputDate: string) => {
  inputDate = inputDate?.split('.')[0] || ''
  const dateUTC = new Date(inputDate)
  const finalDate = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60 * 1000,
  )

  return finalDate.getFullYear().toString()
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

// !!! CHECK IF CORRECT Sum Expenses
export const getSumExpenses = (
  dataExpenses: Expense[],
  startDate: Date,
  endDate: Date,
) => {
  const sum = dataExpenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.purchase_date)
    if (expenseDate >= startDate && expenseDate <= endDate) {
      return total + expense.price
    }
    return total
  }, 0)

  return sum
}
