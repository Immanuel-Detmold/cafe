// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Inventory } from '@/data/useInventory'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Calculator from './Calculator'

// export type Payment = {
//   id: string
//   amount: number
//   status: 'pending' | 'processing' | 'success' | 'failed'
//   email: string
// }

const Columns = () => {
  const navigate = useNavigate()

  const columns: ColumnDef<Inventory>[] = [
    {
      accessorKey: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          variant={'ghost'}
          onClick={() => {
            navigate(`/admin/inventory/${row.original.id}`)
          }}
        >
          <Edit2Icon className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Menge
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <div
            className={`flex items-center ${row.original.warning !== null && row.original.quantity < row.original.warning ? 'font-bold text-red-500' : ''}`}
          >
            {row.original.quantity} {row.original.unit}
          </div>
          <Calculator
            quantity={row.original.quantity}
            unit={row.original.unit}
            id={row.original.id}
          />
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
