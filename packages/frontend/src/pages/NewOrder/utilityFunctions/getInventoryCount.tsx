import { Inventory } from '@/data/useInventory'
import { OrdersAndItemsV2 } from '@/data/useOrders'
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

// Returns count of product that is currently in openOrders "waiting", "processing" or "ready"
export const getOpenOrdersCount = (
  product_id: number,
  openOrders: OrdersAndItemsV2,
) => {
  let count = 0
  openOrders.forEach((order) => {
    if (
      order.status === 'waiting' ||
      order.status === 'processing' ||
      order.status === 'ready'
    ) {
      order.OrderItems.forEach((item) => {
        if (item.product_id === product_id) {
          count += item.quantity
        }
      })
    }
  })
  return count
}
