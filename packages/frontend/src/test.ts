export const getCurrentMonthStartDate = () => {
  const date = new Date()
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  const month_index = date.getMonth()
  console.log(month_index)
}

getCurrentMonthStartDate()
