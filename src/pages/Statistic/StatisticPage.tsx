import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import {
  getCurrentMonth,
  getEndOfDay,
  getStartOfDay,
  getThisYear,
} from '@/generalHelperFunctions.tsx/dateHelperFunctions'
import { Label } from '@radix-ui/react-label'
import { useMemo, useState } from 'react'

import DatePicker from './DatePicker'
import {
  getDistinctDates,
  getSumOrders,
  getSumOrdersPayMethod,
} from './helperFunctions'

const StatisticPage = () => {
  const { monthDataFormat, monthName } = getCurrentMonth()
  const { yearDataFormat, year } = getThisYear()

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA').toString(),
  )

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

  const { data: orders } = useOrdersAndItemsQueryV2({})

  const { data: filteredData } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    startDate: selectedDate ? getStartOfDay(selectedDate) : '2000.01.01',
    endDate: selectedDate ? getEndOfDay(selectedDate) : '3000.01.01',
  })

  if (filteredData) {
    console.log(filteredData)
  }

  const distinctOrders = useMemo(() => {
    if (!orders) return []
    return getDistinctDates(orders)
  }, [orders])

  const sumMonth = useMemo(() => {
    if (!ordersMonth) return 0
    return getSumOrders(ordersMonth)
  }, [ordersMonth])

  const sumYear = useMemo(() => {
    if (!ordersYear) return 0
    return getSumOrders(ordersYear)
  }, [ordersYear])

  return (
    <>
      <div>
        {/* First row, sum this month and this year */}
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 ">
          {/* Current month */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Dieser Monat ({monthName})</Label>
            <Label className="text-2xl font-bold">
              {ordersMonth ? sumMonth.toString() + '€' : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Current year */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Dieses Jahr ({year})</Label>
            <Label className="text-2xl font-bold">
              {ordersYear ? sumYear.toString() + '€' : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Select Date to filter */}
          <div className="col-span-2 w-full">
            {orders && distinctOrders && (
              <DatePicker
                distinctOrders={distinctOrders}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
          </div>
        </div>

        {/* Lower Block (Under Selected Date) */}
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 ">
          {/* Count of Orders */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Bestellungen</Label>
            <Label className="text-2xl font-bold">
              {filteredData ? filteredData.length : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Sum Price */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Gesamt</Label>
            <Label className="text-2xl font-bold">
              {filteredData ? getSumOrdersPayMethod(filteredData) + '€' : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Sum Cash */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Bar</Label>
            <Label className="text-2xl font-bold">
              {filteredData
                ? getSumOrdersPayMethod(filteredData, 'cash') + '€'
                : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Sum Paypal */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Cafe Card</Label>
            <Label className="text-2xl font-bold">
              {filteredData
                ? getSumOrdersPayMethod(filteredData, 'cafe_card') + '€'
                : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>

          {/* Sum Paypal */}
          <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
            <Label className="text-base">Paypal</Label>
            <Label className="text-2xl font-bold">
              {filteredData
                ? getSumOrdersPayMethod(filteredData, 'paypal') + '€'
                : '...'}
            </Label>
            <Label className="text-muted-foreground">Umsatz</Label>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatisticPage
