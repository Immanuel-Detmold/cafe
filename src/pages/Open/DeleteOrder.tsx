import { queryClient } from '@/App'
import { Orders, useDeleteOrderMutation } from '@/data/useOrders'
import { TrashIcon } from '@heroicons/react/24/outline'

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

const DeleteOrder = ({ order }: { order: Orders }) => {
  const { mutate: deleteOrder } = useDeleteOrderMutation()

  const { toast } = useToast()
  const handleDeleteOrder = (id: number) => {
    deleteOrder(id, {
      onSuccess: () => {
        console.log('Success Deleting Order!')
        toast({ title: 'Bestellung gelöscht ✅' })
        void queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
        console.log('Deletion Sucessfull!')
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="">
          <Button className="w-min bg-red-700" variant="destructive">
            <TrashIcon className="mx-2 h-5 w-5" />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Möchtest du die Bestellung wirklich löschen?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="">
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>

            <AlertDialogAction
              className="ml-2 bg-red-700"
              onClick={() => {
                handleDeleteOrder(order.id)
              }}
            >
              Löschen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteOrder
