import { useProductCategories } from '@/data/useProductCategories'
import { useProductsQuery } from '@/data/useProducts'

import { useToast } from '@/components/ui/use-toast'

import { groupProductsToCategories } from '../NewOrder/utilityFunctions/groupProductsToCategories'
import MenuCart from './MenuCart'
import { MenuCartProvider } from './MenuCartContext'
import MenuProductCard from './MenuProductCard'

const MenuCard = () => {
  // Mini Functions
  const { toast } = useToast()

  // Data
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
    only_advertisement_screen: false,
    paused: false,
  })
  const { data: dataCategories } = useProductCategories()

  const isDev = import.meta.env.DEV

  let groupedProducts = undefined
  if (dataCategories && products) {
    const filteredCategories = isDev
      ? dataCategories
      : dataCategories.filter((c) => !c.category.toLowerCase().includes('test'))
    const filteredProducts = isDev
      ? products
      : products.filter((p) => !p.name.toLowerCase().includes('test'))
    groupedProducts = groupProductsToCategories(
      filteredCategories,
      filteredProducts,
    )
  }

  if (error) {
    toast({ title: 'Fehler beim Laden der Produkte! ❌' })
  }

  return (
    <MenuCartProvider>
      <div className="mt-6">
        <h1 className="cinzel-decorative-bold text-center text-4xl">
          Menükarte
        </h1>
      </div>

      <div className="pb-24">
        {Object.entries(groupedProducts ?? {}).map(([category, products]) => (
          <div key={category} className="container mt-2 px-4">
            {/* Category */}
            <h2 className="cinzel-decorative-regular mb-2 mt-6 text-2xl">
              {category}
            </h2>
            {/* Products */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <MenuProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {products && <MenuCart products={products} />}
    </MenuCartProvider>
  )
}

export default MenuCard
