// Geräte-übergreifende Einstellung "zuletzt gewählte Umsatzgruppe"
// Wird im localStorage gespeichert, damit die Auswahl zwischen
// Statistik- und Bestellseite konsistent bleibt.

const STORAGE_KEY = 'cafe-selected-revenue-stream'

export type StoredRevenueStream = number | 'all' | null

export const getStoredRevenueStream = (): StoredRevenueStream => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    if (raw === 'all') return 'all'
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? null : parsed
  } catch {
    return null
  }
}

export const setStoredRevenueStream = (value: number | 'all'): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    /* ignore */
  }
}
