import { CafeCardInsert, useCreateCafeCards } from '@/data/useCafeCard'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
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

const SaveCafeCard = ({
  cards,
  resetCards,
}: {
  cards: CafeCardInsert[]
  resetCards: () => void
}) => {
  const { mutate: saveCards } = useCreateCafeCards()
  const { toast } = useToast()

  const totalPrice = cards.reduce((sum, c) => sum + (c.price ?? 0), 0)

  const handleAddCafeCards = () => {
    saveCards(cards, {
      onSuccess: () => {
        toast({
          title: `${cards.length} Café Karte${cards.length !== 1 ? 'n' : ''} angelegt ✅`,
          duration: 1000,
        })
        resetCards()
      },
      onError: () => {
        toast({ title: 'Café Karten konnten nicht angelegt werden! ❌' })
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <Button
            className="w-40"
            variant="default"
            disabled={cards.length === 0}
          >
            Bestellen <ShoppingCart className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {cards.length} Café Karte{cards.length !== 1 ? 'n' : ''} bestellen?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-1 px-1 text-sm">
          {cards.map((card, i) => (
            <div key={i} className="flex justify-between">
              <span>Café-Karte</span>
              <span>{centsToEuro(card.price ?? 0)}€</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Gesamt</span>
            <span>{centsToEuro(totalPrice)}€</span>
          </div>
        </div>
        <AlertDialogFooter>
          <div>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction className="ml-2" onClick={handleAddCafeCards}>
              Bestellen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SaveCafeCard
