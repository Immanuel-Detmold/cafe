import { useInventory } from '@/data/useInventory'
import { Label } from '@radix-ui/react-label'
import { PlusCircleIcon, TrashIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        className="mt-2 cursor-pointer"
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
            <SelectTrigger className="ml-2 w-36 rounded-md p-2">
              <SelectValue placeholder="Einheit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Item</SelectLabel>
                {inventory &&
                  inventory.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
            className="ml-2 w-1/2"
            placeholder="Menge"
          />
          <TrashIcon
            className="ml-2 cursor-pointer"
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
