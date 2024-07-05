import {
  useInventoryItem,
  useSaveInventoryMutation,
  useUpdateInventoryMutation,
} from '@/data/useInventory'
import { useInventoryCategories } from '@/data/useInventoryCategories'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import DeleteInventoryItem from './DeleteInventoryItem'

const NewItem = () => {
  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [comment, setComment] = useState('')
  const [unit, setUnit] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [missingFields, setMissingFields] = useState<boolean>(false)

  // Functions
  const { toast } = useToast()
  const navigate = useNavigate()
  const itemId = useParams().id

  // Data
  const { data: categoryData } = useInventoryCategories()
  const mutationInventory = useSaveInventoryMutation()
  const { data: inventoryItem } = useInventoryItem(itemId)
  const updateItem = useUpdateInventoryMutation()

  // Use Effects
  useEffect(() => {
    if (itemId) {
      if (!inventoryItem) return
      setName(inventoryItem?.name)
      setCategory(inventoryItem?.category)
      setQuantity(inventoryItem?.quantity.toString())
      setUnit(inventoryItem?.unit)
      if (inventoryItem?.comment !== null) {
        setComment(inventoryItem?.comment)
      }
    }
  }, [itemId, inventoryItem])

  // Handle form submission
  const handleAddItem = () => {
    if (!name || !category || !quantity || !unit) {
      setMissingFields(true)
      return
    }
    setMissingFields(false)

    if (itemId && inventoryItem) {
      // Update Item
      updateItemFunction()
    } else {
      // Save Item
      saveItem()
    }
  }

  // Update Item
  const updateItemFunction = () => {
    if (itemId && inventoryItem) {
      const newInventoryItem = {
        name,
        category,
        quantity: parseInt(quantity),
        unit,
        comment,
      }
      updateItem.mutate(
        { id: itemId, inventoryItem: newInventoryItem },
        {
          onSuccess: () => {
            // console.log(data)
            toast({ title: 'Item aktualisiert ✅' })
            resetForm()
            navigate('/admin/inventory')
          },
          onError: () => {
            toast({ title: 'Fehler beim Aktualisieren des Items ❌' })
          },
        },
      )
    }
  }

  // Save item
  const saveItem = () => {
    mutationInventory.mutate(
      {
        name,
        category,
        quantity: parseInt(quantity),
        unit,
        comment,
      },
      {
        onSuccess: () => {
          toast({ title: 'Item hinzugefügt ✅' })
          resetForm()
          navigate('/admin/inventory')
        },
        onError: () => {
          toast({ title: 'Fehler beim Hinzufügen des Items ❌' })
        },
      },
    )
  }
  const resetForm = () => {
    setQuantity('')
    setName('')
    setCategory('')
    setUnit('')
    setComment('')
  }
  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="mt-2 flex flex-col">
          <Label htmlFor="name" className="font-bold">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            placeholder="Item Name"
          />

          <Label htmlFor="category" className="mt-4 font-bold">
            Kategorie
          </Label>
          <div className="mt-4">
            <Select
              onValueChange={(value) => {
                setCategory(value)
              }}
              defaultValue={category}
              value={category}
            >
              <SelectTrigger className="w-fill" tabIndex={-1}>
                <SelectValue placeholder="Wähle Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {categoryData?.map((category) => (
                  <SelectItem key={category.id} value={category.category}>
                    {category.category}
                  </SelectItem>
                ))}
                <SelectItem value="Sonstiges">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity & Unit */}

          <div className="mt-4">
            {/* Quantity */}

            <Label htmlFor="quantity" className="mt-4 font-bold">
              Menge & Einheit
            </Label>

            <div className="mt-1 flex">
              <Input
                id="quantity"
                value={quantity}
                type="text" // Change type to "text" to handle input manually
                onChange={(e) => {
                  // Allow only digits
                  const validValue = e.target.value.replace(/[^0-9]/g, '')
                  setQuantity(validValue)
                }}
                className=""
                placeholder="Item Anzahl"
              />

              {/* Unit */}
              <Select
                onOpenChange={(isOpen) => setIsSelectOpen(isOpen)}
                onValueChange={(value) => {
                  setUnit(value)
                }}
                defaultValue={unit}
                value={unit}
              >
                <SelectTrigger className="ml-2 w-36 rounded-md p-2">
                  <SelectValue placeholder="Einheit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Einheiten</SelectLabel>
                    <SelectItem value="kg">Kilogramm</SelectItem>
                    <SelectItem value="g">Gramm</SelectItem>
                    <SelectItem value="Stk.">Stücke</SelectItem>
                    <SelectItem value="L">Liter</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Label htmlFor="comment" className="mt-4 font-bold">
            Kommentar
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1"
            placeholder="Zusätzlicher Kommentar"
          ></Textarea>
        </div>

        {missingFields && (
          <div className="mt-2 text-sm font-bold text-red-500">
            Bitte fülle alle Felder aus.
          </div>
        )}
        <div className="mt-4 flex justify-between">
          {/* Back Button */}
          <Button
            className="mr-auto"
            onClick={() => {
              navigate('/admin/inventory')
            }}
          >
            <ChevronLeftIcon className="cursor-pointer" />
          </Button>

          {/* Delete Button */}
          {itemId && inventoryItem && (
            <DeleteInventoryItem item={inventoryItem} />
          )}

          {/* Save Button */}
          <Button
            onClick={handleAddItem}
            disabled={isSelectOpen}
            className="ml-2"
          >
            <div className="flex items-center">
              {mutationInventory.isPending ? (
                <Loader2Icon className="h-8 w-8 animate-spin" />
              ) : (
                'Speichern'
              )}{' '}
              <SaveIcon className="ml-1" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewItem
