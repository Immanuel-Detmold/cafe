import { useProductsQuery } from '@/data/useProducts'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { GroupedProducts } from '../NewOrder/NewOrder'
import AllProductsFilter from './AllProductsFilter'

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { data: products, error } = useProductsQuery({
    searchTerm: searchTerm,
    categories: selectedCategories,
  })
  const navigate = useNavigate()
  // Grouped Products by Category (for search term and filter)
  const groupedProducts_filtered = products?.reduce((groupMap, product) => {
    const key = product.category || 'Other'
    const group = groupMap[key] ?? []
    return {
      ...groupMap,
      [key]: [...group, product],
    }
  }, {} as GroupedProducts)

  // If Filter Checkbox is checked or unchecked
  const handleCheckboxChange = (
    type: string,
    checked: string | boolean,
    value: string,
  ) => {
    //If Checkbox is checked add to selectedCategories List or remove it
    if (type === 'category') {
      if (checked) {
        setSelectedCategories(() => {
          const updated = [...selectedCategories, value]
          localStorage.setItem(
            'selectedCategoriesAllProducts',
            JSON.stringify(updated),
          )
          return updated
        })
      } else {
        setSelectedCategories(() => {
          const updated = selectedCategories.filter((item) => item !== value)
          localStorage.setItem(
            'selectedCategoriesAllProducts',
            JSON.stringify(updated),
          )
          return updated
        })
      }
    }
  }

  // Use Effects

  useEffect(() => {
    // Load Cache Items
    const selectedCategories = localStorage.getItem(
      'selectedCategoriesAllProducts',
    )
    if (selectedCategories) {
      setSelectedCategories(JSON.parse(selectedCategories) as string[])
    }
  }, [])

  return (
    <>
      {error && <div>{JSON.stringify(error)}</div>}

      <div className="header bg-background sticky top-0 z-50 flex items-center pb-1 pt-2">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        {/* <CreateProduct /> */}
        <Button
          variant="default"
          className="mx-2"
          onClick={() => {
            navigate('/admin/create-product')
          }}
        >
          + Neus Produkt
        </Button>

        <AllProductsFilter
          handleCheckboxChange={handleCheckboxChange}
          selectedCategories={selectedCategories}
        />
      </div>
      {groupedProducts_filtered && (
        <div className="mt-2">
          {Object.entries(groupedProducts_filtered).map(
            ([category, products]) => (
              <div key={category} className="mb-4">
                {/* Category Title */}
                <h2 className="mb-2 text-xl font-bold">{category}</h2>

                {/* Products Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="max-w-60 cursor-pointer"
                      onClick={() => {
                        navigate('/admin/all-products/' + product.id)
                      }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </>
  )
}

export default AllProducts
