import { imgPlaceHolder } from '@/data/data'
import { OrderItem } from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { TrashIcon } from '@heroicons/react/24/outline'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
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

type propsOrderDetailsPage = {
  dataOrderItem: OrderItem[]
  handleDeleteOrderItem: (product_id: number) => void
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

            {props.dataOrderItem.map((orderItem: OrderItem) => {
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
                    <Label className="ml-1">{product.name}</Label>
                  </div>
                  <Label className="flex items-center">
                    {orderItem.quantity}{' '}
                    <TrashIcon
                      className="ml-2 h-5 w-5 cursor-pointer"
                      onClick={() =>
                        props.handleDeleteOrderItem(orderItem.product_id)
                      }
                    />
                  </Label>
                  <Label>
                    {centsToEuro(product.price * orderItem.quantity)}€
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
