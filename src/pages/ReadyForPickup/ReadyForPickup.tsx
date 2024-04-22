// import { queryClient } from '@/App'
import { imgPlaceHolder } from '@/data/data'
import {
  useChageOrderStatusMutationV2,
  useOrderAndItemsQuery,
} from '@/data/useOrders'
import { OrderStatus } from '@/data/useOrders'
// import { supabase } from '@/services/supabase'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { UserRoundIcon } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

const ReadyForPickup = () => {
  const { data: readyOrders } = useOrderAndItemsQuery(['ready'])
  const { mutate: changeStatus, isPending } = useChageOrderStatusMutationV2()
  const [clickedButton, setClickedButton] = useState('finished')

  const { toast } = useToast()

  if (readyOrders) {
    console.log('Ready Orders: ', readyOrders)
  }

  const handleStatusUpdate = (orderId: number, status: OrderStatus) => {
    changeStatus(
      { newStatus: status, orderId: orderId },
      {
        onSuccess: (data) => {
          if (status === 'finished') {
            console.log('Updated Order Status', data)
            toast({ title: 'Bestellung Abgeschlossen ✅', duration: 650 })
          }
          if (status === 'processing') {
            console.log('Updated Order Status', data)
            toast({
              title: 'Bestellung zurück in Bearbeitung ✅',
              duration: 650,
            })
          }
        },
        onError: (error) => {
          toast({ title: 'Fehler Status Update! ❌' })
          console.log('Error Update Order Status: ', error)
        },
      },
    )
  }

  return (
    <>
      {/* All Cards */}
      <div className="mx-2 grid grid-cols-1 gap-2 pt-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-4 lg:pt-4">
        {readyOrders &&
          readyOrders.map((order) => (
            <Popover key={order.id}>
              <PopoverTrigger asChild>
                <div className="card in-w-min cursor-pointer select-none rounded-lg border bg-secondary p-4 shadow-sm shadow-zinc-700">
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    {/* ID */}
                    <Label className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-7xl">
                      #{order.order_number}
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
                            <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                              <AvatarImage
                                className=""
                                src={
                                  item.Products && item.Products.image
                                    ? item.Products.image
                                    : imgPlaceHolder
                                }
                              />
                            </Avatar>
                            <Label className="ml-1">
                              {item.Products?.name}
                            </Label>
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
              </PopoverTrigger>
              <PopoverContent className="flex w-80 flex-col items-center justify-center">
                <Label className="font-bold">Status Update</Label>
                <Button
                  className="m-2 w-40 bg-emerald-800 hover:bg-emerald-900"
                  variant={'default'}
                  tabIndex={-1}
                  onClick={() => {
                    setClickedButton('finished')
                    handleStatusUpdate(order.id, 'finished')
                  }}
                >
                  {isPending && clickedButton === 'finished'
                    ? 'Loading...'
                    : 'Abgeholt'}
                </Button>
                <Button
                  className="m-1 w-40"
                  variant={'default'}
                  tabIndex={-1}
                  onClick={() => {
                    setClickedButton('processing')
                    handleStatusUpdate(order.id, 'processing')
                  }}
                >
                  {isPending && clickedButton === 'processing'
                    ? 'Loading...'
                    : 'In Bearbeitung'}
                </Button>
              </PopoverContent>
            </Popover>
          ))}
      </div>
    </>
  )
}

export default ReadyForPickup
