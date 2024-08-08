import { useUpdateInventoryMutation } from '@/data/useInventory'
import { CalculatorIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const Calculator = ({
  unit,
  id,
  quantity,
}: {
  unit: string
  id: number
  quantity: number
}) => {
  // State
  const [changeQuantity, setQuangeQuantity] = useState<string>('')
  // Mutaitons
  const { mutate: updateInventory } = useUpdateInventoryMutation()

  // Functions
  const handleQuantityChange = (action: string) => {
    if (changeQuantity === '') {
      return
    }
    const newQuantity =
      action === 'add'
        ? quantity + parseInt(changeQuantity)
        : quantity - parseInt(changeQuantity)

    updateInventory({
      id,
      inventoryItem: {
        quantity: newQuantity,
      },
    })
  }

  return (
    <>
      <div className="ml-2 flex cursor-pointer items-center">
        <Popover>
          <PopoverTrigger>
            <CalculatorIcon className="h-5 w-5" />
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <div>
              <div className="flex items-center">
                <Input
                  type="string"
                  placeholder="Menge"
                  onChange={(e) => {
                    // Allow only digits
                    const validValue = e.target.value.replace(/[^0-9]/g, '')
                    setQuangeQuantity(validValue)
                  }}
                />
                <Label className="ml-2">{unit}</Label>
              </div>

              <Button
                variant={'outline'}
                className="mt-2 flex w-full justify-start"
                onClick={() => {
                  handleQuantityChange('add')
                }}
              >
                <PlusCircleIcon className="h-5 w-5" />
                <Label className="ml-1 cursor-pointer">Hinzufügen</Label>
              </Button>
              <Button
                onClick={() => {
                  handleQuantityChange('subtract')
                }}
                variant={'outline'}
                className="mt-1 flex w-full justify-start"
              >
                <MinusCircleIcon className="h-5 w-5" />
                <Label className="ml-1 cursor-pointer">Abziehen</Label>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}

export default Calculator
