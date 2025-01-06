import { useInventory } from '@/data/useInventory'
import { Label } from '@radix-ui/react-label'
import { Edit2Icon, PlusCircleIcon, TrashIcon } from 'lucide-react'
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
import { Input } from '@/components/ui/input'

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
      <Label className="mt-4 flex w-full items-center font-bold">
        Verbrauch{' '}
        <InfoIconPopover text="Nachdem eine Bestellung abgeschlossen ist, wird der Verbrauch vom Inventar abgezogen." />
      </Label>
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
              className="ml-4 h-10 w-10 cursor-pointer"
              onClick={() => {
                navigate(
                  '/admin/inventory/' + getInventoryId(inventory, item.name),
                )
              }}
            />
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="ml-4 flex h-6 w-6 cursor-pointer items-center justify-center">
                <TrashIcon className="" />
              </div>
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
                <div className="block text-right">
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>

                  <AlertDialogAction
                    className="ml-2 bg-red-700"
                    onClick={() => {
                      setConsumption((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }}
                  >
                    Löschen
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </>
  )
}

export default Consumption
