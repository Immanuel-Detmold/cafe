/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { convertUTCToYear } from '@/pages/Statistic/helperFunctions'
import { convertUTCToYear } from '@/pages/Statistic/helperFunctions'
import { describe, expect, it } from 'vitest'

import { expenseData } from './exampleExpenseData.ts'
import { orderData } from './exampleOrderData.ts'

// const OrderData = orderData.slice(0, 10)
// const Expense = expenseData

// console.log(OrderData)
// console.log(Expense)

describe('convertUTCToYear', () => {
  it('converts 2024-07-23 06:36:46.412224+00 to 2024', () => {
    expect(convertUTCToYear('2024-07-23 06:36:46.412224+00')).toBe('2024')
  })
  it('converts 2026-07-23 06:36:46 to 2026', () => {
    expect(convertUTCToYear('2026-07-23 06:36:46')).toBe('2026')
  })
})
