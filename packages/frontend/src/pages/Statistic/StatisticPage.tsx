import { useCafeCards } from '@/data/useCafeCard'
import { useExpensesQuery } from '@/data/useExpense'
import {
  useLastOrderDateQuery,
  useOrdersAndItemsQueryV2,
} from '@/data/useOrders'
import { useRevenueStreamsQuery } from '@/data/useRevenueStreams.tsx'
import { useSumUpPayoutsQuery } from '@/data/useSumUpPayouts'
import { useUser } from '@/data/useUser'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  convertToSupabaseDate,
  getEndOfDayFromDate,
  getEndOfYear,
  getStartOfDayFromDate,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { Label } from '@radix-ui/react-label'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CreditCard, FileTextIcon, Layers3, Loader2Icon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import Open from '../Open/Open'
import DateRangeControls, {
  DateRange,
  Granularity,
  buildRange,
} from './DateRangeControls'
import OrdersPDF from './GeneratePDF/OrdersPDF'
import OrderTable from './OrderTable'
import StatisticCharts from './StatisticCharts'
import {
  getSumCafeCards,
  getSumCafeCardsGrouped,
  getSumCafeCardsOrders,
  getSumOrdersPayMethod,
  getSumPriceCents,
  getSumPriceData,
} from './helperFunctions'

