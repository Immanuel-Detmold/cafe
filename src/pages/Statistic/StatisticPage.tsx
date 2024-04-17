import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import {
  getCurrentMonth,
  getThisYear,
} from '@/generalHelperFunctions.tsx/dateHelperFunctions'
import { Label } from '@radix-ui/react-label'

import DatePicker from './DatePicker'
import { getSumOrders } from './helperFunctions'

const StatisticPage = () => {
  const { monthDataFormat, monthName } = getCurrentMonth()
  const { yearDataFormat, year } = getThisYear()

  const { data: ordersMonth } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: monthDataFormat,
  })

  const { data: ordersYear } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: yearDataFormat,
  })

  const sumMonth = ordersMonth ? getSumOrders(ordersMonth) : 0
  const sumYear = ordersYear ? getSumOrders(ordersYear) : 0

  // const sumMonth = ordersMonth? getSumOrders(ordersMonth) || 0

  // console.log(ordersYear)
  // console.log(ordersMonth)

  return (
    <>
      {/* First row, sum this mnth and this year */}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 ">
        {/* Current month */}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-xl">Dieser Monat ({monthName})</Label>
          <Label className="text-2xl font-bold">
            {ordersMonth ? sumMonth.toString() + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Umsatz</Label>
        </div>

        {/* Current year */}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-xl">Dieses Jahr ({year})</Label>
          <Label className="text-2xl font-bold">
            {ordersYear ? sumYear.toString() + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Umsatz</Label>
        </div>

        <DatePicker />
      </div>
    </>
  )
}

export default StatisticPage
