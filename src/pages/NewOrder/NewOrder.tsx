import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'

type GroupedProducts = Record<string, Product[]>

const NewOrder = () => {
  const { data: products } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })

  const groupedProducts = products?.reduce((groupMap, product) => {
    const key = product.Category || 'Other'
    const group = groupMap[key] ?? []
    return {
      ...groupMap,
      [key]: [...group, product],
    }
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
