import {
  getEndOfYear,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
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

type selectedDateProp = {
  startDate: Date
  endDate: Date
}

type PickYearProps = {
  distinctYears: string[]
  selectedYear: selectedDateProp
  setSelectedYear: React.Dispatch<React.SetStateAction<selectedDateProp>>
}

export default function PickYear({
  distinctYears,
  selectedYear,
  setSelectedYear,
}: PickYearProps) {
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
          {selectedYear
            ? distinctYears.find(
                (year) =>
                  year === selectedYear.startDate.getFullYear().toString(),
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
            {distinctYears.map((singleDate) => (
              <CommandItem
                key={singleDate}
                value={singleDate}
                onSelect={(currentValue) => {
                  setSelectedYear({
                    startDate: getStartOfYear(new Date(currentValue)),
                    endDate: getEndOfYear(new Date(currentValue)),
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedYear.startDate.getFullYear().toString() ===
                      singleDate
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {singleDate}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
