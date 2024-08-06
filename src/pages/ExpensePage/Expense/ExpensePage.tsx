import { useExpensesQuery } from '@/data/useExpense'
import {
  getEndOfYear,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { getDistinctDates } from '@/pages/Statistic/helperFunctions'
import { ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import TimeWindowPicker from '../TimeWindowPicker'
import ExpenseStatistics from './ExpenseStatistics'
import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  // State
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Mini Functions
  const startOfYear = getStartOfYear(new Date())
  const endOfYear = getEndOfYear(new Date())

  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: expenses } = useExpensesQuery({})
  const columns = Columns()

  // More Data

  // Get distinct dates
  const distinctDates = !expenses ? [] : getDistinctDates(expenses)

  return (
    <div className="container mx-auto py-10">
      {/* Select time window */}
      <div className="flex space-x-2">
        <Select defaultValue="year">
          <SelectTrigger className="">
            <SelectValue placeholder="Zeitraum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Jahr</SelectItem>
            <SelectItem value="month">Monat</SelectItem>
            <SelectItem value="week">Woche</SelectItem>
          </SelectContent>
        </Select>
        <TimeWindowPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          distinctDates={distinctDates}
        />
      </div>
      {/* Statistics */}
      {expenses && (
        <ExpenseStatistics
          startDate={startOfYear}
          endDate={endOfYear}
          timeWindow="year"
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
