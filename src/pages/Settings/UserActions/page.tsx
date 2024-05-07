import { useUserActionsQuery } from '@/data/useUserActions.tsx'
import { getDistinctDatesUser } from '@/pages/Statistic/helperFunctions'
import { ChevronLeftIcon } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'

import { columns } from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  const { data: userActions } = useUserActionsQuery()

  const distinctDates = useMemo(() => {
    if (!userActions) return []
    return getDistinctDatesUser(userActions)
  }, [userActions])

  return (
    // Table

    <div className="container mx-auto py-10">
      {userActions && distinctDates && (
        <DataTable
          columns={columns}
          data={userActions}
          dataDates={distinctDates}
        />
      )}

      <Button className="ml-auto mt-2">
        <ChevronLeftIcon />
      </Button>
    </div>
  )
}
