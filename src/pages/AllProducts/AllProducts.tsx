import useFetchProducts from '@/customFetch/useFetchProducts'
import { useState } from 'react'

import Product from '@/components/Product'
import { Input } from '@/components/ui/input'

import CreateProduct from './CreateProduct'

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ascending, setAscending] = useState(true)
  const { products, error } = useFetchProducts(searchTerm, ascending)
  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value)
  }

  const handleOrder = () => {
    // Your click event logic goes here
    setAscending(!ascending)
  }

  return (
    <>
      {error && <div>{error}</div>}
      <div className="header flex h-16 items-center p-2">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={handleInputChange}
        />
        <CreateProduct />

        <i
          className="material-icons sorting select-none hover:cursor-pointer"
          onClick={handleOrder}
        >
          swap_vert
        </i>
        {/* <i className="material-icons">delete</i> */}
        {/* <i className="material-icons">edit</i> */}
      </div>
      {products && (
        <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <div key={product.Id} className="max-w-60">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AllProducts
