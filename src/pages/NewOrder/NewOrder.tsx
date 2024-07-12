import { useAppData, useUpdateAppData } from '@/data/useAppData'
import {
  OrderItem,
  useDeleteOrderMutation,
  useSaveOrderItemsMutation,
  useSaveOrderMutation,
  useSingleOrder,
} from '@/data/useOrders'
import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { Loader2Icon, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import Filters from './Filters'
import OrderDetailsPage from './OrderDetailsPage'
import ProductsInCategory from './ProductsInCategory'
import {
  GetOrderNumber,
  calcOrderPrice,
  getProductIds,
  getUniqueCategories,
} from './utilityFunctions/handleOrder'

type GroupedProducts = Record<string, Product[]>

const NewOrder = () => {
  const [dataOrderItems, setDataOrderItems] = useState<OrderItem[]>([])
  const [sumOrderPrice, setSumOrderPrice] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')
  // Abweichender Preis:
  const [customPrice, setCustomPrice] = useState<boolean>(false)
  // customPriceValue muss ein String sein, damit das Input Feld leer sein kann
  const [customPriceValue, setCustomPriceValue] = useState('')
  const [orderComment, setOrderComment] = useState<string>('')
  const [orderName, setOrderName] = useState<string>('')
  const [tableNumber, setTableNumber] = useState<string>('')
  const [orderNumber, setOrderNumber] = useState<string>('1')

  // Add filter to NewOrder Page
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // For Edit Order --- Get OrderId from URL
  const [orderIdEdit, setOrderIdEdit] = useState<string>()
  const { orderId } = useParams()
  useEffect(() => {
    orderId && setOrderIdEdit(orderId)
  }, [orderId])
  // -------------------------------------

  const { toast } = useToast()

  const { data: appData } = useAppData()
  const { mutate: updateAppData } = useUpdateAppData()
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })

  const { data: products_filtered } = useProductsQuery({
    searchTerm: searchTerm,
    ascending: true,
    categories: selectedCategories,
  })

  if (error) {
    toast({ title: 'Fehler beim Laden der Produkte! ❌' })
  }

  // Load Order from Database if Edit Order ---
  const { data: editData } = useSingleOrder({
    orderId: orderId,
  })
  useEffect(() => {
    if (editData) {
      editData.comment && setOrderComment(editData.comment)
      editData.customer_name && setOrderName(editData.customer_name)
      editData.payment_method && setPaymentMethod(editData.payment_method)
      editData.table_number && setTableNumber(editData.table_number)
      setOrderNumber(editData.order_number)

      // Get Sum Price of orderItems and check if eidtData.Price is the same, if not set custom price
      const orderItems: OrderItem[] = []
      editData.OrderItems.forEach((item) => {
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          comment: item.comment || '',
        })
      })
      setDataOrderItems(orderItems)
      const orderItemsPrice = calcOrderPrice({
        dataOrderItems: orderItems,
        products: products || [],
      })

      if (orderItemsPrice !== editData.price) {
        setCustomPrice(true)
        setCustomPriceValue(centsToEuro(editData.price))
      }

      // Set OrderNumber to old oder Number
      setOrderNumber(editData.order_number)
    } else {
      setOrderNumber(GetOrderNumber(appData))
    }
  }, [editData, products, orderIdEdit, appData])
  // -----------

  useEffect(() => {
    // Update Order Price
    setSumOrderPrice(
      calcOrderPrice({
        dataOrderItems: dataOrderItems,
        products: products || [],
      }),
    )
  }, [dataOrderItems, products])

  // Load OrderItems from Cache if exists.
  useEffect(() => {
    if (products) {
      const sessionData = sessionStorage.getItem('orderItems')
      const sessionData2 = sessionData
        ? (JSON.parse(sessionData) as OrderItem[])
        : []
      setDataOrderItems(sessionData2)
    }
    const sessionComment = sessionStorage.getItem('orderComment')
    if (sessionComment) {
      setOrderComment(sessionComment)
    }
    const sessionName = sessionStorage.getItem('orderName')
    if (sessionName) {
      setOrderName(sessionName)
    }
    const sessionTableNumber = sessionStorage.getItem('tableNumber')
    if (sessionTableNumber) {
      setTableNumber(sessionTableNumber)
    }
    const sessionPaymentMethod = sessionStorage.getItem('paymentMethod')
    if (sessionPaymentMethod) {
      setPaymentMethod(sessionPaymentMethod)
    }

    // Load Selected Categories
    const sessionSelectedCategories = sessionStorage.getItem(
      'selectedCategoriesNewOrder',
    )
    if (sessionSelectedCategories) {
      setSelectedCategories(JSON.parse(sessionSelectedCategories) as string[])
    }
  }, [products])

  // Grouped Products by Category (for search term and filter)
  const groupedProducts_filtered = products_filtered?.reduce(
    (groupMap, product) => {
      const key = product.category || 'Other'
      const group = groupMap[key] ?? []
      return {
        ...groupMap,
        [key]: [...group, product],
      }
    },
    {} as GroupedProducts,
  )

  // Const handleAddOrder. Only Local, no database
  const handleAddOrder = (
    product_id: number,
    quantity: number,
    productComment: string,
  ): void => {
    const existingItemIndex = dataOrderItems.findIndex(
      (item) => item.product_id === product_id,
    )

    // If item with same product_id and quantity exists, do nothing
    if (
      existingItemIndex !== -1 &&
      dataOrderItems[existingItemIndex]?.quantity === quantity
    ) {
      return
    }
    if (existingItemIndex !== -1) {
      // If item with same product_id but different quantity exists, update quantity
      setDataOrderItems((prevItems) => {
        const updatedItems = [...prevItems] // create a copy of the previous items
        const itemToUpdate = updatedItems[existingItemIndex]
        if (itemToUpdate) {
          itemToUpdate.quantity = quantity // update the quantity
        }
        sessionStorage.setItem('orderItems', JSON.stringify(updatedItems))
        return updatedItems // return the updated items
      })
    }
    // If item does not exist in orderItems, add new item
    if (existingItemIndex === -1) {
      const newOrderItem: OrderItem = {
        product_id: product_id,
        quantity: quantity,
        comment: productComment,
      }
      setDataOrderItems((prevDataOrderItems) => {
        const updatedItems = [...prevDataOrderItems, newOrderItem]
        // Add Item to OrderItems
        setSumOrderPrice(
          calcOrderPrice({
            dataOrderItems: updatedItems,
            products: products || [],
          }),
        )
        sessionStorage.setItem('orderItems', JSON.stringify(updatedItems))
        return updatedItems
      })
    }
  }

  // Delete Product from Orderlist
  const handleDeleteOrderItem = (product_id: number) => {
    const updatedOrderItems = dataOrderItems.filter(
      (item) => item.product_id !== product_id,
    )
    setDataOrderItems(() => {
      // Delete Item from OrderItems
      sessionStorage.setItem('orderItems', JSON.stringify(updatedOrderItems))
      return updatedOrderItems
    })
  }

  const { mutate: deleteOrder } = useDeleteOrderMutation()
  // Save Order
  const { mutate: saveOrder, isPending: loadingOrder } = useSaveOrderMutation()
  // Save OrderItems
  const { mutate: saveOrderItems, isPending: loadingOrderItems } =
    useSaveOrderItemsMutation()

  const handleSumitOrder = () => {
    // Save Order to Database

    let orderPrice: number = 0
    if (customPrice) {
      orderPrice = EuroToCents(customPriceValue)
    } else {
      orderPrice = sumOrderPrice
    }

    const uniqueCategories = getUniqueCategories(dataOrderItems, products || [])
    const uniqueProducts = getProductIds(dataOrderItems)

    saveOrder(
      {
        customer_name: orderName,
        comment: orderComment,
        payment_method: paymentMethod,
        price: orderPrice,
        status: 'waiting',
        categories: uniqueCategories,
        product_ids: uniqueProducts,
        table_number: tableNumber,
        order_number: orderNumber,
        // id: orderIdEdit ? parseInt(orderIdEdit) : undefined,
      },
      {
        onSuccess: (order) => {
          // If editOrder is true, then delete it before adding new Order
          if (orderIdEdit) {
            deleteOrder(parseInt(orderIdEdit))
          }

          // Increase Order Number if not edited
          if (!orderIdEdit) {
            updateAppData({
              key: 'order_number',
              value: orderNumber,
            })
          }

          const order_id = order[0]?.id
          if (order_id) {
            handleSaveOrderItems(order_id, orderNumber)
          }
        },
        onError: () => {
          // To DO! If Order Saved, but Failed to save OrderItmes, then Delete Order
          // const { mutate: deleteOrder } = useDeleteOrderMutation()
          // deleteOrder()
          toast({
            title: 'Bestellung konnte nicht gespeichert werden! ❌',
          })
        },
      },
    )

    handleResetOrder()
  }

  const handleResetOrder = () => {
    // Clear Data
    setDataOrderItems([])
    setCustomPrice(false)
    setCustomPriceValue('')
    setOrderComment('')
    setOrderName('')
    setPaymentMethod('cash')
    setSumOrderPrice(0)
    setTableNumber('')

    sessionStorage.setItem('orderItems', JSON.stringify([]))
    sessionStorage.setItem('orderComment', '')
    sessionStorage.setItem('orderName', '')
    sessionStorage.setItem('tableNumber', '')
    sessionStorage.setItem('paymentMethod', 'cash')
  }

  const handleSaveOrderItems = (order_id: number, orderNumber: string) => {
    // Map to get Product name and Price, because OrderItems only have product_id and price could change
    const orderItems = dataOrderItems.map((item) => {
      return {
        comment: item.comment,
        order_id: order_id,
        product_id: item.product_id,
        product_name:
          products?.find((product) => product.id === item.product_id)?.name ||
          'unkown',
        product_price:
          products?.find((product) => product.id === item.product_id)?.price ||
          0,
        quantity: item.quantity,
      }
    })

    saveOrderItems(orderItems, {
      onSuccess: () => {
        toast({
          title: 'Bestellnummer: ' + orderNumber + '! ✅',
          duration: 2000,
        })
      },
      onError: () => {
        toast({
          title: 'Bestellung konnte nicht gespeichert werden! ❌',
        })
      },
    })
  }

  const handleCustomPrice = (inputValue: string) => {
    inputValue = inputValue.replace(/\D/g, '')
    //remove any existing decimal
    const p = inputValue.replace(',', '')

    //get everything except the last 2 digits
    const l = p.substring(-2, p.length - 2)

    //get the last 2 digits
    const r = p.substring(p.length - 2, p.length)

    inputValue = l + ',' + r
    if (inputValue === ',') inputValue = ''
    setCustomPriceValue(inputValue)
  }

  const handleSetTableNumber = (tableNumber: string) => {
    setTableNumber(tableNumber)
  }

  // Handle CheckboxChange for Filter
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
          sessionStorage.setItem(
            'selectedCategoriesNewOrder',
            JSON.stringify(updated),
          )
          return updated
        })
      } else {
        setSelectedCategories(() => {
          const updated = selectedCategories.filter((item) => item !== value)
          sessionStorage.setItem(
            'selectedCategoriesNewOrder',
            JSON.stringify(updated),
          )
          return updated
        })
      }
    }
  }

  return (
    <div className="select-none">
      {/* <ProductDetails /> */}
      <div className="header sticky top-0 z-10 flex items-center bg-background pb-1 pt-2">
        <Input
          className="w-[100%]"
          placeholder="Produkt suchen"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        <Filters
          handleCheckboxChange={handleCheckboxChange}
          selectedCategories={selectedCategories}
        />
      </div>

      {/* Category and Product */}
      <div className="">
        {groupedProducts_filtered &&
          Object.entries(groupedProducts_filtered).map(
            ([category, products]) => (
              <div key={category} className="mt-4">
                <h2 className="w-full font-bold">{category}</h2>
                {/* Iterate over each product in the current category */}
                <ProductsInCategory
                  products={products}
                  dataOrderItems={dataOrderItems}
                  handleAddOrder={handleAddOrder}
                  handleDeleteOrderItem={handleDeleteOrderItem}
                />
              </div>
            ),
          )}
      </div>

      <div className="flex flex-col">
        {/* Comment Field */}
        <Textarea
          className="mt-2"
          placeholder="Kommentar (optional)"
          value={orderComment}
          onChange={(e) => {
            setOrderComment(e.target.value)
            sessionStorage.setItem('orderComment', e.target.value)
          }}
        ></Textarea>

        {/* Customer Name */}
        <Input
          className="mt-2"
          placeholder="Name (optional)"
          value={orderName}
          onChange={(e) => {
            setOrderName(e.target.value)
            sessionStorage.setItem('orderName', e.target.value)
          }}
        />

        {/* Table Number */}
        <Input
          className="mt-2"
          placeholder="Tischnummer (optional)"
          value={tableNumber}
          onChange={(e) => {
            handleSetTableNumber(e.target.value)
            sessionStorage.setItem('tableNumber', e.target.value)
          }}
        />

        {/* Payment Method */}
        <Label className="mt-2 font-bold">Bezahlung</Label>
        <RadioGroup
          value={paymentMethod}
          defaultValue={paymentMethod}
          className="mb-2 ml-1"
          onValueChange={(method) => {
            setPaymentMethod(method)
            sessionStorage.setItem('paymentMethod', method)
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="r1" />
            <Label htmlFor="r1">Bar</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cafe_card" id="r2" />
            <Label htmlFor="r2">Café Karte</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="r3" />
            <Label htmlFor="r3">Paypal</Label>
          </div>
        </RadioGroup>

        {/* Costs */}

        <div className="flex items-center">
          <Label className="w-min whitespace-nowrap rounded-lg border p-2 font-bold text-orange-600">
            Summe: {centsToEuro(sumOrderPrice)}€
          </Label>
          <OrderDetailsPage
            dataOrderItem={dataOrderItems}
            handleDeleteOrderItem={handleDeleteOrderItem}
            products={products || []}
            sumOrderPrice={sumOrderPrice}
          />
        </div>

        {/* Custom Price */}

        <div className="mt-2 flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={customPrice}
            onCheckedChange={() => {
              setCustomPrice(!customPrice)
            }}
          />
          <Label htmlFor="airplane-mode" className="font-bold">
            Kunde bezahlt abweichenden Preis
          </Label>
        </div>

        <Label className="mt-1">
          Da die Bezahlung auf Spendenbasis beruht, hat der Kunde das Recht,
          einen selbst bestimmten Betrag zu bezahlen. Ist das der Fall,
          aktiviere diese Checkbox.
        </Label>
        {/* Make Input field for custom number, if customer wants to pay custom price */}
        {customPrice && (
          <div className="mt-1">
            <Label htmlFor="custom-price" className="font-bold">
              Bezahlter Preis
            </Label>
            <Input
              className="mt-1"
              id="custom-price"
              type="string"
              value={customPriceValue}
              onChange={(e) => handleCustomPrice(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between">
          <Button
            className="mb-4 mt-2 w-min bg-amber-600"
            disabled={dataOrderItems.length === 0}
            onClick={handleSumitOrder}
          >
            {loadingOrder || loadingOrderItems ? (
              <Loader2Icon className="h-8 w-8 animate-spin" />
            ) : (
              'Absenden'
            )}{' '}
            <ShoppingCart className="ml-1 h-4 w-4"></ShoppingCart>
          </Button>

          <Button
            className=" ml-2 mt-2 w-min bg-amber-600"
            // disabled={dataOrderItems.length === 0}
            onClick={() => {
              handleResetOrder()
            }}
          >
            Reset
            <ArrowPathIcon className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewOrder
