export const getStartOfDay = () => {
  let currentDate = new Date()

  console.log(currentDate)

  const date = currentDate.toISOString().split('T')[0]
  const time =
    currentDate.toISOString().split('T')[1]?.split('.')[0] ?? '00:00:00'
  const supabase_date_format = `${date} ${time}.0000+00`

  console.log(supabase_date_format)
  return supabase_date_format
}

getStartOfDay()
