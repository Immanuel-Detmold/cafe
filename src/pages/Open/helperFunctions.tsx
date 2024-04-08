export const formatDateToTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  // Format the time to hh:mm format
  const time = date.toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return time.toString()
}
