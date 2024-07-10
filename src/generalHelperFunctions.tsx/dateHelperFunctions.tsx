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
  const months = [
    '',
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ]
  const monthName = months[month_index] || 'Januar'
  // console.log("Current Month", currentMonth)
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
