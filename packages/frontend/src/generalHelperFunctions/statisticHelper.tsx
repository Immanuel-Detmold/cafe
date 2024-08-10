import { MONTHS, language } from '@/data/data'

export const groupPriceByMonth = (
  data: { priceA: number; priceB: number; created_at: string }[],
) => {
  const groupedData: { [key: string]: { priceA: number; priceB: number } } =
    MONTHS.reduce(
      (acc: { [key: string]: { priceA: number; priceB: number } }, month) => {
        acc[month] = { priceA: 0, priceB: 0 }
        return acc
      },
      {},
    )

  data.forEach((d) => {
    const month = new Date(d.created_at).toLocaleString(language, {
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
  dataB: { price: number; created_at: string }[],
) => {
  return dataA
    .map((d) => ({ priceA: d.price, priceB: 0, created_at: d.created_at }))
    .concat(
      dataB.map((d) => ({
        priceA: 0,
        priceB: d.price,
        created_at: d.created_at,
      })),
    )
}

// Output will look like this:
// [
//   { month: 'June', desktop: 100, mobile: 300 },
//   { month: 'July', desktop: 50, mobile: 0 },
//   { month: 'August', desktop: 0, mobile: 25 },
// ]
