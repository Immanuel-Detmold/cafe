import { useDeletePrinterMutation } from '@/data/usePrinter'
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

const DeletePrinter = ({ printerId }: { printerId: string }) => {
  const { mutate: markPrinterAsDeletedMutation, isPending } =
    useDeletePrinterMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDelete = () => {
    markPrinterAsDeletedMutation(printerId, {
      onSuccess: () => {
        toast({ title: 'Drucker gelöscht! ✅', duration: 2000 })
        navigate('/admin/settings/printer')
      },
      onError: () => {
        toast({
          title: 'Drucker konnte nicht gelöscht werden! ❌',
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
            Möchtest du den Drucker wirklich löschen?
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

export default DeletePrinter
