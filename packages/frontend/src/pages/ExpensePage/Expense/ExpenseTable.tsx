import { useExpensesQuery } from '@/data/useExpense'
import { useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import {
  getEndOfYear,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { getDistinctYears } from '@/pages/Statistic/helperFunctions'
import { ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import PickYear from '../PickYear'
import ExpenseStatistics from './ExpenseStatistics'
import Columns from './columns'
import { DataTable } from './data-table'

type selectedDateProp = {
  startDate: Date
  endDate: Date
}

export default function UserActions() {
  // State
  const [selectedYear, setSelectedYear] = useState<selectedDateProp>({
    startDate: getStartOfYear(new Date()),
    endDate: getEndOfYear(new Date()),
  })

  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: expenses } = useExpensesQuery({})
  const { data: orders } = useOrdersAndItemsQueryV2({})
  const columns = Columns()
  // More Data
  const distinctYears = !orders ? [] : getDistinctYears(orders)
  const distinctExpensesYears = !expenses ? [] : getDistinctYears(expenses)
  const distinctYearsAll = [
    ...new Set([...distinctYears, ...distinctExpensesYears]),
  ]

  return (
    <div className="container mx-auto py-10">
      {/* Select time window */}
      <div className="flex space-x-2">
        <PickYear
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          distinctYears={distinctYearsAll}
        />
      </div>
      {/* Statistics */}
      {expenses && (
        <ExpenseStatistics
          startDate={selectedYear.startDate}
          endDate={selectedYear.endDate}
        />
      )}

      {/* Table */}
      {expenses && <DataTable columns={columns} data={expenses} />}

      <div className="flex justify-between">
        <Button
          className="mr-auto"
          onClick={() => {
            navigate('/admin/new-order')
          }}
        >
          <ChevronLeftIcon className="cursor-pointer" />
        </Button>
      </div>
    </div>
  )
}
