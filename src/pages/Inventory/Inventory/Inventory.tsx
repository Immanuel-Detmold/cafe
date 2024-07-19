import { useInventory } from '@/data/useInventory'
import { useUser } from '@/data/useUser'
import { getDistinctDatesData } from '@/pages/Statistic/helperFunctions'
import { ChevronLeftIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  const { data: inventory } = useInventory()
  const [userRole, setUserRole] = useState('user')

  const { user } = useUser()
  const navigate = useNavigate()
  const distinctDates = useMemo(() => {
    if (!inventory) return []
    return getDistinctDatesData(inventory)
  }, [inventory])

  // Use Effect
  useEffect(() => {
    const role = user?.user_metadata?.role as string
    if (role === 'admin') {
      setUserRole('admin')
    }
  }, [user])

  // Data
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

      <div className="flex items-center justify-between">
        <Button
          className=""
          onClick={() => {
            navigate('/admin/new-order')
          }}
        >
          <ChevronLeftIcon className="cursor-pointer" />
        </Button>

        {userRole === 'admin' && (
          <Button
            className="ml-2"
            onClick={() => {
              navigate('/admin/settings')
            }}
          >
            Inventar Kategorien Ändern
          </Button>
        )}
      </div>
    </div>
  )
}
