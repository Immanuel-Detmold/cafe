import { useProductsQuery } from '@/data/useProducts'
import { ArrowDownUpIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ascending, setAscending] = useState(true)
  const { data: products, error } = useProductsQuery({ searchTerm, ascending })
  const navigate = useNavigate()
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
      )}
    </>
  )
}

export default AllProducts
