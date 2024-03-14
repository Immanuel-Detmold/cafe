import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'

import { Button } from '@/components/ui/button'

type GroupedProducts = Record<string, Product[]>

const NewOrder = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useProductsQuery({ searchTerm: '', ascending: true })
  if (error) {
    console.log(error)
  }

  const groupedProducts = products?.reduce((grouped, product) => {
    const key: string = product.Category
    grouped[key] = grouped[key] ?? []
    grouped[key].push(product)
    return grouped
  }, {} as GroupedProducts)

  return (
    <>
      {groupedProducts &&
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category}>
            <h2 className="font-bold">{category}</h2>
            {/* Iterate over each product in the current category */}
            {products.map((product) => (
              <div key={product.id}>
                <h3>
                  {product.Name} ({product.Price}€)
                </h3>
              </div>
            ))}
          </div>
        ))}
    </>
  )
}

export default NewOrder
