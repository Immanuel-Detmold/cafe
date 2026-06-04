import { CafeCard, useCafeCards, useDeleteCafeCards } from '@/data/useCafeCard'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  convertToSupabaseDate,
  getEndOfYear,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { formatDateToDateAndTime } from '@/generalHelperFunctions/dateHelperFunctions'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { useMemo, useState } from 'react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 2023 }, (_, i) =>
  (currentYear - i).toString(),
)

const CardHistory = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())

  const startDate = convertToSupabaseDate(
    getStartOfYear(new Date(parseInt(selectedYear), 0, 1)),
  )
  const endDate = convertToSupabaseDate(
    getEndOfYear(new Date(parseInt(selectedYear), 0, 1)),
  )

  const { data: cardData } = useCafeCards({ startDate, endDate })
  const { mutate: deleteCards } = useDeleteCafeCards()
  const { toast } = useToast()

  // Group cards by purchase_group_id (or fall back to timestamp second for legacy cards without a group id)
  const groups = useMemo(() => {
    if (!cardData) return []
    const map = new Map<string, CafeCard[]>()
    for (const card of cardData) {
      const key: string =
        card.purchase_group_id ?? card.created_at.substring(0, 19)
      const existing = map.get(key)
      if (existing) {
        existing.push(card)
      } else {
        map.set(key, [card])
      }
    }
    return Array.from(map.values())
  }, [cardData])

  const handleDeleteGroup = (ids: number[]) => {
    deleteCards(ids, {
      onSuccess: () => {
        toast({
          title: `${ids.length} Karte${ids.length !== 1 ? 'n' : ''} gelöscht ✅`,
          duration: 800,
        })
      },
      onError: () => {
        toast({ title: 'Fehler: Karten konnten nicht gelöscht werden! ❌' })
      },
    })
  }

  return (
    <>
      {/* Year Filter */}
      <div className="mb-4 mt-2 flex flex-col space-y-1.5">
        <Label className="font-black">Jahr</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Jahr" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Groups */}
      <div className="grid gap-4">
        {groups.map((group) => {
          const ids = group.map((c) => c.id)
          const total = group.reduce((sum, c) => sum + c.price, 0)
          const purchaseTime = formatDateToDateAndTime(group[0]!.created_at)

          return (
            <div
              key={group[0]!.created_at.substring(0, 19)}
              className="relative w-80 rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black"
            >
              {/* Header row */}
              <div className="mb-2 flex items-center justify-between">
                <Label className="cinzel-decorative-regular font-bold text-amber-400">
                  {purchaseTime}
                </Label>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TrashIcon className="h-6 w-6 cursor-pointer hover:text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-96">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {ids.length} Karte{ids.length !== 1 ? 'n' : ''} löschen?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <div>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          className="ml-2 bg-red-700 hover:bg-red-800"
                          onClick={() => handleDeleteGroup(ids)}
                        >
                          Löschen
                        </AlertDialogAction>
                      </div>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Individual cards in group */}
              <div className="flex flex-col gap-1">
                {group.map((card) => (
                  <div key={card.id} className="flex justify-between text-sm">
                    <span className="cinzel-decorative-regular">
                      CAFÈ-KARTE
                    </span>
                    <span className="font-bold">
                      {centsToEuro(card.price)}€
                    </span>
                  </div>
                ))}
              </div>

              {/* Total if more than 1 card */}
              {group.length > 1 && (
                <div className="mt-2 flex justify-between border-t border-zinc-600 pt-2 text-sm font-bold">
                  <span>Gesamt</span>
                  <span>{centsToEuro(total)}€</span>
                </div>
              )}
            </div>
          )
        })}

        {groups.length === 0 && (
          <Label className="text-muted-foreground text-sm">
            Keine Karten in {selectedYear}
          </Label>
        )}
      </div>
    </>
  )
}

export default CardHistory
