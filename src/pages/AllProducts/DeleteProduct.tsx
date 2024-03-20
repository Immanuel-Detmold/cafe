import { queryClient } from '@/App'
import { Product, useDeleteProductMutation } from '@/data/useProducts'
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
import { SheetClose } from '@/components/ui/sheet'

const DeleteProduct = ({ product }: { product: Product }) => {
  const { mutate: deleteProductMutation } = useDeleteProductMutation()

  const handleDelete = () => {
    deleteProductMutation(product, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['products'] })
        console.log('Product deleted')
      },
      onError: (error) => {
        console.error('Failed to delete product:', error)
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="text-right">
          <Button className="w-full bg-red-700" variant="destructive">
            Löschen
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
            <SheetClose>
              <AlertDialogAction
                className="ml-2 bg-red-700"
                onClick={handleDelete}
              >
                Löschen
              </AlertDialogAction>
            </SheetClose>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProduct
