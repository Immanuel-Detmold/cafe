import {
  useAddInventoryCategory,
  useDeleteInventoryCategory,
  useInventoryCategories,
} from '@/data/useInventoryCategories'
import { Label } from '@radix-ui/react-label'
import { ChevronDownIcon, PenIcon, SaveIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const ChangeInventoryCategories = () => {
  const [open, setOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const { data } = useInventoryCategories()
  const { toast } = useToast()

  const { mutate: deleteInventoryCategory } = useDeleteInventoryCategory()
  const { mutate: addInventoryCategory } = useAddInventoryCategory()

  // Add new Inventory Category
  const handleAddInventoryCategory = () => {
    if (!newCategory) return
    addInventoryCategory(
      { category: newCategory },
      {
        onSuccess: () => {
          setNewCategory('')
          toast({ title: 'Inventarkategorie hinzugefügt ✅' })
        },
        onError: () => {
          toast({ title: 'Fehler beim Hinzufügen der Inventarkategorie ❌' })
        },
      },
    )
  }

  const handleDeleteInventoryCategory = (id: number) => {
    deleteInventoryCategory(id, {
      onSuccess: () => {
        toast({ title: 'Inventarkategorie gelöscht ✅' })
      },
      onError: () => {
        toast({ title: 'Fehler beim Löschen der Inventarkategorie ❌' })
      },
    })
  }

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
                Inventarkategorien ändern
              </Label>
            </div>
            <ChevronDownIcon className="ml-1" />
          </div>
        </Button>

        {open && (
          <>
            {data &&
              data.map((category: { id: number; category: string }) => (
                <div className="" key={category.id}>
                  <div className="mt-2 flex justify-between rounded-lg border p-2">
                    <Label>{category.category}</Label>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2Icon className="cursor-pointer text-red-600" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Inventarkategorie löschen?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteInventoryCategory(category.id)
                            }}
                          >
                            Bestätigen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}

            {/* New Inventory Category */}
            <Input
              className="mt-2"
              placeholder="Neue Inventarkategorie"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value)
              }}
            />
            <Button className="ml-auto mt-2 flex" variant="outline">
              <SaveIcon />
              <Label
                className="ml-1 cursor-pointer"
                onClick={handleAddInventoryCategory}
              >
                Speichern
              </Label>
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default ChangeInventoryCategories
