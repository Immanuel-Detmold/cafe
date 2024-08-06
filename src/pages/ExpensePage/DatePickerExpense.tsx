'use client'

import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define the props interface
interface DatePickerWithPresetsProps {
  purchaseDate: Date | undefined
  setPurchaseDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function DatePickerWithPresets({
  purchaseDate,
  setPurchaseDate,
}: DatePickerWithPresetsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !purchaseDate && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {purchaseDate ? (
            format(purchaseDate, 'PPP')
          ) : (
            <span>Wähle ein Datum aus</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            setPurchaseDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Auswählen" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Heute</SelectItem>
            <SelectItem value="-1">Gestern</SelectItem>
            <SelectItem value="-2">Vorgestern</SelectItem>
            <SelectItem value="-7">Letzte Woche</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={purchaseDate}
            onSelect={setPurchaseDate}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
