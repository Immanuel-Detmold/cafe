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
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { PopoverClose } from '@radix-ui/react-popover'
import { ClockIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useEffect } from 'react'

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
import {
  calcSingleOrderItemPrice,
  centsToEuroString,
} from './utilityFunctions/handleOrder'

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
  const [currentProduct, setCurrentProduct] =
    useState<ProductWithVariations | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [productComment, setProductComment] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<Variation | null>(null)
  const [selectExtras, setSelectExtras] = useState<ProductExtra[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
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

  // Check if users changes the quantity, extras, options if yes run useeffect to update price
  useEffect(() => {
    if (currentProduct === null) return
    const getCurrentPrice = () => {
      const orderItem: ProductOrder = {
        id: '0',
        product_id: currentProduct.id,
        quantity: quantity,
        comment: '',
        extras: selectExtras,
        option: selectedOption,
      }

      const finalPrice = calcSingleOrderItemPrice(orderItem, currentProduct)
      return finalPrice
    }

    // Update the current price whenever quantity, selectedOption, or selectExtras change
    setCurrentPrice(getCurrentPrice())
  }, [quantity, selectedOption, selectExtras, productComment, currentProduct])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {props.products?.map((product) => (
        <div
          key={product.id}
          className="m-1 flex w-min items-center justify-between"
        >
          <Popover>
            <PopoverTrigger asChild className="relative ml-2">
              {/* Horizontal red line */}
              <Button
                variant="outline"
                className={`relative h-14 overflow-hidden rounded-full px-2 ${props.dataOrderItems.some((item) => item.product_id === product.id) ? 'bg-secondary' : ''}`}
                onClick={() => {
                  setQuantity(1)
                  setProductComment('')
                  setSelectedOption(null)
                  setSelectExtras([])
                  setCurrentProduct(product)
                }}
              >
                {/* If out of stock: blur background and show SOLD overlay */}
                {(product.stock == null || product.stock <= 0) &&
                  product.show_stock_colors && (
                    <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                      <span
                        className="absolute inset-0"
                        style={{
                          backdropFilter: 'blur(2px)',
                          background: 'rgba(0,0,0,0.15)',
                        }}
                      />
                      <span className="relative z-30 rounded px-2 py-1 text-sm font-bold tracking-widest text-white">
                        Ausverkauft
                      </span>
                    </span>
                  )}

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
                <Label className="ml-1 text-green-700">
                  {(() => {
                    // Sum up the quantities for each orderItem with the matching product_id
                    const totalQuantity = props.dataOrderItems
                      .filter((item) => item.product_id === product.id)
                      .reduce((sum, item) => sum + item.quantity, 0)

                    // If totalQuantity is greater than 0, display it, otherwise display an empty string
                    return totalQuantity > 0 ? `(${totalQuantity})` : ''
                  })()}
                </Label>
              </Button>

              {/* Popover -> Select Product Count or Remove */}
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[270px]">
              <div className="flex flex-col gap-1">
                <div className="flex w-full max-w-sm items-center justify-between">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col">
                      <Label className="font-bold">{product.name}</Label>
                    </div>

                    {/* Plus and Minus Icons */}
                    <div className="flex select-none items-center">
                      <MinusCircleIcon
                        onClick={() => {
                          if (quantity > 1) {
                            setQuantity((prevQ) => prevQ - 1)
                          }
                        }}
                        className="h-8 w-8 cursor-pointer"
                      />

                      <span className="mx-2">{quantity}</span>

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
                {product.stock != null && product.stock > 0 && (
                  <div className="flex justify-between">
                    <div>
                      <Label className="text-gray-400">Vorrätig:</Label>
                      <Label className="ml-1 select-none text-gray-400">
                        {product.stock -
                          getOpenOrdersCount(product.id, props.openOrders)}
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
                          className="mt-2 flex items-center justify-between"
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
                              className="h-8 w-8 cursor-pointer"
                            />
                            <span className="mx-2">
                              {selectExtras.find((e) => e.id === extra.id)
                                ?.quantity || 0}
                            </span>
                            <PlusCircleIcon
                              onClick={() => {
                                handleExtraChange(extra, true)
                              }}
                              className="h-8 w-8 cursor-pointer"
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
                    Hinzufügen ({centsToEuro(currentPrice)}€)
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
