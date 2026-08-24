const STORAGE_KEY = 'currentTableNumber'

type StorageData = {
  value: string
  setAt: string // ISO string
}

/** Get today's date string in Berlin timezone (YYYY-MM-DD) */
const getTodayBerlin = (): string => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })
}

/** Check if an ISO date string is from today (Berlin timezone) */
const isToday = (isoString: string): boolean => {
  const date = new Date(isoString).toLocaleDateString('en-CA', {
    timeZone: 'Europe/Berlin',
  })
  return date === getTodayBerlin()
}

const readStore = (): StorageData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StorageData
  } catch {
    return null
  }
}

/** Get the currently remembered table number, or null if unset/from a previous day */
export const getTableNumber = (): string | null => {
  const store = readStore()
  if (!store || !isToday(store.setAt)) return null
  return store.value
}

/** Remember a table number for the rest of today */
export const setTableNumber = (value: string): void => {
  const data: StorageData = { value, setAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** Forget the remembered table number */
export const clearTableNumber = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
