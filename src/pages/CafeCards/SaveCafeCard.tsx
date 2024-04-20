import { queryClient } from '@/App'
import { useCreateCafeCard } from '@/data/useCafeCard'
import { EuroToCents } from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { ShoppingCart } from 'lucide-react'

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
import { useToast } from '@/components/ui/use-toast'

const SaveCafeCard = ({ price }: { price: string }) => {
  const { mutate: saveCard } = useCreateCafeCard()

  const { toast } = useToast()

  const handleAddCafeCard = () => {
    const cents = EuroToCents(price)
    saveCard(
      { price: cents },
      {
        onSuccess: () => {
          // console.log('Saved Cafe Card')
          toast({ title: 'Cafe Karte angelegt ✅', duration: 500 })
          void queryClient.invalidateQueries({ queryKey: ['cafeCard'] })
        },
        onError: () => {
          toast({ title: 'Cafe Karte konnte nicht angelegt werden!' })
        },
      },
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="">
          <Button className="w-40" variant="default">
            Bestellen <ShoppingCart className="ml-1 h-4 w-4"></ShoppingCart>
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Cafe Karten bestellen?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="">
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>

            <AlertDialogAction
              className="ml-2 bg-emerald-800 hover:bg-emerald-900"
              onClick={handleAddCafeCard}
            >
              Bestellen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SaveCafeCard
