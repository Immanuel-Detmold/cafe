import { useProductsQuery } from '@/data/useProducts'
import { ArrowDownUpIcon } from 'lucide-react'
import { useState } from 'react'

import ProductCard from '@/components/ProductCard'
import { Input } from '@/components/ui/input'

import CreateProduct from './CreateProduct'

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ascending, setAscending] = useState(true)
  const { data: products, error } = useProductsQuery({ searchTerm, ascending })
  return (
    <>
      {error && <div>{JSON.stringify(error)}</div>}

      <div className="header sticky top-0 z-50 flex items-center bg-background pb-1 pt-2">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        <CreateProduct />

        <ArrowDownUpIcon
          className="select-none hover:cursor-pointer"
          onClick={() => {
            setAscending(!ascending)
          }}
        />
      </div>
      {products && (
        <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <div key={product.id} className="max-w-60">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AllProducts
