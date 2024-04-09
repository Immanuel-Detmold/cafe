import { imgPlaceHolder } from '@/data/data'
import { useOrderAndItemsQuery } from '@/data/useOrders'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { UserRoundIcon } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'

const ReadyForPickup = () => {
  const { data: readyOrders } = useOrderAndItemsQuery(['ready'])
  console.log(readyOrders)

  return (
    <>
      {/* All Cards */}
      <div className="grid grid-cols-1 gap-2 pt-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-4 lg:pt-4">
        {readyOrders &&
          readyOrders.map((order) => (
            // Card
            <div
              className="min-w-min cursor-pointer select-none rounded-lg border bg-secondary p-4 shadow-sm shadow-zinc-700"
              key={order.id}
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                {/* ID */}
                <Label className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-7xl">
                  #{order.id}
                </Label>
                {/* Customer Name */}
                <div className="flex items-center">
                  <UserRoundIcon className="mt-1 h-6" />
                  <Label className="sm:text-1xl ml-1 max-w-64 overflow-hidden overflow-ellipsis whitespace-nowrap font-bold hover:whitespace-normal  md:text-2xl lg:text-3xl">
                    {order.customer_name}
                  </Label>
                </div>
              </div>

              {/* Products */}
              <div className="mt-2 grid grid-cols-2 gap-4">
                {order.OrderItems &&
                  order.OrderItems.map((item) => (
                    //{/* Product */}
                    <div
                      className="flex items-center justify-between"
                      key={item.id}
                    >
                      <div className="flex items-center">
                        <Avatar className="">
                          <AvatarImage
                            className=""
                            src={
                              item.Products && item.Products.image
                                ? item.Products.image
                                : imgPlaceHolder
                            }
                          />
                        </Avatar>
                        <Label className="ml-1">Cafe</Label>
                      </div>
                      {/* Quantity */}
                      <div className="flex items-center">
                        <ShoppingBagIcon className="h-6" />
                        <Label>{item.quantity}</Label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default ReadyForPickup
