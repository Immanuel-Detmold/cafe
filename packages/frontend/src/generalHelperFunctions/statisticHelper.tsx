import { MONTHS, language } from '@/data/data'

export const groupPriceByMonth = (
  data: {
    priceA: number
    priceB: number
    date: Date // Unified date field of type Date
  }[],
) => {
  // Initialize groupedData by setting all months to 0
  const groupedData: { [key: string]: { priceA: number; priceB: number } } =
    MONTHS.reduce(
      (acc: { [key: string]: { priceA: number; priceB: number } }, month) => {
        acc[month] = { priceA: 0, priceB: 0 }
        return acc
      },
      {},
    )

  data.forEach((d) => {
    const month = d.date.toLocaleString(language, {
      month: 'long',
    })

    if (groupedData[month]) {
      groupedData[month].priceA += d.priceA
      groupedData[month].priceB += d.priceB
    } else {
      groupedData[month] = { priceA: d.priceA, priceB: d.priceB }
    }
  })

  return Object.keys(groupedData).map((month) => ({
    month,
    priceA: groupedData[month]?.priceA ? groupedData[month]?.priceA / 100 : 0,
    priceB: groupedData[month]?.priceB ? groupedData[month]?.priceB / 100 : 0,
  }))
}

// Adjust the data before passing it to the function
export const combineData = (
  dataA: { price: number; created_at: string }[],
  dataB: { price: number; purchase_date: string }[],
) => {
  return dataA
    .map((d) => ({
      priceA: d.price,
      priceB: 0,
      date: new Date(d.created_at), // Rename created_at to date and convert to Date object
    }))
    .concat(
      dataB.map((d) => ({
        priceA: 0,
        priceB: d.price,
        date: new Date(d.purchase_date), // Rename purchase_date to date and convert to Date object
      })),
    )
}

// Output will look like this:
// [
//   { month: 'June', desktop: 100, mobile: 300 },
//   { month: 'July', desktop: 50, mobile: 0 },
//   { month: 'August', desktop: 0, mobile: 25 },
// ]

// Bucket revenue + expenses by day or month depending on the range length.
// Revenue excludes free_drink/youth payments (matches getSumPriceData).
export type BucketDatum = {
  bucket: string
  revenue: number // in euro
  expenses: number // in euro
}

const DAY_MS = 24 * 60 * 60 * 1000

export const groupRevenueExpenseByBucket = (
  orders: { price: number; payment_method?: string; created_at: string }[],
  expenses: { price: number; purchase_date: string }[],
  range: { from: Date; to: Date },
): BucketDatum[] => {
  const spanDays = Math.round(
    (range.to.getTime() - range.from.getTime()) / DAY_MS,
  )
  const useMonthBuckets = spanDays > 62

  const buckets = new Map<string, { revenue: number; expenses: number }>()
  const order: string[] = []

  const keyFor = (date: Date): string => {
    if (useMonthBuckets) {
      const month = date.toLocaleString(language, { month: 'short' })
      return `${month} ${date.getFullYear()}`
    }
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  // Pre-seed buckets so empty days/months still appear in order
  const cursor = new Date(range.from)
  if (useMonthBuckets) {
    cursor.setDate(1)
    while (cursor <= range.to) {
      const key = keyFor(cursor)
      if (!buckets.has(key)) {
        buckets.set(key, { revenue: 0, expenses: 0 })
        order.push(key)
      }
      cursor.setMonth(cursor.getMonth() + 1)
    }
  } else {
    cursor.setHours(0, 0, 0, 0)
    while (cursor <= range.to) {
      const key = keyFor(cursor)
      if (!buckets.has(key)) {
        buckets.set(key, { revenue: 0, expenses: 0 })
        order.push(key)
      }
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  orders.forEach((o) => {
    if (o.payment_method === 'free_drink' || o.payment_method === 'youth')
      return
    const key = keyFor(new Date(o.created_at))
    const entry = buckets.get(key)
    if (entry) entry.revenue += o.price
  })

  expenses.forEach((e) => {
    const key = keyFor(new Date(e.purchase_date))
    const entry = buckets.get(key)
    if (entry) entry.expenses += e.price
  })

  return order.map((key) => {
    const entry = buckets.get(key) ?? { revenue: 0, expenses: 0 }
    return {
      bucket: key,
      revenue: entry.revenue / 100,
      expenses: entry.expenses / 100,
    }
  })
}

// Sum revenue per payment method (in euro) for a pie/distribution chart.
export type PaymentDatum = {
  method: string
  label: string
  value: number // in euro
}

export const getPaymentMethodDistribution = (
  orders: { price: number; payment_method?: string | null }[],
  methods: { name: string; label: string }[],
): PaymentDatum[] => {
  return methods
    .map(({ name, label }) => {
      const cents = orders.reduce(
        (total, o) => (o.payment_method === name ? total + o.price : total),
        0,
      )
      return { method: name, label, value: cents / 100 }
    })
    .filter((d) => d.value > 0)
}
