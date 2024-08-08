import { queryClient } from '@/App'
import { Order, useDeleteOrderMutation } from '@/data/useOrders'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Loader2Icon } from 'lucide-react'

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

const DeleteOrder = ({ order }: { order: Order }) => {
  const { mutate: deleteOrder, isPending } = useDeleteOrderMutation()

  const { toast } = useToast()
  const handleDeleteOrder = (id: number) => {
    deleteOrder(id, {
      onSuccess: () => {
        toast({ title: 'Bestellung gelöscht ✅', duration: 800 })
        void queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
      },
      onError: () => {
        toast({ title: 'Fehler: Bestellung konnte nicht gelöscht werden!' })
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="">
          <Button className="w-min bg-red-700" variant="destructive">
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
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
