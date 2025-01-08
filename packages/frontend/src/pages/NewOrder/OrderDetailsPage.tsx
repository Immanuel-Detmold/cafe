import { imgPlaceHolder } from '@/data/data'
import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { TrashIcon } from '@heroicons/react/24/outline'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { ProductOrder } from './NewOrder'
import { calcSingleOrderItemPrice } from './utilityFunctions/handleOrder'

type propsOrderDetailsPage = {
  dataOrderItem: ProductOrder[]
  handleDeleteOrderItem: (id: string) => void
  products: Product[]
  sumOrderPrice: number
}

const OrderDetailsPage = (props: propsOrderDetailsPage) => {
  return (
    <div className="ml-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={props.dataOrderItem.length === 0}>
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Details zur Bestellung</DialogTitle>
            <DialogDescription>
              Hier kannst du deine Bestellung überprüfen und Produkte entfernen.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2 flex items-center">
                <Label htmlFor="name" className="font-bold">
                  Produkt
                </Label>
              </div>
              <Label className="font-bold">Anzahl</Label>
              <Label className="font-bold">Summe</Label>
            </div>

            <Separator />

            {props.dataOrderItem.map((orderItem) => {
              const product = props.products.find(
                (product) => product.id === orderItem.product_id,
              )
              if (!product) {
                return null
              }
              return (
                <div
                  key={orderItem.product_id}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <div className="col-span-2 flex items-center">
                    {/* Image */}
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        className="aspect-square object-cover"
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : imgPlaceHolder
                        }
                      />
                    </Avatar>

                    {/* Name and Option */}
                    <div className="flex flex-col">
                      <Label className="ml-1">
                        {product.name}{' '}
                        {orderItem.option?.name ? (
                          <Badge>{orderItem.option?.name}</Badge>
                        ) : (
                          ''
                        )}
                      </Label>

                      {/* Text for Extras */}
                      {orderItem.extras && orderItem.extras.length > 0 && (
                        <div className="">
                          {orderItem.extras.map((extra) => (
                            <Label
                              className="ml-1 text-xs text-gray-400"
                              key={extra.id}
                            >
                              {extra.name}(
                              {centsToEuro(
                                parseInt(extra.price) * extra.quantity!,
                              )}
                              €)
                            </Label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trashicon */}
                  <Label className="flex items-center">
                    {orderItem.quantity}{' '}
                    <TrashIcon
                      className="ml-2 h-5 w-5 cursor-pointer"
                      onClick={() => props.handleDeleteOrderItem(orderItem.id)}
                    />
                  </Label>
                  <Label>
                    {centsToEuro(calcSingleOrderItemPrice(orderItem, product))}€
                    {/* {centsToEuro(product.price * orderItem.quantity)}€ */}
                  </Label>
                </div>
              )
            })}
            <Separator />

            <div className="grid grid-cols-4 gap-4">
              <Label className="col-start-4 -mt-2 font-bold text-amber-600">
                {centsToEuro(props.sumOrderPrice)}€
              </Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderDetailsPage
