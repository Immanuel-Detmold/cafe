// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Expense } from '@/data/useExpense'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { formatDateToLocalDate } from '@/generalHelperFunctions/dateHelperFunctions'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

// export type Payment = {
//   id: string
//   amount: number
//   status: 'pending' | 'processing' | 'success' | 'failed'
//   email: string
// }

const Columns = () => {
  const navigate = useNavigate()

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          variant={'ghost'}
          onClick={() => {
            navigate(`/admin/new-expense/${row.original.id}`)
          }}
        >
          <Edit2Icon className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'purchase_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Kaufdatum
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <p>{formatDateToLocalDate(row.original.purchase_date)}</p>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Preis
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <p>{centsToEuro(row.original.price)} €</p>,
    },
    {
      accessorKey: 'comment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Kommentar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  return columns
}

export default Columns
