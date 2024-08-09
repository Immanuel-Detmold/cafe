// import { convertUTCToYear } from '@/pages/Statistic/helperFunctions'
import {
  convertUTCToYear,
  getDistinctMonths,
  getDistinctYears,
} from '@/pages/Statistic/helperFunctions'
import { describe, expect, it } from 'vitest'

import { expenseData } from './exampleExpenseData.ts'

// import { exampleOrderData } from './exampleOrderData.ts'

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

describe('getDistinctYears', () => {
  it('returns [2024, 2025, 2026]', () => {
    expect(getDistinctYears(expenseData)).toEqual(['2024', '2025', '2026'])
  })
})

describe('getDistinctMonth', () => {
  it('returns [1,2,3]', () => {
    expect(getDistinctMonths(expenseData)).toEqual(['7', '6', '5'])
  })
})
