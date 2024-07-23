import { useInventory } from '@/data/useInventory'
import { Label } from '@radix-ui/react-label'
import { PlusCircleIcon, TrashIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ConsumptionType } from './CreateProductV2'

type ConsumptionProp = {
  consumption: ConsumptionType[]
  setConsumption: React.Dispatch<React.SetStateAction<ConsumptionType[]>>
}

const Consumption = ({ consumption, setConsumption }: ConsumptionProp) => {
  // Data
  const { data: inventory } = useInventory()
  return (
    <>
      <Label className="mt-4 w-full font-bold">Verbrauch</Label>
      <PlusCircleIcon
        className="ml-2 mt-1 cursor-pointer"
        onClick={() => {
          setConsumption((prev) => [...prev, { name: '', quantity: '' }])
        }}
      />

      {consumption.map((item, index) => (
        <div key={index} className="mt-2 flex items-center">
          {/* Item Name */}
          <Select
            onValueChange={(value) => {
              const newConsumption = [...consumption]
              const c = newConsumption[index]
              if (c) {
                c.name = value
              }
              setConsumption(newConsumption)
            }}
            value={item.name}
          >
            <SelectTrigger className="ml-2 w-full rounded-md p-2">
              <SelectValue placeholder="Item" />
            </SelectTrigger>
            <SelectContent className="w-56">
              <SelectGroup>
                {inventory &&
                  inventory.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name} (in {item.unit})
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Quantity */}
          <Input
            tabIndex={-1}
            value={item.quantity.toString()}
            onChange={(e) => {
              const validValue = e.target.value.replace(/[^0-9]/g, '') // Remove non-numeric characters
              const newConsumption = [...consumption]
              const c = newConsumption[index]
              if (c) {
                c.quantity = validValue
              }
              setConsumption(newConsumption)
            }}
            className="ml-2 max-w-20"
            placeholder="Menge"
          />
          <TrashIcon
            className="ml-2 h-8 w-8 cursor-pointer"
            onClick={() => {
              setConsumption((prev) => prev.filter((_, i) => i !== index))
            }}
          />
        </div>
      ))}
    </>
  )
}

export default Consumption
