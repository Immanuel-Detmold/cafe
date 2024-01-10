import Product from '@/components/Product'
import useFetchProducts from '@/customFetch/useFetchProducts'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'

import sortSVG from '@/components/ui/icons/sort.svg'


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
      <div className="header p-2 flex h-16 items-center">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={handleInputChange}
        />
        <ArrowPathRoundedSquareIcon className="h-7 w-7 ml-auto ml-4 mr-1 hover:cursor-pointer" onClick={handleOrder}/>
        {/* <sortSVG className="h-7 w-7 ml-auto mr-1 hover:cursor-pointer" onClick={handleOrder}/> */}
        {/* <img
          src="./src/components/ui/icons/sort.svg"
          alt="sort"
          className="h-7 w-7 ml-auto mr-1 hover:cursor-pointer "
          onClick={handleOrder}
        ></img> */}

      </div>
      {products && (
        <div className="grid gap-3 sm:gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-2">
          {/*<div className="grid gap-4 grid-cols-max"> */}
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
