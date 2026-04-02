import {
  Category,
  useAddCategory,
  useDeleteCategory,
  useProductCategories,
  useUpdateCategoryOrderMutation,
} from '@/data/useProductCategories'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Label } from '@radix-ui/react-label'
import {
  ChevronDownIcon,
  GripVerticalIcon,
  PenIcon,
  SaveIcon,
  Trash2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

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

/** Sortable row for a single category */
function SortableCategoryItem({
  category,
  onDelete,
}: {
  category: Category
  onDelete: (id: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="mt-2">
      <div className="flex items-center justify-between rounded-lg border p-2">
        <div className="flex items-center gap-2">
          <GripVerticalIcon
            className="text-muted-foreground cursor-grab"
            style={{ touchAction: 'none' }}
            {...attributes}
            {...listeners}
          />
          <Label>{category.category}</Label>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2Icon className="cursor-pointer text-red-600" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kategorie löschen?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(category.id)
                }}
              >
                Bestätigen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

const ChangeCategories = () => {
  const [open, setOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const { data } = useProductCategories()
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()

  // Sync local state when server data changes
  useEffect(() => {
    if (data) setCategories(data)
  }, [data])

  const { mutate: deleteCategory } = useDeleteCategory()
  const { mutate: addCategory } = useAddCategory()
  const { mutate: updateOrder } = useUpdateCategoryOrderMutation()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !categories.length) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex)

    // Optimistically update local state
    setCategories(reordered)

    // Assign sequential sort_order values
    const updates = reordered.map((c, index) => ({
      id: c.id,
      sort_order: index,
    }))

    updateOrder(updates, {
      onSuccess: () => {
        toast({ title: 'Reihenfolge gespeichert ✅', duration: 2000 })
      },
      onError: () => {
        // Revert on error
        if (data) setCategories(data)
        toast({ title: 'Fehler beim Speichern der Reihenfolge ❌' })
      },
    })
  }

  // Add new Category
  const handleAddCategory = () => {
    if (!newCategory) return
    const maxOrder = categories.length
      ? Math.max(...categories.map((c) => c.sort_order ?? 0), -1)
      : 0
    addCategory(
      { category: newCategory, sort_order: maxOrder + 1 },
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((category) => (
                  <SortableCategoryItem
                    key={category.id}
                    category={category}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </SortableContext>
            </DndContext>

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
