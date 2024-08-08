import {
  useCreateExpenseMutation,
  useExpenseQuery,
  useUpdateExpenseMutation,
} from '@/data/useExpense'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions/currencyHelperFunction'
import { formatDateToISO } from '@/generalHelperFunctions/dateHelperFunctions'
import { onPriceChange } from '@/generalHelperFunctions/inputHelper'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { DatePickerWithPresets } from './DatePickerExpense'
import DeleteExpense from './DeleteExpense'

const NewExpense = () => {
  const [price, setPrice] = useState<string>('')
  const [comment, setComment] = useState('')
  const [purchaseDate, setPurchaseDate] = useState<Date>()

  // Hooks
  const navigate = useNavigate()
  const { toast } = useToast()
  const { expenseId } = useParams()

  // Data & Mutation
  const saveExpenseMutation = useCreateExpenseMutation()
  const { mutate: editExpense } = useUpdateExpenseMutation(
    expenseId ? parseInt(expenseId) : 0,
  )
  const expenseData = useExpenseQuery({ id: expenseId ? expenseId : '' })

  // Functions
  const handleSaveExpense = () => {
    if (!price || !purchaseDate) {
      toast({
        title: 'Bitte alle Felder ausfüllen.',
      })
      return
    }
    const expense = {
      price: EuroToCents(price),
      comment,
      purchase_date: formatDateToISO(purchaseDate),
    }

    // Edit Expense
    if (expenseId) {
      editExpense(expense, {
        onSuccess: () => {
          toast({
            title: 'Ausgabe erfolgreich aktualisiert ✔',
            duration: 2000,
          })
          navigate('/admin/expense')
        },
        onError: () => {
          toast({
            title: `Fehler beim Aktualisieren der Ausgabe ❌`,
            duration: 2000,
          })
        },
      })
    } else {
      // Create New Expense
      saveExpenseMutation.mutate(expense, {
        onSuccess: () => {
          toast({ title: 'Ausgabe erfolgreich hinzugefügt ✔' })
          navigate('/admin/expense')
        },
        onError: (error) => {
          console.log(error)
          toast({ title: `Fehler beim Speichern der Ausgabe ❌` })
        },
      })
    }
  }

  // Use Effect, if edit mode, Load expense data
  useEffect(() => {
    if (expenseId) {
      const data = expenseData.data
      if (data) {
        setPrice(centsToEuro(data.price))
        setComment(data.comment?.toString() || '')
        setPurchaseDate(new Date(data.purchase_date))
      }
    }
  }, [expenseId, expenseData.data])

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="mt-2 flex flex-col">
          {/* Purchase price */}
          <Label htmlFor="price" className="font-bold">
            Preis
          </Label>
          <Input
            id="price"
            value={price}
            type="text"
            onChange={(e) => setPrice(onPriceChange(e.target.value))}
            className="mt-1"
            placeholder="Preis der Ausgabe"
          />

          {/* Comment */}
          <Label htmlFor="comment" className="mt-4 font-bold">
            Kommentar
          </Label>
          <Input
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1"
            placeholder="Kommentar"
          />

          {/* Purchase Date */}
          <Label htmlFor="purchase_date" className="mt-4 font-bold">
            Kaufdatum
          </Label>
          <DatePickerWithPresets
            purchaseDate={purchaseDate}
            setPurchaseDate={setPurchaseDate}
          />
          {/* <Input
            id="purchase_date"
            type="date"
            value={purchaseDate ? purchaseDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setPurchaseDate(new Date(e.target.value))}
            className="mt-1"
          /> */}
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex justify-start">
            <Button
              className="mr-auto"
              onClick={() => {
                navigate('/admin/expense')
              }}
            >
              <ChevronLeftIcon className="cursor-pointer" />
            </Button>
          </div>

          <div className="flex justify-end">
            {expenseId && <DeleteExpense expenseId={expenseId} />}
            <Button onClick={handleSaveExpense} className="ml-2">
              <SaveIcon className="mr-1 cursor-pointer" />
              Speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewExpense
