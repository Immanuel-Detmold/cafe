import { Label } from '@radix-ui/react-label'
import React from 'react'

import { Switch } from '@/components/ui/switch'

interface PrintForProps {
  printFor: string[]
  handlePrintForChange: (type: string, checked: boolean) => void
}

const PrintFor: React.FC<PrintForProps> = ({
  printFor,
  handlePrintForChange,
}) => {
  return (
    <>
      <Label htmlFor="port" className="mt-4 font-bold">
        Drucken für
      </Label>
      <div className="mt-2 flex items-center">
        <Switch
          id={'customer'}
          checked={printFor.includes('customer')}
          onCheckedChange={(checked) =>
            handlePrintForChange('customer', checked)
          }
        />
        <label htmlFor={'customer'} className="ml-2">
          Kunde
        </label>
      </div>
      <div className="mt-2 flex items-center">
        <Switch
          id={'staff'}
          checked={printFor.includes('staff')}
          onCheckedChange={(checked) => handlePrintForChange('staff', checked)}
        />
        <label htmlFor={'staff'} className="ml-2">
          Mitarbeiter
        </label>
      </div>
    </>
  )
}

export default PrintFor
