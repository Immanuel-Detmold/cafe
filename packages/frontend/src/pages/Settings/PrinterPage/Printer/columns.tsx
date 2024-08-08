// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Printer } from '@/data/usePrinter'
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

  const columns: ColumnDef<Printer>[] = [
    {
      accessorKey: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          variant={'ghost'}
          onClick={() => {
            navigate(`/admin/settings/printer/new-printer/${row.original.id}`)
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
      accessorKey: 'ip',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Ip-Adresse
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'port',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Port
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'categories',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Kategorien
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        // join category array and print with white spaces in between
        <span>{row.original.categories.join(', ')}</span>
      ),
    },
  ]

  return columns
}

export default Columns
