import {
  useAddCategory,
  useDeleteCategory,
  useProductCategories,
} from '@/data/useProductCategories'
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

const ChangeCategories = () => {
  const [open, setOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const { data } = useProductCategories()
  const { toast } = useToast()

  const { mutate: deleteCategory } = useDeleteCategory()
  const { mutate: addCategory } = useAddCategory()

  // Add new Category
  const handleAddCategory = () => {
    if (!newCategory) return
    addCategory(
      { category: newCategory },
      {
        onSuccess: () => {
          setNewCategory('')
          toast({ title: 'Kategorie hinzugefügt ✅' })
        },
        onError: () => {
          toast({ title: 'Fehler beim hinzufügen der Kategorie ❌' })
        },
      },
    )
  }

  const handleDeleteCategory = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        toast({ title: 'Kategorie gelöscht ✅' })
      },
      onError: () => {
        toast({ title: 'Fehler beim löschen der Kategorie ❌' })
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
                Produktkategorien ändern
              </Label>
            </div>
            <ChevronDownIcon className="ml-1" />
          </div>
        </Button>

        {open && (
          <>
            {data &&
              data.map((category) => (
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
                            Kategorie löschen?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteCategory(category.id)
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

            {/* New Category */}
            <Input
              className="mt-2"
              placeholder="Neue Kategorie"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value)
              }}
            />
            <Button className="ml-auto mt-2 flex" variant="outline">
              <SaveIcon />
              <Label
                className="ml-1 cursor-pointer"
                onClick={handleAddCategory}
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

export default ChangeCategories
