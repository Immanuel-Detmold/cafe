import { queryClient } from '@/App'
import { Product, useDeleteProductMutation } from '@/data/useProducts'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Loader, Loader2Icon } from 'lucide-react'
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

const DeleteProduct = ({ product }: { product: Product }) => {
  const { mutate: deleteProductMutation, isPending } =
    useDeleteProductMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDelete = () => {
    deleteProductMutation(product, {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ['products'],
        })
        toast({ title: 'Produkt erfolgreich gelöscht! ✅' })
        navigate('/admin/all-products')
      },
      onError: (error) => {
        toast({
          title: 'Produkt konnte nicht gelöscht werden! ❌',
          description: 'Produkt befindet sich womöglich in einer Bestellung.',
        })
        console.error('Failed to delete product:', error)
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
            {isPending ? <Loader2Icon className="animate-spin" /> : 'Löschen'}
            <TrashIcon className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Möchtest du das Produkt wirklich löschen?
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

export default DeleteProduct
