import { OrderItems } from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { ConsumptionType } from '@/pages/AllProducts/CreateProduct/CreateProductV2'

export const getAllConsumptions = (
  orderItems: OrderItems[],
  productData: Product[],
) => {
  const consumptions: ConsumptionType[] = []

  orderItems.forEach((item) => {
    const product = productData.find(
      (product) => product.id === item.product_id,
    )
    if (product) {
      // If Product has consumption
      const productConsumption = product.consumption as ConsumptionType[]
      if (productConsumption) {
        // First add quantity to the consumption
        const consumption = productConsumption.map((consumption) => {
          return {
            ...consumption,
            quantity: (
              parseInt(consumption.quantity) * item.quantity
            ).toString(),
          }
        })

        // Add consumption to the list: If consumption in list, thenn make addition to quanitity
        consumption.forEach((consumption) => {
          const index = consumptions.findIndex(
            (c) => c.name === consumption.name,
          )
          if (index !== -1) {
            const c = consumptions[index]
            if (c) {
              c.quantity = (
                parseInt(c.quantity) + parseInt(consumption.quantity)
              ).toString()
            }

            // If Consumption is not in the list then add it
          } else {
            consumptions.push(consumption)
          }
        })
      }
    }
  })

  return consumptions
}
