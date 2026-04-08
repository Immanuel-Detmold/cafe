const STORAGE_KEY = 'menuOrderTracking'

export type TrackedOrder = {
  orderId: number
  orderNumber: string
  createdAt: string // ISO string
}

type StorageData = {
  orders: TrackedOrder[]
}

/** Get today's date string in Berlin timezone (YYYY-MM-DD) */
const getTodayBerlin = (): string => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })
}

/** Check if an ISO date string is from today (Berlin timezone) */
const isToday = (isoString: string): boolean => {
  const orderDate = new Date(isoString).toLocaleDateString('en-CA', {
    timeZone: 'Europe/Berlin',
  })
  return orderDate === getTodayBerlin()
}

const readStore = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { orders: [] }
    return JSON.parse(raw) as StorageData
  } catch {
    return { orders: [] }
  }
}

const writeStore = (data: StorageData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** Remove orders that are not from today (Berlin timezone) */
export const pruneExpiredOrders = (): void => {
  const store = readStore()
  const pruned = store.orders.filter((o) => isToday(o.createdAt))
  writeStore({ orders: pruned })
}

/** Add a tracked order to localStorage */
export const addTrackedOrder = (order: TrackedOrder): void => {
  pruneExpiredOrders()
  const store = readStore()
  // Avoid duplicates
  if (store.orders.some((o) => o.orderId === order.orderId)) return
  store.orders.push(order)
  writeStore(store)
}

/** Get all tracked orders (auto-prunes expired) */
export const getTrackedOrders = (): TrackedOrder[] => {
  pruneExpiredOrders()
  return readStore().orders
}

/** Remove a specific tracked order */
export const removeTrackedOrder = (orderId: number): void => {
  const store = readStore()
  store.orders = store.orders.filter((o) => o.orderId !== orderId)
  writeStore(store)
}

/** Check if there are any active tracked orders */
export const hasTrackedOrders = (): boolean => {
  return getTrackedOrders().length > 0
}
