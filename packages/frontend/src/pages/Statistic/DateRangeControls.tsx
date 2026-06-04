import {
  getEndOfDayFromDate,
  getEndOfMonth,
  getEndOfWeek,
  getEndOfYear,
  getStartOfDayFromDate,
  getStartOfMonth,
  getStartOfWeek,
  getStartOfYear,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { cn } from '@/lib/utils'
import {
  CalendarCheck,
  CalendarDays,
  Calendar as CalendarIcon,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Sun,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export type Granularity = 'day' | 'week' | 'month' | 'year' | 'custom'

export type DateRange = {
  from: Date
  to: Date
}

// Build a date range for a given granularity based on a reference date
export const buildRange = (
  granularity: Exclude<Granularity, 'custom'>,
  reference: Date,
): DateRange => {
  switch (granularity) {
    case 'day':
      return {
        from: getStartOfDayFromDate(reference),
        to: getEndOfDayFromDate(reference),
      }
    case 'week':
      return { from: getStartOfWeek(reference), to: getEndOfWeek(reference) }
    case 'month':
      return { from: getStartOfMonth(reference), to: getEndOfMonth(reference) }
    case 'year':
      return { from: getStartOfYear(reference), to: getEndOfYear(reference) }
  }
}

const PRESETS: { value: Exclude<Granularity, 'custom'>; label: string }[] = [
  { value: 'day', label: 'Tag' },
  { value: 'week', label: 'Woche' },
  { value: 'month', label: 'Monat' },
  { value: 'year', label: 'Jahr' },
]

const formatGerman = (date: Date) =>
  date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

// Shift a reference date by one period in the given direction
const shiftReference = (
  granularity: Exclude<Granularity, 'custom'>,
  reference: Date,
  direction: 1 | -1,
): Date => {
  const next = new Date(reference)
  switch (granularity) {
    case 'day':
      next.setDate(next.getDate() + direction)
      break
    case 'week':
      next.setDate(next.getDate() + 7 * direction)
      break
    case 'month':
      next.setMonth(next.getMonth() + direction)
      break
    case 'year':
      next.setFullYear(next.getFullYear() + direction)
      break
  }
  return next
}

interface DateRangeControlsProps {
  granularity: Granularity
  range: DateRange
  onChange: (range: DateRange, granularity: Granularity) => void
  disabled?: boolean
}

const DateRangeControls = ({
  granularity,
  range,
  onChange,
  disabled = false,
}: DateRangeControlsProps) => {
  const applyPreset = (value: Exclude<Granularity, 'custom'>) => {
    onChange(buildRange(value, range.from), value)
  }

  const navigate = (direction: 1 | -1) => {
    if (granularity === 'custom') return
    const reference = shiftReference(granularity, range.from, direction)
    onChange(buildRange(granularity, reference), granularity)
  }

  const setFrom = (date: Date | undefined) => {
    if (!date) return
    const from = getStartOfDayFromDate(date)
    const to = from > range.to ? getEndOfDayFromDate(date) : range.to
    onChange({ from, to }, 'custom')
  }

  const setTo = (date: Date | undefined) => {
    if (!date) return
    const to = getEndOfDayFromDate(date)
    const from = to < range.from ? getStartOfDayFromDate(date) : range.from
    onChange({ from, to }, 'custom')
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Preset toggle + navigation */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border p-0.5">
          {PRESETS.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant={granularity === preset.value ? 'default' : 'ghost'}
              size="sm"
              disabled={disabled}
              onClick={() => applyPreset(preset.value)}
              className="h-8"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {granularity !== 'custom' && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={disabled}
              onClick={() => navigate(-1)}
              aria-label="Vorheriger Zeitraum"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={disabled}
              onClick={() => navigate(1)}
              aria-label="Nächster Zeitraum"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2"
              disabled={disabled}
              onClick={() =>
                onChange(buildRange(granularity, new Date()), granularity)
              }
              aria-label="Heute"
            >
              <CalendarCheck className="mr-1 h-4 w-4" />
              Heute
            </Button>
          </div>
        )}

        {/* Quick-range shortcuts */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={disabled}
            onClick={() => {
              const today = new Date()
              const from = getStartOfDayFromDate(
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 6,
                ),
              )
              onChange({ from, to: getEndOfDayFromDate(today) }, 'custom')
            }}
          >
            <CalendarDays className="mr-1 h-4 w-4" />
            Letzte 7 Tage
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={disabled}
            onClick={() => {
              const today = new Date()
              const firstOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1,
              )
              onChange(
                {
                  from: getStartOfDayFromDate(firstOfLastMonth),
                  to: getEndOfDayFromDate(
                    new Date(today.getFullYear(), today.getMonth(), 0),
                  ),
                },
                'custom',
              )
            }}
          >
            <CalendarRange className="mr-1 h-4 w-4" />
            Letzter Monat
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={disabled}
            onClick={() => {
              const today = new Date()
              const daysBack = today.getDay() === 0 ? 0 : today.getDay()
              const lastSunday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - daysBack,
              )
              onChange(
                {
                  from: getStartOfDayFromDate(lastSunday),
                  to: getEndOfDayFromDate(lastSunday),
                },
                'custom',
              )
            }}
          >
            <Sun className="mr-1 h-4 w-4" />
            Letzter Sonntag
          </Button>
        </div>
      </div>

      {/* From / To date pickers */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col space-y-1.5">
          <Label className="font-black">Von</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn('w-[150px] justify-start text-left font-normal')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatGerman(range.from)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={range.from}
                onSelect={setFrom}
                defaultMonth={range.from}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label className="font-black">Bis</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn('w-[150px] justify-start text-left font-normal')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatGerman(range.to)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={range.to}
                onSelect={setTo}
                defaultMonth={range.to}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default DateRangeControls
