// export const getStartOfDayToday = () => {
//   const date = new Date() //UTC Time
//   const hoursInToday = date.getHours() // Hours into the date (local time)

//   const temp = new Date(Number(date) - hoursInToday * 60 * 60 * 1000)
//   temp.setMinutes(0)
//   temp.setSeconds(0)

//   const finalDateString = temp.toISOString().split('.')[0]
//   return { finalDateString, finalDate: temp }
// }

// export const getEndOfDayToday = () => {
//   const startOfDay = new Date(getStartOfDayToday().finalDate)

//   const endOfDay = new Date(Number(startOfDay) + 24 * 60 * 60 * 1000)
//   const endOfDayString = endOfDay.toISOString().split('.')[0]

//   return { endOfDay, endOfDayString }
// }

// export const getTodaysDate = () => {
//   let currentDate = new Date()
//   const timeZoneOffset = currentDate.getTimezoneOffset() / 60

//   const subtractHours = currentDate.getHours() + timeZoneOffset
//   currentDate = new Date(currentDate.getTime() - subtractHours * 60 * 60 * 1000)
//   const date = currentDate.toISOString().split('T')[0]
//   const time =
//     currentDate.toISOString().split('T')[1]?.split('.')[0] ?? '00:00:00'

//   const supabase_date_format = `${date} ${time}.0000+00`
//   // new Date().toISOString().split('T')[0] + ' 00:00:00'
//   return supabase_date_format
// }

// export const getStartOfDay = (inputDate) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//   const dateUTC = new Date(inputDate)
//   const finalDate = new Date(
//     dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60 * 1000,
//   )
//   const finalDateString = finalDate.toISOString().split('.')[0]
//   return { finalDate, finalDateString }
// }

// export const getEndOfDay = (inputDate) => {
//   const startOfDay = new Date(getStartOfDay(inputDate).finalDate)
//   const endOfDay = new Date(Number(startOfDay) + 24 * 60 * 60 * 1000)
//   const endOfDayString = endOfDay.toISOString().split('.')[0]

//   // console.log(endOfDay, endOfDayString)
//   return { endOfDay, endOfDayString }
// }

// getEndOfDay('2024-04-02')

// // Method to getStartOfDay depending on Input Date in format 2024-04-18
// // 2024-04-02 01:00:00 -> 2024-04-01 19:00:00
// // Get Current Date form Local Time Zone.
// // Calculate Time Offset to UTC and grab Only the Date to check if date has changed
// // Get Hours into the date and subtract theese ours into the date from UTC Time
// // Add together subtracted Time Offset + subtracted hours in from UCT

// // Just UTC Time 14:00:00 - timeOffset

// // 2024-04-18T13:35:58.314322+00:00 -> output 2024-04-18 15:35:58

// // const test = new Date()
// //   .toLocaleDateString('de-CA', { hour12: false })
// //   .replace(', ', 'T')
// // console.log(test)

console.log(24.77 + 8)
