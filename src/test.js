// let currentDate = new Date()
// console.log(currentDate)
// const timeZoneOffset = currentDate.getTimezoneOffset() / 60

// currentDate = new Date(currentDate.getTime() - timeZoneOffset * 60 * 60 * 1000)

// // currentDate = currentDate.toISOString().split('.')[0] + '.0000+00'
// // console.log(currentDate)

let currentDate = new Date()
const timeZoneOffset = currentDate.getTimezoneOffset() / 60

const subtractHours = currentDate.getHours() + timeZoneOffset
currentDate = new Date(currentDate.getTime() - subtractHours * 60 * 60 * 1000)
const date = currentDate.toISOString().split('T')[0]
const time = currentDate.toISOString().split('T')[1].split('.')[0]
const supabase_date = `${date} ${time}.0000+00`
console.log(supabase_date)
