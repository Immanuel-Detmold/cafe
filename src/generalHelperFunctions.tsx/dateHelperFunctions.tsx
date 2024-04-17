export const getTodaysDate = () => {
  let currentDate = new Date()
  const timeZoneOffset = currentDate.getTimezoneOffset() / 60

  const subtractHours = currentDate.getHours() + timeZoneOffset
  currentDate = new Date(currentDate.getTime() - subtractHours * 60 * 60 * 1000)
  const date = currentDate.toISOString().split('T')[0]
  const time =
    currentDate.toISOString().split('T')[1]?.split('.')[0] ?? '00:00:00'
  const supabase_date_format = `${date} ${time}.0000+00`
  // new Date().toISOString().split('T')[0] + ' 00:00:00'
  return supabase_date_format
}

export const getCurrentMonth = () => {
  const currentDate = getTodaysDate()
  //   temp = 2021-09-01
  const temp = currentDate.split(' ')[0] || '2000-01-01'
  const currentMonth =
    temp.split('-')[0] +
    '-' +
    temp.split('-')[1] +
    '-' +
    '01' +
    ' ' +
    currentDate.split(' ')[1]

  const month_index = parseInt(temp.split('-')[1] ?? '') || 1

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

  return { monthDataFormat: currentMonth, monthName }
}

export const getThisYear = () => {
  const currentDate = getTodaysDate()
  //   temp fromat = 2000-09-01
  const temp = currentDate.split(' ')[0] || '2000-01-01'

  const currentYear =
    temp.split('-')[0] +
    '-' +
    '01' +
    '-' +
    '01' +
    ' ' +
    currentDate.split(' ')[1]
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
