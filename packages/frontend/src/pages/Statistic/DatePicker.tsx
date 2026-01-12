import { formatDate } from '@/generalHelperFunctions/dateHelperFunctions'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type DatePickerProps = {
  distinctDates: string[]
  selectedDate: string
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>
}

export default function DatePicker({
  distinctDates,
  selectedDate,
  setSelectedDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedDate
            ? formatDate(
                distinctDates.find((order) => order === selectedDate) || '',
              )
            : 'Wähle Datum...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Wähle ein Datum</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput autoFocus={false} placeholder="Suche nach Datum..." />
          <CommandEmpty>Kein Datum gefunden.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {distinctDates.map((order) => (
              <CommandItem
                key={order}
                value={order}
                onSelect={(currentValue: string) => {
                  setSelectedDate(
                    currentValue === selectedDate ? '' : currentValue,
                  )
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedDate === order ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {formatDate(order)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