const StatisticPage = () => {
  // States
  const [userRole, setUserRole] = useState('user')
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [userName, setUserName] = useState('')
  const { user } = useUser()
  const isAdmin = userRole === 'admin'

  const { data: revenueStreams } = useRevenueStreamsQuery()
  const [selectedRevenueStream, setSelectedRevenueStream] = useState<
    number | string | undefined
  >('all')

  // Time range (defaults to today, updated to last revenue day once data loads)
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [range, setRange] = useState<DateRange>(() =>
    buildRange('day', new Date()),
  )
  const rangeInitialized = useRef(false)

  // Fetch most recent order date to pre-select it as the default day
  const { data: lastOrderDate } = useLastOrderDateQuery()

  const revenueStreamId =
    selectedRevenueStream === 'all'
      ? undefined
      : (selectedRevenueStream as number)

  const getRevenueStreamIcon = () => {
    if (selectedRevenueStream === 'all') {
      return <Layers3 className="h-4 w-4" />
    }
    return revenueStreams?.find((s) => s.id === selectedRevenueStream)?.icon
  }

  // Year boundaries derived from the selected range (top KPIs follow context)
  const rangeYear = range.from.getFullYear()
  const yearStart = useMemo(
    () => convertToSupabaseDate(getStartOfYear(new Date(rangeYear, 0, 1))),
    [rangeYear],
  )
  const yearEnd = useMemo(
    () => convertToSupabaseDate(getEndOfYear(new Date(rangeYear, 0, 1))),
    [rangeYear],
  )

  // Range boundaries in Supabase format
  const rangeStart = convertToSupabaseDate(range.from)
  const rangeEnd = convertToSupabaseDate(range.to)

  // Data: selected range
  const { data: ordersRange, isLoading: lRange } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    startDate: rangeStart,
    endDate: rangeEnd,
    revenue_stream_id: revenueStreamId,
  })

  const { data: expensesRange, isLoading: lExpRange } = useExpensesQuery({
    startDate: rangeStart,
    endDate: rangeEnd,
  })

  const { data: sumupPayouts, isLoading: lSumup } = useSumUpPayoutsQuery({
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    enabled: isAdmin,
  })

  // Data: selected year (top KPIs)
  const { data: ordersYear, isLoading: lYear } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    startDate: yearStart,
    endDate: yearEnd,
    revenue_stream_id: revenueStreamId,
  })

  const { data: expensesYear, isLoading: lExpYear } = useExpensesQuery({
    startDate: yearStart,
    endDate: yearEnd,
  })

  // Cafe cards (all time)
  const { data: cafeCardsAllTime } = useCafeCards({})
  // Cafe cards (selected year)
  const { data: cafeCardsYear } = useCafeCards({
    startDate: yearStart,
    endDate: yearEnd,
  })

  // ---- Top KPIs (year) ----
  const yearRevenueCents = useMemo(
    () => (ordersYear ? getSumPriceCents(ordersYear) : 0),
    [ordersYear],
  )
  const yearExpenseCents = useMemo(
    () => (expensesYear ? getSumPriceCents(expensesYear) : 0),
    [expensesYear],
  )
  const yearProfitCents = yearRevenueCents - yearExpenseCents

  // ---- Cafe cards ----
  const sumCafeCards = useMemo(
    () => (cafeCardsAllTime ? getSumCafeCards(cafeCardsAllTime) : 0),
    [cafeCardsAllTime],
  )
  const sumCafeCardsYear = useMemo(
    () => (cafeCardsYear ? getSumCafeCards(cafeCardsYear) : 0),
    [cafeCardsYear],
  )
  const { tenCardCount: tenCardCountYear, fiveCardCount: fiveCardCountYear } =
    useMemo(() => {
      if (!cafeCardsYear) return { tenCardCount: '...', fiveCardCount: '...' }
      return getSumCafeCardsGrouped(cafeCardsYear)
    }, [cafeCardsYear])
  const sumYearCafeCardsPayments = useMemo(
    () => (ordersYear ? getSumCafeCardsOrders(ordersYear) : 0),
    [ordersYear],
  )

  // ---- Range KPIs ----
  const rangeRevenueCents = useMemo(
    () => (ordersRange ? getSumPriceCents(ordersRange) : 0),
    [ordersRange],
  )
  const rangeExpenseCents = useMemo(
    () => (expensesRange ? getSumPriceCents(expensesRange) : 0),
    [expensesRange],
  )
  const rangeProfitCents = rangeRevenueCents - rangeExpenseCents

  const sumCountOrders = ordersRange ? ordersRange.length : '...'
  const sumTotalTurnover = ordersRange
    ? getSumPriceData(ordersRange) + '€'
    : '...'
  const sumTotalCash = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'cash') + '€'
    : '...'
  const sumTotalPayPal = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'paypal') + '€'
    : '...'
  const sumTotalTerminal = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'terminal') + '€'
    : '...'
  const sumTotalCafeCard = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'cafe_card') + '€'
    : '...'
  const sumTotalFreeDrinks = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'free_drink') + '€'
    : '...'
  const sumTotalOnline = ordersRange
    ? getSumOrdersPayMethod(ordersRange, 'online') + '€'
    : '...'
  const sumRangeExpenses = centsToEuro(rangeExpenseCents) + '€'
  const sumRangeProfit = centsToEuro(rangeProfitCents) + '€'

  // Label for the selected range
  const rangeLabel = useMemo(() => {
    const fromStr = range.from.toLocaleDateString('de-DE')
    const toStr = range.to.toLocaleDateString('de-DE')
    if (granularity === 'day') return `vom ${fromStr}`
    return `${fromStr} – ${toStr}`
  }, [range, granularity])

  const pdfFileName = useMemo(() => {
    const fromIso = range.from.toISOString().split('T')[0]
    const toIso = range.to.toISOString().split('T')[0]
    return `umsatz_${fromIso}_${toIso}.pdf`
  }, [range])

  const isLoading = lRange || lExpRange || lYear || lExpYear || lSumup

  // Handle range changes (ignored for non-admin users)
  const handleRangeChange = (
    newRange: DateRange,
    newGranularity: Granularity,
  ) => {
    if (!isAdmin) return
    setRange(newRange)
    setGranularity(newGranularity)
  }

  // UseEffect
  useEffect(() => {
    const role = user?.user_metadata?.role as string
    const name = user?.user_metadata?.name as string
    if (name) {
      setUserName(name)
    }
    if (role) {
      setUserRole(role)
    }
  }, [user])

  // Non-admin users are always pinned to today
  useEffect(() => {
    if (userRole !== 'admin') {
      setRange(buildRange('day', new Date()))
      setGranularity('day')
    }
  }, [userRole])

  // Once both user and last order date are known, set the initial range (once)
  useEffect(() => {
    if (rangeInitialized.current) return
    if (lastOrderDate === undefined) return // still loading
    if (!user) return // user not yet loaded
    rangeInitialized.current = true
    if (lastOrderDate) {
      setRange(buildRange('day', new Date(lastOrderDate)))
      setGranularity('day')
    }
  }, [lastOrderDate, user])

  return (
    <>
      <Label
        className="mt-2 flex h-6 items-center font-bold transition-opacity duration-200"
        style={{ opacity: isLoading ? 1 : 0, pointerEvents: 'none' }}
        aria-live="polite"
      >
        <Loader2Icon className="h-4 w-4 animate-spin" />
        <span className="ml-1">Daten werden geladen...</span>
      </Label>
      <div className="flex flex-col items-center">
        {
          <>
            {/* Revenuestream Group*/}
            <div className=" mr-auto mt-4 flex items-center space-x-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="revenue-stream-select" className="font-black">
                  Umsatzgruppe
                </Label>
                <Select
                  value={selectedRevenueStream?.toString() || 'all'}
                  onValueChange={(value) =>
                    setSelectedRevenueStream(
                      value === 'all' ? 'all' : parseInt(value),
                    )
                  }
                >
                  <SelectTrigger
                    id="revenue-stream-select"
                    className="mr-auto w-[200px]"
                  >
                    <SelectValue placeholder="Select Revenue Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Layers3 className="h-4 w-4" />
                        Alle Gruppen
                      </div>
                    </SelectItem>
                    {revenueStreams?.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id.toString()}>
                        {stream.icon} {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Top KPIs: selected year */}
            <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {/* Turnover year */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Jahr {rangeYear}</Label>
                <Label className="text-2xl font-bold">
                  {ordersYear ? centsToEuro(yearRevenueCents) + '€' : '...'}
                </Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Expense year */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Jahr {rangeYear}</Label>
                <Label className="text-2xl font-bold">
                  {expensesYear ? centsToEuro(yearExpenseCents) + '€' : '...'}
                </Label>
                <Label className="text-muted-foreground">Ausgaben</Label>
              </div>

              {/* Profit year */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Jahr {rangeYear}</Label>
                <Label className="text-2xl font-bold">
                  {ordersYear && expensesYear
                    ? centsToEuro(yearProfitCents) + '€'
                    : '...'}
                </Label>
                <Label className="text-muted-foreground">Gewinn</Label>
              </div>

              {/* Money still on cards */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Übriges Guthaben auf Karten</Label>
                <Label className="text-2xl font-bold">
                  {cafeCardsAllTime
                    ? centsToEuro(
                        sumCafeCards - sumYearCafeCardsPayments,
                      ).toString() + '€'
                    : '...'}
                </Label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label className="text-muted-foreground">Summe</Label>
                </div>
              </div>

              {/* Summe Cafe Cards */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">
                  Summe Café Karten {rangeYear}
                </Label>
                <Label className="text-2xl font-bold">
                  {cafeCardsYear
                    ? centsToEuro(sumCafeCardsYear).toString() + '€'
                    : '...'}
                </Label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label className="text-muted-foreground">
                    {cafeCardsYear ? (
                      <Label className="text-muted-foreground">
                        Summe (10€ x {tenCardCountYear} | 5€ x{' '}
                        {fiveCardCountYear})
                      </Label>
                    ) : (
                      'Summe'
                    )}
                  </Label>
                </div>
              </div>
            </div>

            {/* Time range selection */}
            {isAdmin ? (
              <div className="mt-4 flex w-full flex-col gap-2">
                <DateRangeControls
                  granularity={granularity}
                  range={range}
                  onChange={handleRangeChange}
                />
              </div>
            ) : (
              <div className="text-muted-foreground mt-4 text-sm">
                {range.from.toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                {range.from.toDateString() !== range.to.toDateString() && (
                  <>
                    {' '}
                    –{' '}
                    {range.to.toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </>
                )}
              </div>
            )}
          </>
        }

        {ordersRange && (
          <div className="w-full">
            {/* Range KPIs */}
            <div className="mt-2 grid w-full grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {/* Count of Orders */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Bestellungen</Label>
                <Label className="text-2xl font-bold">{sumCountOrders}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Anzahl</Label>
                </div>
              </div>

              {/* Sum Price */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Gesamt</Label>
                <Label className="text-2xl font-bold">{sumTotalTurnover}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum Cash */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Bar</Label>
                <Label className="text-2xl font-bold">{sumTotalCash}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum Cafe Card */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Café Karte</Label>
                <Label className="text-2xl font-bold">{sumTotalCafeCard}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum Paypal */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Paypal</Label>
                <Label className="text-2xl font-bold">{sumTotalPayPal}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum Terminal */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Terminal</Label>
                <Label className="text-2xl font-bold">{sumTotalTerminal}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum online */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Online</Label>
                <Label className="text-2xl font-bold">{sumTotalOnline}</Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Sum free drinks */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Freigetränke</Label>
                <Label className="text-2xl font-bold">
                  {sumTotalFreeDrinks}
                </Label>
                <div className="flex items-center gap-2">
                  {getRevenueStreamIcon()}
                  <Label className="text-muted-foreground">Umsatz</Label>
                </div>
              </div>

              {/* Expenses range */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Ausgaben</Label>
                <Label className="text-2xl font-bold">
                  {expensesRange ? sumRangeExpenses : '...'}
                </Label>
                <Label className="text-muted-foreground">Zeitraum</Label>
              </div>

              {/* Profit range */}
              <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                <Label className="text-base">Gewinn</Label>
                <Label className="text-2xl font-bold">
                  {ordersRange && expensesRange ? sumRangeProfit : '...'}
                </Label>
                <Label className="text-muted-foreground">
                  Umsatz - Ausgaben
                </Label>
              </div>

              {isAdmin && (
                <>
                  {/* SumUp fees */}
                  <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                    <Label className="text-base">SumUp Gebühren</Label>
                    <Label className="text-2xl font-bold">
                      {sumupPayouts
                        ? sumupPayouts.fee_complete
                          ? centsToEuro(sumupPayouts.fee_cents) + '€'
                          : '—'
                        : '...'}
                    </Label>
                    <Label className="text-muted-foreground">
                      Terminal & Online
                    </Label>
                  </div>

                  {/* SumUp net */}
                  <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
                    <Label className="text-base">Nettoumsatz</Label>
                    <Label className="text-2xl font-bold">
                      {sumupPayouts
                        ? sumupPayouts.fee_complete
                          ? centsToEuro(sumupPayouts.net_cents) + '€'
                          : '—'
                        : '...'}
                    </Label>
                    <Label className="text-muted-foreground">
                      SumUp Umsatz - Gebühren
                    </Label>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Charts (collapsed by default) */}
        {ordersRange && expensesRange && (
          <StatisticCharts
            orders={ordersRange}
            expenses={expensesRange}
            range={range}
          />
        )}

        {ordersRange && (
          <PDFDownloadLink
            document={
              <OrdersPDF
                filteredData={ordersRange}
                dateRangeLabel={rangeLabel}
                sumTotalTurnover={sumTotalTurnover}
                sumTotalCash={sumTotalCash}
                sumTotalPayPal={sumTotalPayPal}
                sumTotalTerminal={sumTotalTerminal}
                sumTotalCafeCard={sumTotalCafeCard}
                sumTotalFreeDrinks={sumTotalFreeDrinks}
                sumTotalOnline={sumTotalOnline}
                sumExpenses={sumRangeExpenses}
                profit={sumRangeProfit}
              />
            }
            fileName={pdfFileName}
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
        {ordersRange && <OrderTable filteredData={ordersRange} />}

        {ordersRange && isAdmin && (
          <div className="my-4 mr-auto flex items-center space-x-2">
            <Switch
              id="load-orders"
              checked={showAllOrders}
              onCheckedChange={() => {
                setShowAllOrders(!showAllOrders)
              }}
            />
            <Label htmlFor="load-orders">
              Alle Bestellungen ({rangeLabel}) Laden
            </Label>
          </div>
        )}
      </div>
      {showAllOrders && isAdmin && (
        <Open
          startDate={convertToSupabaseDate(getStartOfDayFromDate(range.from))}
          endDate={convertToSupabaseDate(getEndOfDayFromDate(range.to))}
          currentUrlPage={userName === 'Ronny' ? 'Ronny' : 'statistic'}
          paymentPage={false}
        ></Open>
      )}
    </>
  )
}

export default StatisticPage
