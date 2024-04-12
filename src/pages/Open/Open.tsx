import { imgPlaceHolder } from '@/data/data'
import { OrderStatus, useOrdersAndItemsQueryV2 } from '@/data/useOrders'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/solid'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import DeleteOrder from './DeleteOrder'
import EditOrder from './EditOrder'
import Filters from './Filters'
import OrderStatusPage from './OrderStatusSelect'
import { formatDateToTime } from './helperFunctions'

const Open = ({ statusList }: { statusList: OrderStatus[] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const { data: openOrders, error } = useOrdersAndItemsQueryV2({
    statusList: statusList,
    searchTerm: searchTerm,
    categories: selectedCategories,
    products: selectedProducts,
  })

  if (openOrders) {
    console.log('Data Open Orders: ', openOrders)
  }

  // If Filter Checkbox is checked or unchecked
  const handleCheckboxChange = (
    type: string,
    checked: string | boolean,
    value: string,
  ) => {
    //If Checkbox is checked add to selectedCategories List or remove it
    if (type === 'category') {
      if (checked) {
        setSelectedCategories(() => {
          const updated = [...selectedCategories, value]
          sessionStorage.setItem('selectedCategories', JSON.stringify(updated))
          return updated
        })
      } else {
        setSelectedCategories(() => {
          const updated = selectedCategories.filter((item) => item !== value)
          sessionStorage.setItem('selectedCategories', JSON.stringify(updated))
          return updated
        })
      }
    }
    // If Filter for Type Product is checked or unchecked
    if (type === 'product') {
      if (checked) {
        setSelectedProducts(() => {
          const updated = [...selectedProducts, value]
          sessionStorage.setItem('selectedProducts', JSON.stringify(updated))
          return updated
        })
      } else {
        setSelectedProducts(() => {
          const updated = selectedProducts.filter((item) => item !== value)
          sessionStorage.setItem('selectedProducts', JSON.stringify(updated))
          return updated
        })
      }
    }
  }

  useEffect(() => {
    // Load Cache Items
    const selectedCategories = sessionStorage.getItem('selectedCategories')
    if (selectedCategories) {
      setSelectedCategories(JSON.parse(selectedCategories) as string[])
    }
    const selectedProducts = sessionStorage.getItem('selectedProducts')
    if (selectedProducts) {
      setSelectedProducts(JSON.parse(selectedProducts) as string[])
    }
  }, [])

  useEffect(() => {
    // supabase
    //   .channel('order-db-changes')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //     },
    //     (payload) => {
    //       console.log('Realtime Payload: ', payload)
    //       void queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
    //     },
    //   )
    //   .subscribe()
  })

  return (
    <div className="mb-6 flex flex-col">
      {/* <Button onClick={() => {}}>Test</Button> */}
      <div className="mt-2 flex items-center">
        <Input
          className="w-[100%]"
          placeholder="Bestellung suchen"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        <Filters
          handleCheckboxChange={handleCheckboxChange}
          selectedCategories={selectedCategories}
          selectedProducts={selectedProducts}
        />
      </div>
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
                <Label className="text-right font-bold">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        {/* Click on Avatar or Product Name to Show Product Details */}
                        <div className="flex">
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
                          <Label className="ml-1 cursor-pointer">
                            {orderItem.product_name}
                          </Label>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="flex">
                          <img
                            src={orderItem.Products?.image || imgPlaceHolder}
                            alt={orderItem.Products?.name}
                            className="aspect-square w-20 rounded-md object-cover"
                          />
                          <div className="ml-2 flex flex-col">
                            <Label className="font-bold">
                              {orderItem.Products?.name}
                            </Label>
                            <Label className="ml-1">
                              Kategorie: {orderItem.Products?.category}
                            </Label>
                            <Label className="ml-1">
                              Preis: {orderItem.Products?.price}€
                            </Label>
                          </div>
                        </div>

                        {/* If Method Exist, show it */}
                        {orderItem.Products?.method && (
                          <>
                            <Separator className="mt-2 border-t" />
                            <Label className="mt-2 font-bold">
                              Zubereitung:
                              <br />
                            </Label>
                            <Label>{orderItem.Products?.method}</Label>
                          </>
                        )}
                      </PopoverContent>
                    </Popover>

                    {/* Comment Bubble, if it exists*/}
                    {orderItem.comment && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <Label className="font-bold">
                            Kommentar: <br />
                          </Label>
                          <Label>{orderItem.comment}</Label>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="item-center col-span-1 flex">
                    <ShoppingBagIcon className="h-6" />
                    <Label>{orderItem.quantity}</Label>
                  </div>

                  {/* Price */}
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
                <EditOrder />
                <div className="flex w-full justify-end">
                  <DeleteOrder order={order} />
                  <OrderStatusPage order={order} />
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
