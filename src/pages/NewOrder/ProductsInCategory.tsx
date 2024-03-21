import { Product } from '@/data/useProducts'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

export type OrderItem = {
  product_id: number
  quantity: number
  comment: string
}

const ProductsInCategory = (props: { products: Product[] }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  // const [clickedProductID, setClickedProductID] = useState<number>(0)

  // Add Product to Order
  const handleAddOrder = (product_id: number): void => {
    setOrderItems((prevOrderItems) => {
      const newOrderItem: OrderItem = {
        product_id: product_id,
        quantity: Quantity,
        comment: productcomment,
      }
      return [...prevOrderItems, newOrderItem]
    })

    console.log('Added Item in Order:', orderItems)
    setQuantity(1)
    setProductComment('')
  }
  // Delete Product from Order
  const handleDeleteOrderItem = (product_id: number) => {
    setOrderItems((prevOrderItems) => {
      return prevOrderItems.filter((item) => item.product_id !== product_id)
    })
    console.log('Deleted Item in Order:', orderItems)
  }

  const [Quantity, setQuantity] = useState<number>(1)
  const [productcomment, setProductComment] = useState<string>('')
  const placeHolderImage =
    'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/PlaceHolder.jpg?t=2024-03-14T12%3A07%3A02.697Z'

  return (
    <div className="flex flex-wrap">
      {/* <Button onClick={() => console.log(orderItems)}>Test</Button> */}
      {props.products?.map((product: Product) => (
        <div key={product.id} className="m-1 w-min">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-14"
                onClick={() => {
                  setQuantity(1)
                  setProductComment('')
                }}
              >
                <Avatar className="">
                  <AvatarImage
                    src={product.image ? product.image : placeHolderImage}
                  />
                </Avatar>
                <Label className="ml-1">
                  {product.name} ({product.price}€)
                </Label>
                <Label className="ml-1 text-green-700">
                  {orderItems.find((item) => item.product_id === product.id)
                    ? `(${orderItems.find((item) => item.product_id === product.id)?.quantity})`
                    : ''}
                </Label>
              </Button>

              {/* Popover -> Select Product Count or Remove */}
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="flex flex-col gap-1">
                <div className="flex w-full max-w-sm items-center justify-between">
                  <div>
                    <Label className="font-bold">Anzahl:</Label>
                    <Label className="ml-1 font-bold">{Quantity}</Label>
                  </div>
                  {/* Minus and Plus Button */}
                  <div className="flex">
                    <MinusCircleIcon
                      onClick={() => {
                        if (Quantity > 1) {
                          setQuantity((prevQ) => prevQ - 1)
                        }
                      }}
                      className="h-8 w-8 cursor-pointer"
                    />
                    <PlusCircleIcon
                      onClick={() => {
                        setQuantity((prevQ) => prevQ + 1)
                      }}
                      className="h-8 w-8 cursor-pointer"
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Kommentar"
                  className="mt-2"
                  value={productcomment}
                  onChange={(e) => {
                    setProductComment(e.target.value)
                  }}
                />
                <Button
                  className="mt-2"
                  onClick={() => handleAddOrder(product.id)}
                >
                  Hinzufügen <ShoppingCartIcon className="ml-1 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteOrderItem(product.id)
                  }}
                >
                  Entfernen <TrashIcon className="ml-1 h-5 w-5" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default ProductsInCategory
