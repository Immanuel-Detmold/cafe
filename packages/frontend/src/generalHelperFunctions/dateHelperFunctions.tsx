import { MONTHS } from '@/data/data'

// 2024-04-20T07:06:50.841478+00:00 -> 07:06
export const formatDateToTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  // Format the time to hh:mm format
  const time = date.toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return time.toString()
}

// 2024-04-20T07:06:50.841478+00:00 -> 20.04.2024 07:06
export const formatDateToDateAndTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  // Format the time to hh:mm format
  const time = date.toLocaleTimeString('de', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return time.toString()
}

// 2024-08-06 -> 06.08.2024
export const formatDateToLocalDate = (timestamp: string): string => {
  const date = new Date(timestamp)

  const day = date.toLocaleString('en', { day: '2-digit' })
  const month = date.toLocaleString('en', { month: '2-digit' })
  const year = date.getFullYear()

  const formattedDate = `${day}.${month}.${year}`
  return formattedDate
}

// Convert 2024-08-01T22:00:00.000Z to 2024-08-01
// Convert Date object to YYYY-MM-DD for SUPABASE
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Return current date and time in the format 20.04.2024 - 07:06
export function currentDateAndTime() {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} - ${hours}:${minutes}`
}

export const getStartOfDayToday = () => {
  const date = new Date()
  const hoursInToday = date.getHours()

  const temp = new Date(Number(date) - hoursInToday * 60 * 60 * 1000)

  temp.setMinutes(0)
  temp.setSeconds(0)

  const finalDateString = temp.toISOString().split('.')[0]

  return { finalDate: temp, finalDateString, finalDateObject: temp }
}

export const getEndOfDayToday = () => {
  const startOfDay = new Date(getStartOfDayToday().finalDate)

  const endOfDay = new Date(Number(startOfDay) + 24 * 60 * 60 * 1000)
  const endOfDayString = endOfDay.toISOString().split('.')[0]

  return { endOfDay, endOfDayString }
}

// Returns Date and Time of current month
export const getCurrentMonthStartDate = () => {
  const date = new Date()
  date.setDate(1)
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  const timeZoneOffset = date.getTimezoneOffset() / 60
  date.setHours(date.getHours() + timeZoneOffset)

  const month_index = date.getMonth() + 1

  //   German months
  const months = MONTHS
  const monthName = months[month_index] || 'Januar'
  return { monthDataFormat: date.toISOString().split('.')[0], monthName }
}

export const getThisYear = () => {
  const currentDate =
    getStartOfDayToday().finalDateString ?? '2000-01-01T00:00:00'
  //   temp fromat = 2000-09-01
  const temp = currentDate.split('T')[0] || '2000-01-01'

  const currentYear =
    temp.split('-')[0] +
    '-' +
    '01' +
    '-' +
    '01' +
    ' ' +
    currentDate.split('T')[1]
  return { yearDataFormat: currentYear, year: temp.split('-')[0] ?? '2000' }
}

export const getStartOfYear = (date: Date) => {
  const startOfYear = new Date(date)
  startOfYear.setMonth(0)
  startOfYear.setDate(1)
  startOfYear.setHours(0)
  startOfYear.setMinutes(0)
  startOfYear.setSeconds(0)
  startOfYear.setMilliseconds(0)
  return startOfYear
}

// Returns the end of the year from input Date
export const getEndOfYear = (date: Date) => {
  const endOfYear = new Date(date)
  endOfYear.setMonth(11)
  endOfYear.setDate(31)
  endOfYear.setHours(23)
  endOfYear.setMinutes(59)
  endOfYear.setSeconds(59)
  endOfYear.setMilliseconds(999)
  return endOfYear
}

// Format 2024-04-17T05:58:16.36199+00:00 -> 17.04.2024
export const formatDate = (date: string) => {
  const dateObject = new Date(date)

  const formattedDate = dateObject.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formattedDate
}

// Input: yyyy-mm-dd output supabase format 2024-04-16 12:38:56.333594+00. Calcualte the start of day
export const getStartOfDay = (inputDate: string) => {
  const dateUTC = new Date(inputDate)
  const finalDate = new Date(
    dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60 * 1000,
  )
  const finalDateString = finalDate.toISOString().split('.')[0]
  return { finalDate, finalDateString }
}

export const getEndOfDay = (inputDate: string) => {
  const startOfDay = new Date(getStartOfDay(inputDate).finalDate)
  const endOfDay = new Date(Number(startOfDay) + 24 * 60 * 60 * 1000)
  const endOfDayString = endOfDay.toISOString().split('.')[0]

  return { endOfDay, endOfDayString }
}

// Returns the day of Today in the format 17.04.2024
export const todayDate = () => {
  let date = new Date()
  const timeZoneOffset = date.getTimezoneOffset() / 60
  const subtractHours = date.getHours() + timeZoneOffset
  date = new Date(date.getTime() - subtractHours * 60 * 60 * 1000)

  const dateStr = date.toISOString().split('T')[0]?.split('-') ?? []
  const finalDate = `${dateStr[2]}.${dateStr[1]}.${dateStr[0]}`
  return finalDate
}

// returns true, if input date is same date as today
export const checkSameDay = (inputDate: string) => {
  const inputDateLocal = new Date(inputDate).toLocaleDateString()
  const LocalDate = new Date().toLocaleDateString()

  if (inputDateLocal === LocalDate) {
    return true
  } else {
    return false
  }
}

// 2024-12-31T22:59:59.100Z -> 2024-12-31 22:59:59.022Z
export const convertToSupabaseDate = (date: Date): string => {
  return (
    date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1]
  )
}
