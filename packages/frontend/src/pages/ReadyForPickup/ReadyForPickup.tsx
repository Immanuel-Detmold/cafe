// import { queryClient } from '@/App'
import { imgPlaceHolder } from '@/data/data'
import { useAppData } from '@/data/useAppData'
import {
  useChangeInventoryItemQuantity,
  useInventory,
} from '@/data/useInventory'
import {
  OrderItems,
  useChageOrderStatusMutationV2,
  useOrderAndItemsQuery,
} from '@/data/useOrders'
import { OrderStatus } from '@/data/useOrders'
import { useProductsQuery } from '@/data/useProducts'
import { useUser } from '@/data/useUser'
import { getAllConsumptions } from '@/generalHelperFunctions/consumptionHelper'
import { Json } from '@/services/supabase.types'
// import { supabase } from '@/services/supabase'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Loader2Icon, PlayCircleIcon, UserRoundIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

import InProcessPage from './InProcess'

const ReadyForPickup = () => {
  // States
  const [clickedButton, setClickedButton] = useState('finished')

  // States for audio
  const [isLoading, setIsLoading] = useState(false)
  const { access_token } = useUser()
  const [ip, setIp] = useState('')
  // const [port, setPort] = useState('')
  const [voice, setVoice] = useState('nova')

  // Mini Functions
  const { toast } = useToast()

  // Data
  const { data: readyOrders } = useOrderAndItemsQuery(['ready'])
  const { data: productsData } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })
  const { data: inventory } = useInventory()
  const { data: appData } = useAppData()

  // Mutations
  const { mutate: changeStatus, isPending } = useChageOrderStatusMutationV2()
  const { mutate: changeInventory, isPending: isPendingInventory } =
    useChangeInventoryItemQuantity()

  const handleStatusUpdate = (
    orderId: number,
    status: OrderStatus,
    orderItems: OrderItems[] | null,
  ) => {
    if (status === 'finished' && productsData && inventory && orderItems) {
      const consumptions = getAllConsumptions(orderItems, productsData)
      changeInventory({ consumption: consumptions, inventory })
    }

    changeStatus(
      { newStatus: status, orderId: orderId },
      {
        onSuccess: () => {
          if (status === 'finished') {
            toast({ title: 'Bestellung Abgeschlossen ✅', duration: 650 })
          }
          if (status === 'processing') {
            toast({
              title: 'Bestellung zurück in Bearbeitung ✅',
              duration: 650,
            })
          }
        },
        onError: () => {
          toast({ title: 'Fehler Status Update! ❌' })
        },
      },
    )
  }

  // Send Audio
  const handleSendText = async (order_number: string) => {
    const inputValue =
      'Die Bestellnummer ' + order_number + ' kann abgeholt werden!'
    setIsLoading(true) // Start loading
    const requestURL = `${ip}/text-to-speech`
    try {
      const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ text: inputValue, voice: voice }),
      })

      if (response.ok) {
        const data = (await response.json()) as Json
        toast({ title: (data as { message: string }).message, duration: 2000 })
        setIsLoading(false)
      } else {
        toast({ title: 'Connection failed ❌', duration: 2000 })
      }
      setIsLoading(false)
    } catch (error) {
      toast({ title: 'Connection failed ❌', duration: 2000 })
    } finally {
      setIsLoading(false)
    }
  }

  // Use Effect
  useEffect(() => {
    const serverIpData = appData?.find((item) => item.key === 'server_ip')
    const defaultVoice = appData?.find((item) => item.key === 'voice')

    if (serverIpData) {
      setIp(serverIpData.value)
    }

    if (defaultVoice) {
      setVoice(defaultVoice.value)
    }
  }, [appData])

  return (
    <>
      <div className="2xl:grid 2xl:grid-cols-5">
        {/* Left side Ready to Pickup  */}
        <div className="2xl:col-span-4">
          {/* All Cards */}
          <div className="mx-2 grid grid-cols-1 gap-2 pt-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-4 lg:pt-4">
            {readyOrders &&
              readyOrders.map((order) => (
                <Popover key={order.id}>
                  <PopoverTrigger asChild>
                    <div className="card in-w-min bg-secondary cursor-pointer select-none rounded-lg border p-4 shadow-sm shadow-zinc-700">
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
                                    className="aspect-square object-cover"
                                    // (item.Products.images && item.Products.images.length > 0) ? item.Products.images[0] : imgPlaceHolder
                                    src={
                                      item.Products &&
                                      item.Products.images &&
                                      item.Products.images.length > 0
                                        ? item.Products.images[0]
                                        : imgPlaceHolder
                                    }
                                  />
                                </Avatar>
                                <Label className="ml-2">
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
                    <Button
                      className="m-2 w-40 bg-emerald-800 hover:bg-emerald-900"
                      variant={'default'}
                      tabIndex={-1}
                      onClick={() => {
                        setClickedButton('finished')
                        handleStatusUpdate(
                          order.id,
                          'finished',
                          order.OrderItems,
                        )
                      }}
                    >
                      {(isPending || isPendingInventory) &&
                      clickedButton === 'finished' ? (
                        <Loader2Icon className="h-8 w-8 animate-spin" />
                      ) : (
                        'Abgeholt'
                      )}
                    </Button>
                    <Button
                      className="m-2 w-40"
                      variant={'default'}
                      tabIndex={-1}
                      onClick={() => {
                        setClickedButton('processing')
                        handleStatusUpdate(
                          order.id,
                          'processing',
                          order.OrderItems,
                        )
                      }}
                    >
                      {isPending && clickedButton === 'processing' ? (
                        <Loader2Icon className="h-8 w-8 animate-spin" />
                      ) : (
                        'In Bearbeitung'
                      )}
                    </Button>

                    {true && (
                      <Button
                        className="m-2 w-40"
                        variant={'default'}
                        tabIndex={-1}
                        onClick={async () => {
                          await handleSendText(order.order_number)
                        }}
                      >
                        {isLoading ? (
                          <Loader2Icon className="h-7 w-7 animate-spin" />
                        ) : (
                          <>
                            <PlayCircleIcon />
                            <Label className="ml-1 cursor-pointer">Play</Label>
                          </>
                        )}
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
              ))}
          </div>
        </div>
        {/* Right side In Process */}
        <div className="hidden 2xl:col-span-1 2xl:block ">
          <InProcessPage />
        </div>
      </div>
    </>
  )
}

export default ReadyForPickup
