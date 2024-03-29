import { OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { PopoverClose } from '@radix-ui/react-popover'
import { useRef, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

type propsProductInCategory = {
  products: Product[]
  dataOrderItems: OrderItem[]
  handleAddOrder: (
    product_id: number,
    quantity: number,
    productComment: string,
  ) => void
  handleDeleteOrderItem: (product_id: number) => void
}

const ProductsInCategory = (props: propsProductInCategory) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [productComment, setProductComment] = useState<string>('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
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
                <Label className="ml-1 select-none">
                  {product.name} ({product.price}€)
                </Label>

                <Label className="ml-1 text-green-700">
                  {props.dataOrderItems.find(
                    (item) => item.product_id === product.id,
                  )
                    ? `(${props.dataOrderItems.find((item) => item.product_id === product.id)?.quantity})`
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
                    <Label className="ml-1 select-none font-bold">
                      {quantity}
                    </Label>
                  </div>
                  {/* Minus and Plus Button */}
                  <div className="flex select-none">
                    <MinusCircleIcon
                      onClick={() => {
                        if (quantity > 1) {
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
                  ref={inputRef}
                  placeholder="Kommentar"
                  className="mt-2"
                  value={productComment}
                  onChange={(e) => {
                    setProductComment(e.target.value)
                  }}
                />
                <PopoverClose asChild>
                  <Button
                    className="mt-2 w-full"
                    onClick={() => {
                      props.handleAddOrder(product.id, quantity, productComment)
                      setQuantity(1)
                      setProductComment('')
                    }}
                  >
                    Hinzufügen <ShoppingCartIcon className="ml-1 h-5 w-5" />
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => {
                      props.handleDeleteOrderItem(product.id)
                    }}
                  >
                    Entfernen <TrashIcon className="ml-1 h-5 w-5" />
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default ProductsInCategory
