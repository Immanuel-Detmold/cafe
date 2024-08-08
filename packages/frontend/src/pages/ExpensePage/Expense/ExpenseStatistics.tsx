import { useExpensesQuery } from '@/data/useExpense'
import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  convertToSupabaseDate,
  getEndOfYear,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import {
  getSumExpenses,
  getSumOrdersV2,
} from '@/pages/Statistic/helperFunctions'
import { Loader2Icon } from 'lucide-react'

import { Label } from '@/components/ui/label'

type expenseProps = {
  startDate: Date
  endDate: Date
  timeWindow: string
}

const ExpenseStatistics = ({
  startDate,
  endDate,
  timeWindow,
}: expenseProps) => {
  // Initialize
  let StartDate = new Date()
  let EndDate = new Date()
  if (timeWindow === 'year') {
    StartDate = getStartOfYear(startDate)
    EndDate = getEndOfYear(endDate)
  }

  // Request data
  const { data: ordersYear, isLoading: l2 } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: convertToSupabaseDate(StartDate),
  })
  const { data: expenses } = useExpensesQuery({
    startDate: convertToSupabaseDate(StartDate),
    endDate: convertToSupabaseDate(EndDate),
  })

  // Preprocess data
  // Sum turnover this year
  const turnover = !ordersYear
    ? '...'
    : getSumOrdersV2(ordersYear, StartDate, EndDate)

  // Sum expenses
  const sumExpenses = !expenses
    ? '...'
    : getSumExpenses(expenses, StartDate, EndDate)

  // Profit
  let profit = 0
  if (turnover !== '...' && sumExpenses !== '...') {
    profit = turnover - sumExpenses
  }

  return (
    <>
      {/* Statistic */}
      {l2 && (
        <Label className="mt-2 flex items-center font-bold">
          <Loader2Icon className="animate-spin" />{' '}
          <span className="ml-1">Daten werden geladen...</span>
        </Label>
      )}

      <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current year  turnover*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">
            Dieses Jahr ({StartDate.getFullYear()})
          </Label>
          <Label className="text-2xl font-bold">
            {turnover !== '...'
              ? centsToEuro(turnover).toString() + '€'
              : '...'}
          </Label>
          <Label className="text-muted-foreground">Umsatz</Label>
        </div>

        {/* Current year  expense*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">
            Dieses Jahr ({StartDate.getFullYear()})
          </Label>
          <Label className="text-2xl font-bold">
            {sumExpenses !== '...' ? centsToEuro(sumExpenses) + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Ausgaben</Label>
        </div>

        {/* Current year  profit*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">
            Dieses Jahr ({StartDate.getFullYear()})
          </Label>
          <Label className="text-2xl font-bold">
            {profit !== 0 ? centsToEuro(profit) + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Gewinn</Label>
        </div>
      </div>
    </>
  )
}

export default ExpenseStatistics
