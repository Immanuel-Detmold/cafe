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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-wull justify-between"
        >
          {selectedDate
            ? formatDate(
                distinctDates.find((order) => order === selectedDate) || '',
              )
            : 'Wähle Datum...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput tabIndex={-1} placeholder="Suche nach Datum..." />
          <CommandEmpty>Kein Datum gefunden.</CommandEmpty>
          <CommandGroup>
            {distinctDates.map((order) => (
              <CommandItem
                key={order}
                value={order}
                onSelect={(currentValue) => {
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
      </PopoverContent>
    </Popover>
  )
}
