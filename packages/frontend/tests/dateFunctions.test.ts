// import { convertUTCToYear } from '@/pages/Statistic/helperFunctions'
import {
  combineData,
  groupPriceByMonth,
} from '@/generalHelperFunctions/statisticHelper.tsx'
import { convertUTCToYear } from '@/pages/Statistic/helperFunctions'
import { describe, expect, it } from 'vitest'

// import { exampleOrderData } from './exampleOrderData.ts'

// const OrderData = orderData.slice(0, 10)
// const Expense = expenseData

describe('convertUTCToYear', () => {
  it('converts 2024-07-23 06:36:46.412224+00 to 2024', () => {
    expect(convertUTCToYear('2024-07-23 06:36:46.412224+00')).toBe('2024')
  })
  it('converts 2026-07-23 06:36:46 to 2026', () => {
    expect(convertUTCToYear('2026-07-23 06:36:46')).toBe('2026')
  })
})

describe('getGroupedMonthsPrice', () => {
  it('returns {"August": 430, "Juli": 11, "Juni": 2222 }', () => {
    const dataA = [
      { price: 100, created_at: '2023-06-15' },
      { price: 50, created_at: '2023-07-20' },
    ]
    const dataB = [
      { price: 300, purchase_date: '2023-06-25' },
      { price: 25, purchase_date: '2023-08-10' },
    ]
    const result = [
      { month: 'Januar', desktop: 0, mobile: 0 },
      { month: 'Februar', desktop: 0, mobile: 0 },
      { month: 'März', desktop: 0, mobile: 0 },
      { month: 'April', desktop: 0, mobile: 0 },
      { month: 'Mai', desktop: 0, mobile: 0 },
      { month: 'Juni', desktop: 100, mobile: 300 },
      { month: 'Juli', desktop: 50, mobile: 0 },
      { month: 'August', desktop: 0, mobile: 25 },
      { month: 'September', desktop: 0, mobile: 0 },
      { month: 'Oktober', desktop: 0, mobile: 0 },
      { month: 'November', desktop: 0, mobile: 0 },
      { month: 'Dezember', desktop: 0, mobile: 0 },
    ]

    expect(groupPriceByMonth(combineData(dataA, dataB))).toEqual(result)
  })
})
