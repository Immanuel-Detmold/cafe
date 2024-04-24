import { Label } from '@radix-ui/react-label'
import { ChevronDownIcon, PenIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

const ChangeCategories = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div>
        <Button
          onClick={() => {
            setOpen(!open)
          }}
        >
          <div className="flex w-full min-w-80 justify-between">
            <div className="flex items-center">
              <PenIcon />
              <Label className="ml-1 cursor-pointer">
                Produkt-Kategorien Ändern
              </Label>
            </div>
            <ChevronDownIcon className="ml-1" />
          </div>
        </Button>

        {open && (
          <>
            <p>Open</p>
          </>
        )}
      </div>
    </>
  )
}

export default ChangeCategories
