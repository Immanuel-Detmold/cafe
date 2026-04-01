import { imgPlaceHolder } from '@/data/data'
import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  ProductExtra,
  ProductWithVariations,
  Variation,
} from '@/lib/customTypes'
import { MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CartItem, calcCartItemPrice, useMenuCart } from './MenuCartContext'

const MenuProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useMenuCart()
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState<Variation | null>(null)
  const [selectExtras, setSelectExtras] = useState<ProductExtra[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)

  const typedProduct = product as ProductWithVariations

  const handleExtraChange = (extra: ProductExtra, increment: boolean) => {
    setSelectExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id)
      if (increment) {
        if (existing) {
          return prev.map((e) =>
            e.id === extra.id ? { ...e, quantity: (e.quantity || 0) + 1 } : e,
          )
        }
        return [...prev, { ...extra, quantity: 1 }]
      } else {
        if (existing && (existing.quantity ?? 0) > 1) {
          return prev.map((e) =>
            e.id === extra.id ? { ...e, quantity: (e.quantity ?? 0) - 1 } : e,
          )
        }
        return prev.filter((e) => e.id !== extra.id)
      }
    })
  }

  useEffect(() => {
    const item: CartItem = {
      id: '0',
      product_id: product.id,
      quantity,
      extras: selectExtras,
      option: selectedOption,
    }
    setCurrentPrice(calcCartItemPrice(item, product))
  }, [quantity, selectedOption, selectExtras, product])

  const handleReset = () => {
    setQuantity(1)
    setSelectedOption(null)
    setSelectExtras([])
  }

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      quantity,
      extras: selectExtras,
      option: selectedOption,
    })
    handleReset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) handleReset()
      }}
    >
      <DialogTrigger className="w-full rounded-lg">
        {/* Product card in grid */}
        <div className="flex min-h-20 rounded-md border">
          <div className="flex min-h-20 min-w-20">
            <img
              className="mx-auto aspect-square h-full max-h-20 rounded-l-md object-cover"
              src={product.images?.[0] ?? imgPlaceHolder}
              alt={product.name}
            />
          </div>
          <div className="ml-2 mt-1 w-full">
            <div className="relative flex w-full justify-between">
              <h3 className="cinzel-decorative-regular text-left text-lg">
                {product.name}
              </h3>
              <p className="cinzel-decorative-regular mr-2 min-w-fit text-left text-sm text-gray-500">
                {centsToEuro(product.price)} €
              </p>
            </div>
            <p className="merriweather-regular mt-1 text-left text-sm text-gray-500">
              {product.short_description}
            </p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <div className="flex flex-col items-center">
          {/* Image Carousel */}
          {product.images && product.images.length > 0 && (
            <Carousel className="max-w-x w-full">
              <CarouselContent>
                {product.images.map((imgUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="mt-4 border-none p-1 shadow-none">
                        <CardContent
                          className={`relative flex aspect-square items-center justify-center ${product.images && product.images.length > 1 ? 'p-3' : 'p-0'}`}
                        >
                          <AspectRatio
                            ratio={1 / 1}
                            className="rounded-md shadow-md shadow-black"
                          >
                            <img
                              src={imgUrl}
                              alt="Product"
                              className="mx-auto aspect-square rounded-md object-cover"
                            />
                          </AspectRatio>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <CarouselPrevious className="ml-8 h-7 w-7" />
              )}
              {product.images.length > 1 && (
                <CarouselNext className="mr-8 h-7 w-7" />
              )}
            </Carousel>
          )}

          <h1 className="cinzel-decorative-regular mt-2 w-full text-2xl">
            {product.name}
          </h1>
          <p className="merriweather-regular mb-1 mt-2 w-full text-left text-sm text-gray-500">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mt-4 flex w-full select-none items-center justify-between">
            <Label className="font-bold">Anzahl</Label>
            <div className="flex items-center">
              <MinusCircle
                onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                className="h-8 w-8 cursor-pointer"
              />
              <span className="mx-3 text-lg">{quantity}</span>
              <PlusCircle
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 cursor-pointer"
              />
            </div>
          </div>

          {/* Variation / Options */}
          {typedProduct.options?.length > 0 && (
            <div className="mt-4 w-full">
              <Label className="font-bold">Variation</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedOption(JSON.parse(value) as Variation)
                }}
                value={
                  selectedOption ? JSON.stringify(selectedOption) : undefined
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Wähle eine Option" />
                </SelectTrigger>
                <SelectContent>
                  {typedProduct.options.map((option) => (
                    <SelectItem key={option.id} value={JSON.stringify(option)}>
                      {option.name} ({centsToEuro(parseFloat(option.price))} €)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Extras */}
          {typedProduct.extras?.length > 0 && (
            <div className="mt-4 w-full select-none">
              <Label className="font-bold">Extras</Label>
              <div className="flex flex-col">
                {typedProduct.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="mt-2 flex items-center justify-between"
                  >
                    <Label>
                      {extra.name} ({centsToEuro(parseFloat(extra.price))} €)
                    </Label>
                    <div className="flex items-center">
                      <MinusCircle
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
                      <PlusCircle
                        onClick={() => handleExtraChange(extra, true)}
                        className="h-8 w-8 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart button */}
          <Button className="mt-6 w-full" onClick={handleAdd}>
            In den Warenkorb ({centsToEuro(currentPrice)} €)
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MenuProductCard
