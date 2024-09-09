import { Category } from '@/data/useProductCategories'
import { Product } from '@/data/useProducts'

import { GroupedProducts } from '../NewOrder'

export function groupProductsToCategories(
  dataCategories: Category[],
  products: Product[],
): GroupedProducts {
  const groupedProducts = dataCategories.reduce(
    (group: GroupedProducts, category) => {
      group[category.category] = []
      return group
    },
    {},
  )

  groupedProducts['Sonstige'] = []
  // push each product to its category
  products.forEach((product: Product) => {
    const category = product.category.replace(/^1-/, '')
    if (groupedProducts[category]) {
      groupedProducts[category].push(product)
    } else {
      if (groupedProducts !== undefined && groupedProducts['Sonstige']) {
        groupedProducts['Sonstige'].push(product) // If the category doesn't exist, assign to "Sonstige"
      }
    }
  })

  // Remove empty categories (those with empty arrays)
  Object.keys(groupedProducts).forEach((category) => {
    if (groupedProducts[category]?.length === 0) {
      delete groupedProducts[category] // Remove empty categories
    }
  })

  return groupedProducts // Return the filtered grouped products
}
