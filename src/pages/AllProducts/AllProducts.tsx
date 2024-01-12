import useFetchProducts from '@/customFetch/useFetchProducts'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Product from '@/components/Product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CreateProduct from './CreateProduct'

const AllProducts = () => {
  const navigate = useNavigate()
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
      <div className="header p-2 flex h-16 items-center">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={handleInputChange}
        />
        <CreateProduct />

        <i className="material-icons sorting hover:cursor-pointer select-none" onClick={handleOrder}>swap_vert</i>
        {/* <i className="material-icons">delete</i> */}
        {/* <i className="material-icons">edit</i> */}

        
        
      </div>
      {products && (
        <div className="grid gap-3 sm:gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-2">
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
