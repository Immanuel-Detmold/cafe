import { useInventory } from '@/data/useInventory'
import { getDistinctDatesData } from '@/pages/Statistic/helperFunctions'
import { ChevronLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  const { data: inventory } = useInventory()

  const navigate = useNavigate()
  const distinctDates = useMemo(() => {
    if (!inventory) return []
    return getDistinctDatesData(inventory)
  }, [inventory])

  const columns = Columns()
  return (
    // Table

    <div className="container mx-auto py-10">
      {inventory && distinctDates && (
        <DataTable
          columns={columns}
          data={inventory}
          dataDates={distinctDates}
        />
      )}

      <Button
        className="ml-auto mt-2"
        onClick={() => {
          navigate('/admin/settings')
        }}
      >
        <ChevronLeftIcon className="cursor-pointer" />
      </Button>
    </div>
  )
}
