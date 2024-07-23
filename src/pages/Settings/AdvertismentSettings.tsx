import {
  useProductsQuery,
  useUpdateProductMutationV2,
} from '@/data/useProducts'
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const AdvertismentSettings = () => {
  // State
  const [clickedId, setClickedId] = useState<number | null>(null)

  // Mutations
  const { mutate: updatedProduct, isPending } = useUpdateProductMutationV2()

  // Data
  const { data: products } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })

  // Hooks
  const navigate = useNavigate()

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="mt-2 flex flex-col">
            <label htmlFor="ip" className="font-bold">
              Werbung aktivieren
            </label>
            {products &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="mt-2 flex items-center"
                  onClick={() => {
                    setClickedId(product.id)
                  }}
                >
                  <Switch
                    id={product.id.toString()}
                    defaultChecked={product.advertisement}
                    onCheckedChange={(checked) => {
                      updatedProduct({
                        updatedProduct: {
                          ...product,
                          advertisement: checked,
                        },
                        product_id: product.id,
                      })
                    }}
                  />
                  <label htmlFor={product.id.toString()} className="ml-2">
                    {product.name}
                  </label>
                  {isPending && clickedId === product.id && (
                    <Loader2Icon className="ml-2 h-6 w-6 animate-spin" />
                  )}
                </div>
              ))}
          </div>
          <div className="mt-4 flex justify-start">
            <Button
              className="mr-auto"
              onClick={() => {
                navigate('/admin/settings/')
              }}
            >
              <ChevronLeftIcon className="cursor-pointer" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdvertismentSettings
