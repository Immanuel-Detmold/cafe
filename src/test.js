function getFirstDayOfCurrentMonthISOString() {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()

  // Erstellt ein Datum für den ersten Tag des aktuellen Monats im UTC-Format
  const firstDayOfMonth = new Date(Date.UTC(year, month, 1))
  return firstDayOfMonth.toISOString()
}

// Beispielaufruf
const isoString = getFirstDayOfCurrentMonthISOString()
console.log(isoString) // Gibt das ISO-String-Format des ersten Tages des aktuellen Monats in UTC zurück
