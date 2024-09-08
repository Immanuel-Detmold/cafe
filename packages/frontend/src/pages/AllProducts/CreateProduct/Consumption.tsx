import { useInventory } from '@/data/useInventory'
import { Label } from '@radix-ui/react-label'
import { Edit2Icon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
import { getInventoryId } from './helperFunction'

type ConsumptionProp = {
  consumption: ConsumptionType[]
  setConsumption: React.Dispatch<React.SetStateAction<ConsumptionType[]>>
}

const Consumption = ({ consumption, setConsumption }: ConsumptionProp) => {
  // Hooks
  const navigate = useNavigate()

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
          <select
            id="itemSelect"
            className="border-border bg-background text-foreground ml-2 w-full rounded-md border p-2"
            onChange={(e) => {
              const newConsumption = [...consumption]
              const c = newConsumption[index]
              if (c) {
                c.name = e.target.value
              }
              setConsumption(newConsumption)
            }}
            value={item.name}
          >
            <option value="" disabled>
              Item
            </option>
            {inventory &&
              inventory.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} (in {item.unit})
                </option>
              ))}
          </select>
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
          {/* {inventory && (<p>{getInventoryId(inventory, item.name)}</p>)} */}
          {inventory && (
            <Edit2Icon
              className="ml-2 h-8 w-8 cursor-pointer"
              onClick={() => {
                navigate(
                  '/admin/inventory/' + getInventoryId(inventory, item.name),
                )
              }}
            />
          )}
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
