import { useDeleteExpenseMutation } from '@/data/useExpense'
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

const DeleteExpense = ({ expenseId }: { expenseId: string }) => {
  const { mutate: markExpenseAsDeletedMutation, isPending } =
    useDeleteExpenseMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDelete = () => {
    markExpenseAsDeletedMutation(expenseId, {
      onSuccess: () => {
        toast({ title: 'Ausgabe gelöscht! ✅', duration: 2000 })
        navigate('/admin/expense')
      },
      onError: () => {
        toast({
          title: 'Ausgabe konnte nicht gelöscht werden! ❌',
          duration: 2000,
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
            <TrashIcon className="ml-r h-6 w-6" />
            {isPending ? (
              <Loader2Icon className="h-8 w-8 animate-spin" />
            ) : (
              'Löschen'
            )}
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Möchtest du die Ausgabe wirklich löschen?
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

export default DeleteExpense
