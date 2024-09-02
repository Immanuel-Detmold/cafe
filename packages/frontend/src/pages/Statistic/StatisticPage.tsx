import { MONTHS } from '@/data/data'
import { useCafeCards } from '@/data/useCafeCard'
import { useExpensesQuery } from '@/data/useExpense'
import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import { useUser } from '@/data/useUser'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  convertToSupabaseDate,
  formatDate,
  getCurrentMonthStartDate,
  getEndOfDay,
  getEndOfMonth,
  getEndOfYear,
  getStartOfDay,
  getStartOfMonth,
  getStartOfYear,
  getThisYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { Label } from '@radix-ui/react-label'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FileTextIcon, Loader2Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import Open from '../Open/Open'
import DatePicker from './DatePicker'
import OrdersPDF from './GeneratePDF/OrdersPDF'
import OrderTable from './OrderTable'
import {
  getDistinctDates,
  getSumCafeCards,
  getSumCafeCardsGrouped,
  getSumCafeCardsOrders,
  getSumOrdersPayMethod,
  getSumPriceData,
} from './helperFunctions'

const StatisticPage = () => {
  // States
  const [userRole, setUserRole] = useState('user')
  const [showAllOrders, setShorAllOrders] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // Mini Functions
  const { monthDataFormat } = getCurrentMonthStartDate()
  const { yearDataFormat, year } = getThisYear()
  const { user } = useUser()
  const thisMonth = MONTHS[new Date().getMonth()]

  // Data
  const { data: ordersMonth, isLoading: l1 } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: monthDataFormat,
  })

  const { data: ordersYear, isLoading: l2 } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: yearDataFormat,
  })

  const { data: expensesYear, isLoading: l6 } = useExpensesQuery({
    startDate: convertToSupabaseDate(getStartOfYear(new Date(year))),
    endDate: convertToSupabaseDate(getEndOfYear(new Date(year))),
  })

  const { data: expensesThisMonth, isLoading: l7 } = useExpensesQuery({
    startDate: convertToSupabaseDate(getStartOfMonth(new Date(year))),
    endDate: convertToSupabaseDate(getEndOfMonth(new Date(year))),
  })

  // Gets all Cafe Cards from this year
  const { data: cafeCardsAllTime, isLoading: l3 } = useCafeCards({})

  // Returns all Orders
  const { data: orders, isLoading: l4 } = useOrdersAndItemsQueryV2({})

  const { data: filteredData, isLoading: l5 } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    startDate: getStartOfDay(selectedDate || '2000-01-01T00:00:00')
      .finalDateString,
    endDate: getEndOfDay(selectedDate || '2024-05-01T00:00:00').endOfDayString,
  })

  // Get distinct dates
  const distinctOrders = useMemo(() => {
    if (!orders) return []
    return getDistinctDates(orders)
  }, [orders])

  // Sum This Month
  const sumMonth = useMemo(() => {
    if (!ordersMonth) return '...'
    return getSumPriceData(ordersMonth)
  }, [ordersMonth])

  // Sum This Year
  const sumYear = useMemo(() => {
    if (!ordersYear) return '...'
    return getSumPriceData(ordersYear)
  }, [ordersYear])

  // Sum expense this year
  const sumYearExpenses = useMemo(() => {
    if (!expensesYear) return '...'
    return getSumPriceData(expensesYear)
  }, [expensesYear])

  // Sum expense this month
  const sumThisMonthExpense = useMemo(() => {
    if (!expensesThisMonth) return '...'
    return getSumPriceData(expensesThisMonth)
  }, [expensesThisMonth])

  // Sum Cafe Cards
  const sumCafeCards = useMemo(() => {
    if (!cafeCardsAllTime) return 0
    return getSumCafeCards(cafeCardsAllTime)
  }, [cafeCardsAllTime])

  // Sum Cafe Cards seperated by ammount. 5€ and 10€
  const { tenCardCount, fiveCardCount } = useMemo(() => {
    if (!cafeCardsAllTime) return { tenCardCount: '...', fiveCardCount: '...' }
    return getSumCafeCardsGrouped(cafeCardsAllTime)
  }, [cafeCardsAllTime])

  // Sum Payed with Cafe Card this Year
  const sumYearCafeCardsPayments = useMemo(() => {
    if (!orders) return 0
    return getSumCafeCardsOrders(orders)
  }, [orders])

  // Sum Count Orders
  const sumCountOrders = useMemo(() => {
    if (!filteredData) return '...'
    return filteredData.length
  }, [filteredData])

  // Sum Total Turnover
  const sumTotalTurnover = useMemo(() => {
    if (!filteredData) return '...'
    return getSumOrdersPayMethod(filteredData) + '€'
  }, [filteredData])

  // Sum Total Cash
  const sumTotalCash = useMemo(() => {
    if (!filteredData) return '...'
    return getSumOrdersPayMethod(filteredData, 'cash') + '€'
  }, [filteredData])

  // Sum Total PayPal
  const sumTotalPayPal = useMemo(() => {
    if (!filteredData) return '...'
    return getSumOrdersPayMethod(filteredData, 'paypal') + '€'
  }, [filteredData])

  // Sum Total Cafe Card
  const sumTotalCafeCard = useMemo(() => {
    if (!filteredData) return '...'
    return getSumOrdersPayMethod(filteredData, 'cafe_card') + '€'
  }, [filteredData])

  // Sum total vouchers
  const sumTotalVouchers = useMemo(() => {
    if (!filteredData) return '...'
    return getSumOrdersPayMethod(filteredData, 'voucher') + '€'
  }, [filteredData])

  // UseEffect
  useEffect(() => {
    if (distinctOrders.length > 0 && distinctOrders !== undefined) {
      setSelectedDate(distinctOrders[0] || '')
    }
  }, [distinctOrders])

  useEffect(() => {
    const role = user?.user_metadata?.role as string
    if (role) {
      setUserRole(role)
    }
  }, [user])

  return (
    <>
      {l1 && l2 && l3 && l4 && l5 && l6 && l7 && (
        <Label className="mt-2 flex font-bold">
          <Loader2Icon className="animate-spin" />{' '}
          <span className="ml-1">Daten werden geladen...</span>
        </Label>
      )}
      <div className="flex flex-col items-center">
        {userRole === 'admin' && (
          <>
            {/* First row, sum this month and this year */}
            <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {/* Current month */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Dieser Monat ({thisMonth})</Label>
                <Label className="text-2xl font-bold">
                  {ordersMonth ? sumMonth.toString() + '€' : '...'}
                </Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Turnover current year */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Dieses Jahr ({year})</Label>
                <Label className="text-2xl font-bold">
                  {ordersYear ? sumYear.toString() + '€' : '...'}
                </Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Expense current year */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Dieses Jahr ({year})</Label>
                <Label className="text-2xl font-bold">
                  {expensesYear ? sumYearExpenses.toString() + '€' : '...'}
                </Label>
                <Label className="text-muted-foreground">Ausgaben</Label>
              </div>

              {/* Expense current month */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Dieser Monat ({thisMonth})</Label>
                <Label className="text-2xl font-bold">
                  {expensesThisMonth
                    ? sumThisMonthExpense.toString() + '€'
                    : '...'}
                </Label>
                <Label className="text-muted-foreground">Ausgaben</Label>
              </div>

              {/* Money not used and still on cards */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Übriges Guthaben auf Karten</Label>
                <Label className="text-2xl font-bold">
                  {cafeCardsAllTime
                    ? centsToEuro(
                        sumCafeCards - sumYearCafeCardsPayments,
                      ).toString() + '€'
                    : '...'}
                </Label>
                <Label className="text-muted-foreground">Summe</Label>
              </div>

              {/* Summe Cafe Cards */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Summe Café Karten</Label>
                <Label className="text-2xl font-bold">
                  {cafeCardsAllTime
                    ? centsToEuro(sumCafeCards).toString() + '€'
                    : '...'}
                </Label>
                <Label className="text-muted-foreground">
                  {cafeCardsAllTime ? (
                    <Label className="text-muted-foreground">
                      Summe (10€ x {tenCardCount} | 5€ x {fiveCardCount})
                    </Label>
                  ) : null}
                </Label>
              </div>
            </div>

            {/* Select Date to filter */}
            <div className="col-span-2 mt-2 w-full">
              {
                <DatePicker
                  distinctDates={distinctOrders.reverse()}
                  selectedDate={selectedDate || ''}
                  setSelectedDate={setSelectedDate}
                />
              }
            </div>
          </>
        )}

        {selectedDate && filteredData && (
          <div className="w-full">
            {/* Lower Block (Under Selected Date) */}
            <div className="mt-2 grid w-full grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {/* Count of Orders */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Bestellungen</Label>
                <Label className="text-2xl font-bold">{sumCountOrders}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Sum Price */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Gesamt</Label>
                <Label className="text-2xl font-bold">{sumTotalTurnover}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Sum Cash */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Bar</Label>
                <Label className="text-2xl font-bold">{sumTotalCash}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Sum Cafe Card */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Café Karte</Label>
                <Label className="text-2xl font-bold">{sumTotalCafeCard}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Sum Paypal */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Paypal</Label>
                <Label className="text-2xl font-bold">{sumTotalPayPal}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>

              {/* Sum vouchers */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Gutscheine</Label>
                <Label className="text-2xl font-bold">{sumTotalVouchers}</Label>
                <Label className="text-muted-foreground">Umsatz</Label>
              </div>
            </div>
          </div>
        )}

        {filteredData && selectedDate && (
          <PDFDownloadLink
            document={
              <OrdersPDF
                filteredData={filteredData}
                selectedDate={formatDate(selectedDate)}
                sumTotalTurnover={sumTotalTurnover}
                sumTotalCash={sumTotalCash}
                sumTotalPayPal={sumTotalPayPal}
                sumTotalCafeCard={sumTotalCafeCard}
                sumTotalVouchers={sumTotalVouchers}
              />
            }
            fileName="orders.pdf"
            className="w-30 ml-auto mt-2"
          >
            {({ loading }) =>
              loading ? (
                <Button className="ml-auto">
                  Loading PDF <FileTextIcon className="ml-2" />
                </Button>
              ) : (
                <Button className="ml-auto">
                  Download PDF <FileTextIcon className="ml-2" />
                </Button>
              )
            }
          </PDFDownloadLink>
        )}

        {/* Table */}
        {filteredData && selectedDate && (
          <OrderTable filteredData={filteredData} />
        )}

        {filteredData && selectedDate && userRole === 'admin' && (
          <div className="my-4 mr-auto flex items-center space-x-2">
            <Switch
              id="load-orders"
              checked={showAllOrders}
              onCheckedChange={() => {
                setShorAllOrders(!showAllOrders)
              }}
            />
            <Label htmlFor="load-orders">
              Alle Bestellungen vom {formatDate(selectedDate)} Laden
            </Label>
          </div>
        )}
      </div>
      {showAllOrders && selectedDate && userRole === 'admin' && (
        <Open
          startDate={getStartOfDay(selectedDate).finalDateString}
          endDate={getEndOfDay(selectedDate).endOfDayString}
          currentUrlPage={'statistic'}
        ></Open>
      )}
    </>
  )
}

export default StatisticPage
