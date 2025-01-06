import { Inventory } from '@/data/useInventory'

export const formatFileSize = (size: number) => {
  if (size > 1048576) {
    return Math.round(size / 1048576) + 'mb'
  } else if (size > 1024) {
    return Math.round(size / 1024) + 'kb'
  } else {
    return size + 'b'
  }
}

// Get inventory id by name
export const getInventoryId = (inventory: Inventory[], name: string) => {
  return inventory.find((i) => i.name === name)?.id
}
