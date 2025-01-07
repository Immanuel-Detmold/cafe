import { imgPlaceHolder } from '@/data/data'
import { Inventory } from '@/data/useInventory'
import { OrdersAndItemsV2 } from '@/data/useOrders'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  ProductExtra,
  ProductWithVariations,
  Variation,
} from '@/lib/customTypes'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { PopoverClose } from '@radix-ui/react-popover'
import { ClockIcon } from 'lucide-react'
import { useRef, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { ProductOrder } from './NewOrder'
import {
  getInventoryCount,
  getOpenOrdersCount,
} from './utilityFunctions/getInventoryCount'
import { centsToEuroString } from './utilityFunctions/handleOrder'

type propsProductInCategory = {
  products: ProductWithVariations[]
  dataOrderItems: ProductOrder[]
  openOrders: OrdersAndItemsV2
  handleAddOrder: (
    product_id: number,
    quantity: number,
    productComment: string,
    selectedOption: Variation | null,
    selectExtras: ProductExtra[] | [],
  ) => void
  InventoryData: Inventory[] | undefined
}

const ProductsInCategory = (props: propsProductInCategory) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [productComment, setProductComment] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<Variation | null>(null)
  const [selectExtras, setSelectExtras] = useState<ProductExtra[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleExtraChange = (extra: ProductExtra, increment: boolean) => {
    setSelectExtras((prevExtras) => {
      const existingExtra = prevExtras.find((e) => e.id === extra.id)
      if (increment) {
        if (existingExtra) {
          return prevExtras.map((e) =>
            e.id === extra.id ? { ...e, quantity: (e.quantity || 0) + 1 } : e,
          )
        } else {
          return [...prevExtras, { ...extra, quantity: 1 }]
        }
      } else {
        if (existingExtra && (existingExtra.quantity ?? 0) > 1) {
          return prevExtras.map((e) =>
            e.id === extra.id ? { ...e, quantity: (e.quantity ?? 0) - 1 } : e,
          )
        } else {
          return prevExtras.filter((e) => e.id !== extra.id)
        }
      }
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {props.products?.map((product) => (
        <div
          key={product.id}
          className="m-1 flex w-min items-center justify-between"
        >
          <Popover>
            <PopoverTrigger asChild className="ml-2">
              <Button
                variant="outline"
                className={`h-14 rounded-full px-2 ${props.dataOrderItems.some((item) => item.product_id === product.id) ? 'bg-secondary' : ''}`}
                onClick={() => {
                  setQuantity(1)
                  setProductComment('')
                  setSelectedOption(null)
                  setSelectExtras([])
                }}
              >
                <Avatar className="">
                  <AvatarImage
                    className="aspect-square object-cover"
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : imgPlaceHolder
                    }
                  />
                </Avatar>
                <Label className="ml-1 cursor-pointer select-none">
                  {product.name} ({centsToEuro(product.price)}€)
                </Label>

                {/* Show if Product is currently Selected */}
                {/* <Label className="ml-1 text-green-700">
                  {props.dataOrderItems.find(
                    (item) => item.product_id === product.id,
                  )
                    ? `(${props.dataOrderItems.find((item) => item.product_id === product.id)?.quantity})`
                    : ''}
                </Label> */}
              </Button>

              {/* Popover -> Select Product Count or Remove */}
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[250px]">
              <div className="flex flex-col gap-1">
                <div className="flex w-full max-w-sm items-center justify-between">
                  <div className="flex w-full justify-between">
                    <div className="flex-1">
                      <Label className="font-bold">Anzahl:</Label>
                      <Label className="ml-1 select-none font-bold">
                        {quantity}
                      </Label>
                    </div>

                    {/* Plus and Minus Icons */}
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
                </div>

                {/* Show How much is in Stock */}
                {product.stock != null && product.stock > 1 && (
                  <div className="flex justify-between">
                    <div>
                      <Label>Vorrätig:</Label>
                      <Label className="ml-1 select-none">
                        {product.stock}
                      </Label>
                    </div>
                    <Label className="ml-1 select-none">
                      {
                        <span className="text-amber-600">
                          {getOpenOrdersCount(product.id, props.openOrders)}
                          <ClockIcon
                            className="delay-90 ml-1 inline-block h-4 w-4 animate-pulse stroke-[1px]"
                            size={60}
                          />
                        </span>
                      }
                    </Label>
                  </div>
                )}

                {/* Show How much is in Inventory */}
                <div className="flex justify-between">
                  <div>
                    {product.show_consumption &&
                      props.InventoryData &&
                      getInventoryCount(product, props.InventoryData).map(
                        (item) => (
                          <div key={item.name}>
                            <p>
                              {item.name}: {item.quantity} {item.unit}
                            </p>
                          </div>
                        ),
                      )}
                  </div>
                  {(!product.stock || product.stock <= 0) &&
                  product.show_consumption ? (
                    <Label className="ml-1 select-none">
                      {
                        <span className="text-amber-600">
                          {getOpenOrdersCount(product.id, props.openOrders)}
                          <ClockIcon
                            className="delay-90 ml-1 inline-block h-4 w-4 animate-pulse stroke-[1px]"
                            size={60}
                          />
                        </span>
                      }
                    </Label>
                  ) : null}
                </div>

                {/* Fields to Select Option and Extras */}
                {product.options.length > 0 && (
                  <div className="mt-4">
                    <Label className="font-bold">Variation</Label>
                    <Select
                      onValueChange={(value) => {
                        const option = JSON.parse(value) as Variation
                        setSelectedOption(option)
                      }}
                      value={
                        selectedOption
                          ? JSON.stringify(selectedOption)
                          : undefined
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Wähle eine Option" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={JSON.stringify(option)}
                          >
                            {option.name} ({centsToEuroString(option.price)}€)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Extras */}
                {product.extras.length > 0 && (
                  <div className="mt-4 select-none">
                    <Label className="font-bold">Extras</Label>

                    <div className="flex flex-col">
                      {/* Left Name and Price, Right + and - icon */}
                      {product.extras.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between"
                        >
                          <Label>
                            {extra.name} ({centsToEuroString(extra.price)}€)
                          </Label>
                          <div className="flex items-center">
                            <MinusCircleIcon
                              onClick={() => {
                                if (
                                  (selectExtras.find((e) => e.id === extra.id)
                                    ?.quantity ?? 0) > 0
                                ) {
                                  handleExtraChange(extra, false)
                                }
                              }}
                              className="h-6 w-6 cursor-pointer"
                            />
                            <span className="mx-2">
                              {selectExtras.find((e) => e.id === extra.id)
                                ?.quantity || 0}
                            </span>
                            <PlusCircleIcon
                              onClick={() => {
                                handleExtraChange(extra, true)
                              }}
                              className="h-6 w-6 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment Field */}
                <Textarea
                  ref={inputRef}
                  placeholder="Kommentar"
                  className="mt-2"
                  value={productComment}
                  onChange={(e) => {
                    setProductComment(e.target.value)
                  }}
                  tabIndex={-1}
                />
                <PopoverClose asChild>
                  {/* Add to Cart */}
                  <Button
                    className="mt-2 w-full"
                    onClick={() => {
                      props.handleAddOrder(
                        product.id,
                        quantity,
                        productComment,
                        selectedOption,
                        selectExtras,
                      )
                      setQuantity(1)
                      setProductComment('')
                    }}
                  >
                    Hinzufügen
                    <ShoppingCartIcon className="ml-1 h-5 w-5" />
                  </Button>
                </PopoverClose>
                {/* Remove from Cart */}
                {/* <PopoverClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => {
                      props.handleDeleteOrderItem(product.id)
                    }}
                  >
                    Entfernen
                    <TrashIcon className="ml-1 h-5 w-5" />
                  </Button>
                </PopoverClose> */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default ProductsInCategory
