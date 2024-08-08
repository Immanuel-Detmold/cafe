import { useUpdateAppData } from '@/data/useAppData'
import { Label } from '@radix-ui/react-label'
import { RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const ResetOrderNumber = () => {
  const { toast } = useToast()

  const { mutate: updateAppData } = useUpdateAppData()

  const handleReset = () => {
    updateAppData({
      key: 'order_number',
      value: '0',
    })

    toast({ title: 'Bestellnummer zurückgesetzt ✅', duration: 800 })
  }

  return (
    <>
      <div>
        <Button onClick={handleReset}>
          <div className="flex w-full min-w-80 justify-between">
            <div className="flex items-center">
              <RotateCcwIcon />
              <Label className="ml-1 cursor-pointer">
                Bestellnummer zurücksetzen
              </Label>
            </div>
          </div>
        </Button>
      </div>
    </>
  )
}

export default ResetOrderNumber
