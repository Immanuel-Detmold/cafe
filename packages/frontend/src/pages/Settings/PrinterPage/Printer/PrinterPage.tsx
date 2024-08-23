import { useAppData, useUpdateAppData } from '@/data/useAppData'
import { usePrintersQuery } from '@/data/usePrinter'
import { ChevronLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import InfoIconPopover from '@/components/InfoIconPopover'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import Columns from './columns'
import { DataTable } from './data-table'

export default function UserActions() {
  const [printOn, setPrintOn] = useState(false)

  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: printers } = usePrintersQuery()
  const columns = Columns()
  const { data: appData } = useAppData()

  // Mutations
  const { mutate: updateAppData } = useUpdateAppData()

  // Use Effect
  useEffect(() => {
    const print_on = appData?.find((item) => item.key === 'print_mode')
    if (print_on) {
      if (print_on.value === 'true') {
        setPrintOn(true)
      }
    }
  }, [appData])

  return (
    // Table

    <div className="container mx-auto py-10">
      {printers && <DataTable columns={columns} data={printers} />}

      <div className="flex justify-between">
        <Button
          className="mr-auto"
          onClick={() => {
            navigate('/admin/settings')
          }}
        >
          <ChevronLeftIcon className="cursor-pointer" />
        </Button>

        <div className="flex items-center">
          <Switch
            id="printOn"
            checked={printOn}
            onCheckedChange={() => {
              setPrintOn(!printOn)
              updateAppData({ key: 'print_mode', value: (!printOn).toString() })
            }}
          />
          <label htmlFor={'printOn'} className="ml-2">
            Drucken
          </label>
          <InfoIconPopover text="Aktiviert oder deaktiviert die Standardeinstellung für das Drucken bei Bestellungsaufnahme." />
        </div>
      </div>
    </div>
  )
}
