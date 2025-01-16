import { CafeCard } from '@/data/useCafeCard'
import { Expense } from '@/data/useExpense'
import { OrderItem, OrdersAndItems } from '@/data/useOrders'
import { UserActionsType } from '@/data/useUserActions.tsx'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'

// Get Sum Price of Orders
// Also filter away orders with payment_method 'voucher' and 'youth'
export const getSumPriceData = <
  T extends { price: number; payment_method?: string },
>(
  dataOrders: T[],
) => {
  const sum = dataOrders
    .filter(
      (order) =>
        order.payment_method !== 'voucher' && order.payment_method !== 'youth',
    )
    .reduce((total, order) => total + order.price, 0)
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
  return distinctDates.reverse()
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
    order.OrderItems.forEach((orderItem: OrderItem) => {
      const existingProduct = productData.find(
        (product) => product.id === orderItem.product_id,
      )

      if (existingProduct) {
        existingProduct.quantity += orderItem.quantity
        existingProduct.sum += orderItem.order_price * orderItem.quantity
      } else {
        productData.push({
          id: orderItem.product_id,
          name: orderItem.product_name,
          price: orderItem.order_price,
          quantity: orderItem.quantity,
          sum: orderItem.order_price * orderItem.quantity,
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

interface GroupedOutput {
  productName: string
  price: number // unit price in cents
  quantity: number // how many at that unit price
}

/************************************************
 * 3) Grouping Function
 ************************************************/
export function groupOrdersByNamePriceQuantity(
  orders: OrdersAndItems,
): GroupedOutput[] {
  // Use a nested Map to accumulate quantities.
  // Outer key = product name;
  // Inner key = *unit* price in cents => (order_price / quantity)
  // Value = total quantity at that unit price
  const productMap = new Map<string, Map<number, number>>()

  for (const order of orders) {
    for (const item of order.OrderItems) {
      const { product_name, order_price, quantity } = item

      // Compute the *unit* price for each item in cents
      // e.g. order_price=300, quantity=2 => unit price=150 per item
      const unitPrice = Math.round(order_price / quantity)

      // Retrieve or create the inner map for this product name
      let priceMap = productMap.get(product_name)
      if (!priceMap) {
        priceMap = new Map<number, number>()
        productMap.set(product_name, priceMap)
      }

      // Accumulate the quantity at the specific unit price
      const currentQuantity = priceMap.get(unitPrice) || 0
      priceMap.set(unitPrice, currentQuantity + quantity)
    }
  }

  // Transform the nested map into an array of GroupedOutput
  const output: GroupedOutput[] = []

  for (const [productName, priceMap] of productMap.entries()) {
    for (const [price, quantity] of priceMap.entries()) {
      output.push({ productName, price, quantity })
    }
  }

  return output
}

/************************************************
 * 4) Final Formatted Output
 ************************************************/
interface FormattedProductRow {
  id: string // For use as a key in HTML rendering
  productName: string
  quantity: string // e.g. "1,00 (x1), 2,00 (x2)"
  sum: string // e.g. "3,00" (final total in euro)
  sumCents: number // e.g. 300
}

/**
 * Takes the grouped array (unit price / quantity) and merges
 * them per productName into a single row:
 *
 * Example row:
 *   {
 *     id: "prod-cappuccino",
 *     productName: "cappuccino",
 *     quantity: "1,00 (x1), 2,00 (x2)",
 *     sum: "3,00",
 *     sumCents: 300
 *   }
 */
export function formatGroupedData(
  grouped: GroupedOutput[],
): FormattedProductRow[] {
  // Step 1: group all items by productName
  const productMap = new Map<string, GroupedOutput[]>()

  for (const item of grouped) {
    const { productName } = item
    const existingList = productMap.get(productName) || []
    existingList.push(item)
    productMap.set(productName, existingList)
  }

  // Step 2: build a FormattedProductRow for each productName
  const result: FormattedProductRow[] = []

  for (const [productName, items] of productMap.entries()) {
    // Build the concatenated 'quantity' column
    // e.g. "1,00 (x1), 2,00 (x2)"
    const quantityString = items
      .map(({ price, quantity }) => {
        return `${centsToEuro(price)} (x${quantity})`
      })
      .join(', ')

    // Compute the sum in cents (sum of *unitPrice* * quantity)
    const sumInCents = items.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0,
    )

    // Convert that total to euros
    const sumInEuro = centsToEuro(sumInCents)

    // Push our new formatted row
    result.push({
      id: `prod-${productName}`, // or any unique key for your HTML
      productName,
      quantity: quantityString, // e.g. "1,00 (x1), 2,00 (x2)"
      sum: sumInEuro, // e.g. "3,00"
      sumCents: sumInCents, // e.g. 300
    })
  }

  return result
}

/************************************************
 * 5) Main Entry Point (Orchestrator)
 ************************************************/
export function produceFormattedData(
  orders: OrdersAndItems,
): FormattedProductRow[] {
  // 1) Group orders by productName + unitPrice
  const groupedOutput = groupOrdersByNamePriceQuantity(orders)

  // 2) Format the data into final rows
  const formattedRows = formatGroupedData(groupedOutput)

  return formattedRows
}
