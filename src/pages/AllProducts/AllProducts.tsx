import { useProductsQuery } from '@/data/useProducts'
import { useState } from 'react'

import ProductCard from '@/components/ProductCard'
import { Input } from '@/components/ui/input'

import CreateProduct from './CreateProduct'

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ascending, setAscending] = useState(true)
  const { data: products, error } = useProductsQuery({ searchTerm, ascending })
  console.log(products)
  return (
    <>
      {error && <div>{JSON.stringify(error)}</div>}
      <div className="header flex h-16 items-center p-2">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        <CreateProduct />

        <i
          className="material-icons sorting select-none hover:cursor-pointer"
          onClick={() => {
            setAscending(!ascending)
          }}
        >
          swap_vert
        </i>
        {/* <i className="material-icons">delete</i> */}
        {/* <i className="material-icons">edit</i> */}
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
