import { Inventory } from '@/data/useInventory'
import { Product } from '@/data/useProducts'

export type pConsumption = {
  name: string
  quantity: string
  unit: string
}

// Returns the remaining inventory items for a product: list of name, quantity, unit
export const getInventoryCount = (product: Product, Inventory: Inventory[]) => {
  const remainingInventoryItems: pConsumption[] = []

  const productConsumption = product.consumption
  if (productConsumption !== null && productConsumption !== undefined) {
    productConsumption.forEach((singleConsumption) => {
      if (
        typeof singleConsumption === 'object' &&
        singleConsumption !== null &&
        'name' in singleConsumption
      ) {
        const inventoryItem = Inventory.find(
          (inventoryItem) => inventoryItem.name === singleConsumption?.name,
        )

        if (inventoryItem) {
          remainingInventoryItems.push({
            name: inventoryItem.name,
            quantity: inventoryItem.quantity.toString(),
            unit: inventoryItem.unit,
          })
        }
      }
    })
  }
  return remainingInventoryItems
}
