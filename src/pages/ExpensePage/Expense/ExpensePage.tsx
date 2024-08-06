import { useExpensesQuery } from '@/data/useExpense'
import { ChevronLeftIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: expenses } = useExpensesQuery()
  const columns = Columns()

  return (
    // Table

    <div className="container mx-auto py-10">
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
