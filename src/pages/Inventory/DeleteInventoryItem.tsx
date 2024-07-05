import {
  Inventory,
  useMarkInventoryItemAsDeletedMutation,
} from '@/data/useInventory'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Loader2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
import { useToast } from '@/components/ui/use-toast'

const DeleteInventoryItem = ({ item }: { item: Inventory }) => {
  const { mutate: markInventoryItemAsDeletedMutation, isPending } =
    useMarkInventoryItemAsDeletedMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDelete = () => {
    markInventoryItemAsDeletedMutation(item, {
      onSuccess: () => {
        toast({ title: 'Item marked as deleted! ✅' })
        navigate('/admin/inventory')
      },
      onError: () => {
        toast({
          title: 'Failed to mark the item as deleted! ❌',
        })
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="">
          <Button
            className="w-full bg-red-700"
            variant="destructive"
            tabIndex={-1}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="h-8 w-8 animate-spin" />
            ) : (
              'Löschen'
            )}
            <TrashIcon className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Möchtest du dieses Item wirklich löschen?
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
              onClick={handleDelete}
            >
              Löschen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteInventoryItem
