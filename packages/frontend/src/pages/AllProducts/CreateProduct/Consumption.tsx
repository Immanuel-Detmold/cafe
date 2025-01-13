'use client'

import { useInventory } from '@/data/useInventory'
import { Label } from '@radix-ui/react-label'
import { Edit2Icon, EditIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import InfoIconPopover from '@/components/InfoIconPopover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type ConsumptionType = {
  name: string
  quantity: string
}

type ConsumptionProps = {
  consumption: ConsumptionType[]
  setConsumption: React.Dispatch<React.SetStateAction<ConsumptionType[]>>
}

export const Consumption: React.FC<ConsumptionProps> = ({
  consumption,
  setConsumption,
}) => {
  const { data: inventory } = useInventory()
  const navigate = useNavigate()

  const addConsumption = () => {
    setConsumption((prev) => [...prev, { name: '', quantity: '' }])
  }

  const updateConsumption = (
    index: number,
    field: keyof ConsumptionType,
    value: string,
  ) => {
    setConsumption((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === 'quantity' ? value.replace(/[^0-9]/g, '') : value,
            }
          : item,
      ),
    )
  }

  const deleteConsumption = (index: number) => {
    setConsumption((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-4">
      <div>
        <Label className="mb-4 flex items-center font-bold">
          Verbrauch
          <InfoIconPopover text="Nachdem eine Bestellung abgeschlossen ist, wird der Verbrauch vom Inventar abgezogen." />
        </Label>
        {consumption.map((item, index) => (
          <div key={index} className="mb-2 flex items-center space-x-2">
            <Select
              value={item.name}
              onValueChange={(value) => updateConsumption(index, 'name', value)}
            >
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="Item auswählen" />
              </SelectTrigger>
              <SelectContent>
                {inventory &&
                  inventory.map((invItem) => (
                    <SelectItem key={invItem.id} value={invItem.name}>
                      {invItem.name} (in {invItem.unit})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Menge"
              value={item.quantity}
              onChange={(e) =>
                updateConsumption(index, 'quantity', e.target.value)
              }
              className="w-[69px]"
            />
            <div
              className="ml-1 cursor-pointer"
              onClick={() => {
                const selectedItem = inventory?.find(
                  (invItem) => invItem.name === item.name,
                )
                if (selectedItem) {
                  navigate(`/admin/inventory/${selectedItem.id}`)
                } else {
                  navigate('/admin/inventory')
                }
              }}
            >
              <Edit2Icon className="h-4 w-4" />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4 min-w-8" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Möchtest du den Verbrauch wirklich löschen?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-700"
                    onClick={() => deleteConsumption(index)}
                  >
                    Löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
      <Button
        onClick={addConsumption}
        className=""
        size={'sm'}
        variant={'link'}
      >
        + Verbrauch hinzufügen
      </Button>
    </div>
  )
}

export default Consumption
