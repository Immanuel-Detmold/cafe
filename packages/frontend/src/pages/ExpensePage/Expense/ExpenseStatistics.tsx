import { useExpensesQuery } from '@/data/useExpense'
import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { convertToSupabaseDate } from '@/generalHelperFunctions/dateHelperFunctions'
import {
  getSumExpenses,
  getSumOrdersV2,
} from '@/pages/Statistic/helperFunctions'
import { ChevronsUpDown, Loader2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'

import { LineChartComponent } from './LineChart'

type expenseProps = {
  startDate: Date
  endDate: Date
}

const ExpenseStatistics = ({ startDate, endDate }: expenseProps) => {
  // Initialize
  const StartDate = startDate
  const EndDate = endDate

  // Request data
  const { data: ordersYear, isLoading: l2 } = useOrdersAndItemsQueryV2({
    statusList: ['finished'],
    searchTerm: '',
    categories: [],
    products: [],
    startDate: convertToSupabaseDate(StartDate),
    endDate: convertToSupabaseDate(EndDate),
  })

  const { data: expensesYear, isLoading: l1 } = useExpensesQuery({
    startDate: convertToSupabaseDate(StartDate),
    endDate: convertToSupabaseDate(EndDate),
  })

  // Preprocess data
  // Sum turnover this year
  const turnover = !ordersYear
    ? '...'
    : getSumOrdersV2(ordersYear, StartDate, EndDate)

  // Sum expenses
  const sumExpenses = !expensesYear
    ? '...'
    : getSumExpenses(expensesYear, StartDate, EndDate)

  // Profit
  let profit = 0
  if (turnover !== '...' && sumExpenses !== '...') {
    profit = turnover - sumExpenses
  }

  return (
    <>
      {/* Statistic */}
      {(l2 || l1) && (
        <Label className="mt-4 flex items-center font-bold">
          <Loader2Icon className="animate-spin" />{' '}
          <span className="ml-1">Daten werden geladen...</span>
        </Label>
      )}

      <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current year  turnover*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">{StartDate.getFullYear()}</Label>
          <Label className="text-2xl font-bold">
            {turnover !== '...'
              ? centsToEuro(turnover).toString() + '€'
              : '...'}
          </Label>
          <Label className="text-muted-foreground">Umsatz</Label>
        </div>

        {/* Current year  expense*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">{StartDate.getFullYear()}</Label>
          <Label className="text-2xl font-bold">
            {sumExpenses !== '...' ? centsToEuro(sumExpenses) + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Ausgaben</Label>
        </div>

        {/* Current year  profit*/}
        <div className="grid grid-cols-1 gap-1 rounded-lg border p-2">
          <Label className="text-base">{StartDate.getFullYear()}</Label>
          <Label className="text-2xl font-bold">
            {profit !== 0 ? centsToEuro(profit) + '€' : '...'}
          </Label>
          <Label className="text-muted-foreground">Gewinn</Label>
        </div>
      </div>
      <Collapsible className="p-2">
        <CollapsibleTrigger>
          <div className="flex items-center">
            <p>Liniendiagramm anzeigen</p>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {expensesYear && ordersYear && (
            <LineChartComponent
              expensesYear={expensesYear}
              ordersYear={ordersYear}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ExpenseStatistics
