import { usePrintersQuery } from '@/data/usePrinter'
import { ChevronLeftIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: printers } = usePrintersQuery()
  const columns = Columns()
  return (
    // Table

    <div className="container mx-auto py-10">
      {printers && <DataTable columns={columns} data={printers} />}

      <div className="flex justify-start">
        <Button
          className="mr-auto"
          onClick={() => {
            navigate('/admin/settings')
          }}
        >
          <ChevronLeftIcon className="cursor-pointer" />
        </Button>
      </div>
    </div>
  )
}
