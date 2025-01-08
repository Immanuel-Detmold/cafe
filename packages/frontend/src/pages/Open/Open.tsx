import { PAYMENT_METHODS, imgPlaceHolder } from '@/data/data'
import { useInventory } from '@/data/useInventory'
import {
  OrderItem,
  OrderStatus,
  useOrdersAndItemsQueryV2,
  useUpdateOrderItemStatusMutation,
} from '@/data/useOrders'
import { useProductsQuery } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import {
  getEndOfDayToday,
  getStartOfDayToday,
} from '@/generalHelperFunctions/dateHelperFunctions'
import { formatDateToTime } from '@/generalHelperFunctions/dateHelperFunctions'
import { OrderItemsVariationsProduct } from '@/lib/customTypes'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

import DeleteOrder from './DeleteOrder'
import EditOrder from './EditOrder'
import Filters from './Filters'
import OrderStatusPage from './OrderStatusSelect'

const Open = ({
  statusList,
  startDate,
  endDate,
  currentUrlPage,
  paymentPage,
}: {
  statusList?: OrderStatus[]
  startDate?: string
  endDate?: string
  currentUrlPage?: string
  paymentPage: boolean
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [clickedItem, setClickedItem] = useState('')
  const { toast } = useToast()

  if (startDate === undefined && endDate === undefined) {
    startDate = getStartOfDayToday().finalDateString
    endDate = getEndOfDayToday().endOfDayString
  }

  // Data
  const { data: openOrders, error } = useOrdersAndItemsQueryV2({
    statusList: statusList,
    searchTerm: searchTerm,
    categories: selectedCategories,
    products: selectedProducts,
    startDate: startDate,
    endDate: endDate,
  })

  console.log(openOrders)
  const { data: inventory } = useInventory()

  const { data: productsData } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })

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

  const { mutate: updateOrderItemStatus, isPending } =
    useUpdateOrderItemStatusMutation()

  const handleOrderItemStatus = (orderItem: OrderItem) => {
    const newStatus = !orderItem.finished
    updateOrderItemStatus(
      {
        orderItemId: orderItem.id,
        newStatus: newStatus,
        created_at: orderItem.created_at,
      },
      {
        onError: () => {
          toast({
            title: 'Status konnte nicht aktualisiert werden! ❌',
          })
        },
      },
    )
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

  return (
    <div className="mb-6 flex w-full flex-col items-center">
      <div className="orderWidth relative w-full">
        {/* Bestellung suchen und Filter */}
        <div className="bg-background sticky top-0 z-50 flex items-center pt-2">
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
          <Label className="mt-2 font-bold">
            Keine Bestellungen Vorhanden!
          </Label>
        )}

        {/* Center All Order Cards */}
        {/* <div className='flex flex-col items-center'> */}

        {/* Order Cards */}
        {openOrders &&
          openOrders?.map((order) => (
            <div className="mt-2 rounded-lg border" key={order.id}>
              {/* Order Card Top */}
              <div className="bg-secondary flex w-full items-center justify-between overflow-hidden p-2">
                {/* Left Info Box */}
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="h-8 w-8" />
                  <div className="ml-1 flex flex-col">
                    <Label className="font-bold">
                      {order.customer_name ? (
                        order.customer_name
                      ) : (
                        <div className="flex h-6 items-center">
                          <UserIcon className="h-4" />
                        </div>
                      )}
                    </Label>
                    <div className="flex">
                      {/* Time */}
                      <Label>{formatDateToTime(order.created_at)}</Label>{' '}
                      {order.table_number && (
                        <Label className="ml-1"> - {order.table_number}</Label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Info Box */}
                <div className="flex flex-col">
                  <Label className="text-right font-bold">
                    Bestellung: #{order.order_number}
                  </Label>
                  <div>
                    <Badge className="mr-1">
                      {
                        PAYMENT_METHODS.find(
                          (method) => method.name === order.payment_method,
                        )?.label
                      }
                    </Badge>
                    <Label className="text-right">
                      Summe: {centsToEuro(order.price)}€
                    </Label>
                  </div>
                </div>
              </div>

              <div className="px-2 pb-2">
                {/* Order Card Middle */}
                {(
                  order.OrderItems as unknown as OrderItemsVariationsProduct[]
                ).map((orderItem) => (
                  // {/* Row for Product */}
                  <div className="mt-2 grid grid-cols-6" key={orderItem.id}>
                    {/* Product Name and Img */}
                    <div className="col-span-4 flex items-center">
                      <Popover>
                        <PopoverTrigger asChild className="flex flex-col">
                          <div>
                            {/* Click on Avatar or Product Name to Show Product Details */}
                            <div className="flex">
                              <Avatar className="cursor-pointer">
                                {/* Image */}
                                <AvatarImage
                                  className="aspect-square h-6 w-6 rounded-full object-cover"
                                  src={
                                    orderItem.Products &&
                                    orderItem.Products.images &&
                                    orderItem.Products.images.length > 0
                                      ? orderItem.Products.images[0]
                                      : imgPlaceHolder
                                  }
                                />
                              </Avatar>
                              <Label className="ml-1 cursor-pointer">
                                {orderItem.product_name}
                              </Label>
                              <Label className="ml-1 cursor-pointer">
                                {orderItem.option ? (
                                  <Badge>{orderItem.option?.name}</Badge>
                                ) : (
                                  ''
                                )}
                              </Label>
                            </div>
                            <div>
                              {/* Text for Extras */}
                              {!paymentPage &&
                                orderItem.extras &&
                                orderItem.extras.length > 0 && (
                                  <div className="">
                                    {orderItem.extras.map((extra) => (
                                      <Label
                                        className="ml-1 cursor-pointer text-xs text-gray-400"
                                        key={extra.id}
                                      >
                                        {extra.name} (x{extra.quantity})
                                      </Label>
                                    ))}
                                  </div>
                                )}
                              {paymentPage &&
                                orderItem.extras &&
                                orderItem.extras.length > 0 && (
                                  <div className="">
                                    {orderItem.extras.map((extra) => (
                                      <Label
                                        className="ml-1 text-xs text-gray-400"
                                        key={extra.id}
                                      >
                                        {extra.name}(
                                        {centsToEuro(
                                          parseInt(extra.price) *
                                            extra.quantity!,
                                        )}
                                        €)
                                      </Label>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="flex">
                            {/* Image */}
                            <img
                              src={
                                orderItem.Products?.images &&
                                orderItem.Products.images.length > 0
                                  ? orderItem.Products.images[0]
                                  : imgPlaceHolder
                              }
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
                                Preis:{' '}
                                {orderItem.Products &&
                                  centsToEuro(orderItem.product_price)}
                                €
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

                    {/* Quantity and Order Status*/}
                    <div
                      className="item-center col-span-1 flex cursor-pointer"
                      onClick={() => setClickedItem(orderItem.id.toString())}
                    >
                      {/* Set only clicked OrderItem to "..." (isPending) */}
                      {isPending && clickedItem === orderItem.id.toString() ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <ShoppingBagIcon
                          className={`h-6 ${order.status === 'processing' && orderItem.finished !== true ? 'text-amber-600' : orderItem.finished ? 'text-emerald-600' : ''}`}
                          onClick={() => handleOrderItemStatus(orderItem)}
                        />
                      )}

                      <Label className="cursor-pointer">
                        {orderItem.quantity}
                      </Label>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 flex flex-col">
                      <Label className="text-right">
                        {centsToEuro(orderItem.product_price)}€
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
                {currentUrlPage !== 'statistic' && (
                  <div className="mt-2 flex justify-between">
                    <EditOrder orderId={order.id} />
                    <div className="flex w-full justify-end">
                      <DeleteOrder order={order} />

                      <OrderStatusPage
                        order={order}
                        productData={productsData}
                        inventory={inventory}
                        orderItems={order.OrderItems}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* </div> */}
        {/* End */}
      </div>
    </div>
  )
}

export default Open
