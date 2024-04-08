import { imgPlaceHolder } from '@/data/data'
import { useOrderAndItemsQuery } from '@/data/useOrders'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/solid'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'

import DeleteOrder from './DeleteOrder'
import OrderDetails from './OrderDetails'
import OrderStatusPage from './OrderStatusSelect'
import { formatDateToTime } from './helperFunctions'

const Open = () => {
  const { data: openOrders, error } = useOrderAndItemsQuery([
    'waiting',
    'processing',
  ])

  console.log(openOrders)
  return (
    <div className="mb-6 flex flex-col">
      {error && <div>{JSON.stringify(error)}</div>}
      {(!openOrders || openOrders.length === 0) && (
        <Label className="mt-2 font-bold">Keine Bestellungen Vorhanden!</Label>
      )}

      {/* Order Cards */}
      {openOrders &&
        openOrders?.map((order) => (
          <div className="mt-2 rounded-lg border" key={order.id}>
            {/* Order Card Top */}
            <div className="flex w-full items-center justify-between overflow-hidden bg-secondary p-2">
              {/* Left Info Box */}
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-8 w-8" />
                <div className="ml-1 flex flex-col">
                  <Label className="font-bold">
                    {order.customer_name ? (
                      order.customer_name
                    ) : (
                      <UserIcon className="h-4" />
                    )}
                  </Label>
                  {/* Time */}
                  <Label>{formatDateToTime(order.created_at)}</Label>
                </div>
              </div>

              {/* Right Info Box */}
              <div className="flex flex-col">
                <Label className="text-right">
                  Bestellung: #{order.id.toString().slice(-2)}
                </Label>
                <Label className="text-right">Summe: {order.price}€</Label>
              </div>
            </div>

            <div className="px-2 pb-2">
              {/* Order Card Middle */}
              {order.OrderItems.map((orderItem) => (
                // {/* Row for Product */}
                <div className="mt-2 grid grid-cols-6" key={orderItem.id}>
                  {/* Product Name and Img */}
                  <div className="col-span-4 flex items-center">
                    <Avatar className="">
                      <AvatarImage
                        className="h-6 w-6 rounded-full"
                        src={
                          orderItem.Products && orderItem.Products.image
                            ? orderItem.Products.image
                            : imgPlaceHolder
                        }
                      />
                    </Avatar>
                    <Label className="ml-1">{orderItem.product_name}</Label>
                    {/* Comment Bubble, if it exists*/}
                    <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
                  </div>
                  {/* Quantity */}
                  <div className="item-center col-span-1 flex">
                    <ShoppingBagIcon className="h-6" />
                    <Label>{orderItem.quantity}</Label>
                  </div>

                  <div className="col-span-1 flex flex-col">
                    <Label className="text-right">
                      {orderItem.Products?.price}€
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <Separator className="mx-2 mb-1 mt-2 border-t" />
            {/* Order Card Bottom */}
            <div className="px-2 pb-2">
              <Label className="flex items-center">
                {order.comment && (
                  <ChatBubbleBottomCenterTextIcon className="mr-1 h-4 text-red-700" />
                )}
                {order.comment && '' + order.comment}
              </Label>
              <div className="mt-2 flex justify-between">
                <OrderDetails />
                <div className="flex w-full justify-end">
                  <DeleteOrder order={order} />

                  <OrderStatusPage order={order} />
                  {/* <Button className="ml-2" variant="default">
                    In Bearbeitung
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* End */}
    </div>
  )
}

export default Open
