import { queryClient } from '@/App'
import { useCafeCards, useDeleteCafeCard } from '@/data/useCafeCard'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { formatDateToDateAndTime } from '@/generalHelperFunctions/dateHelperFunctions'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'

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
import { useToast } from '@/components/ui/use-toast'

const CardHistory = () => {
  const { data: cardData } = useCafeCards({})

  const { mutate: deleteCard } = useDeleteCafeCard()
  const { toast } = useToast()

  const handleDeleteCard = (id: number) => {
    deleteCard(id, {
      onSuccess: () => {
        console.log('Success Deleting Card!')
        toast({ title: 'Karte gelöscht ✅', duration: 800 })
        void queryClient.invalidateQueries({ queryKey: ['cafeCards'] })
      },
      onError: () => {
        toast({ title: 'Fehler: Karte konnte nicht gelöscht werden!' })
      },
    })
  }

  return (
    <>
      <div className="grid gap-4">
        {cardData &&
          cardData.map((card) => (
            <div
              key={card.id}
              className="relative flex h-40 w-80 flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black"
            >
              <Label className="3xl cinzel-decorative-regular font-bold">
                CAFÈ-KARTE
              </Label>
              <Label className="3xl cinzel-decorative-regular font-bold">
                Summe: {centsToEuro(card.price)} €
              </Label>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="">
                    <TrashIcon className="absolute bottom-2 right-2 h-10 cursor-pointer hover:text-red-600" />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-96">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cafe Karte löschen?</AlertDialogTitle>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <div className="">
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>

                      <AlertDialogAction
                        className="ml-2 bg-red-700 hover:bg-red-800"
                        onClick={() => {
                          handleDeleteCard(card.id)
                        }}
                      >
                        Löschen
                      </AlertDialogAction>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Label className="3xl cinzel-decorative-bold absolute bottom-3 font-bold text-amber-400">
                {formatDateToDateAndTime(card.created_at)}
              </Label>
            </div>
          ))}
      </div>
    </>
  )
}

export default CardHistory
