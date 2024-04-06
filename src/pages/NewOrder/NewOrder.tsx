import {
  OrderItem,
  useSaveOrderItemsMutation,
  useSaveOrderMutation,
} from '@/data/useOrders'
import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import OrderDetailsPage from './OrderDetailsPage'
import ProductsInCategory from './ProductsInCategory'
import { calcOrderPrice } from './utilityFunctions/handleOrder'

type GroupedProducts = Record<string, Product[]>

const NewOrder = () => {
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })
  if (error) {
    console.log(error)
  }

  const [dataOrderItems, setDataOrderItems] = useState<OrderItem[]>([])
  const [sumOrderPrice, setSumOrderPrice] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')
  // Abweichender Preis:
  const [customPrice, setCustomPrice] = useState<boolean>(false)
  // customPriceValue muss ein String sein, damit das Input Feld leer sein kann
  const [customPriceValue, setCustomPriceValue] = useState<string>('')
  const [orderComment, setOrderComment] = useState<string>('')
  const [orderName, setOrderName] = useState<string>('')
  const { toast } = useToast()

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
      let sessionData2: OrderItem[] = []
      if (sessionData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sessionData2 = JSON.parse(sessionData)
      } else {
        sessionData2 = []
      }
      console.log('Loaded dataOrderItems from Cache:', sessionData2)
      setDataOrderItems(sessionData2)
    }
  }, [products])

  // Grouped Products by Category
  const groupedProducts = products?.reduce((groupMap, product) => {
    const key = product.category || 'Other'
    const group = groupMap[key] ?? []
    return {
      ...groupMap,
      [key]: [...group, product],
    }
  }, {} as GroupedProducts)

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
      console.log('Item with same quantity already in order:', dataOrderItems)
    }
    // If item with same product_id but different quantity exists, update quantity
    if (existingItemIndex !== -1) {
      setDataOrderItems((prevItems) => {
        const updatedItems = [...prevItems] // create a copy of the previous items
        const itemToUpdate = updatedItems[existingItemIndex]
        if (itemToUpdate) {
          itemToUpdate.quantity = quantity // update the quantity
          console.log('Updated Item in Order:', updatedItems)
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
        console.log('Added Item to Order:', updatedItems)
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
      console.log('Deleted Item in Orders:', updatedOrderItems)
      sessionStorage.setItem('orderItems', JSON.stringify(updatedOrderItems))
      return updatedOrderItems
    })
  }

  // Save Order
  const { mutate: saveOrder } = useSaveOrderMutation()
  // Save OrderItems
  const { mutate: saveOrderItems } = useSaveOrderItemsMutation()

  const handleSumitOrder = () => {
    // Save Order to Database

    let orderPrice: number = 0
    if (customPrice) {
      orderPrice = parseFloat(customPriceValue)
    } else {
      orderPrice = sumOrderPrice
    }

    saveOrder(
      {
        customer_name: orderName,
        comment: orderComment,
        payment_method: paymentMethod,
        price: orderPrice,
        status: 'waiting',
      },
      {
        onSuccess: (data) => {
          console.log('Order saved on Success!', data)
          const order_id = data[0]?.id
          if (order_id) {
            handleSaveOrderItems(order_id)
          }
        },
        onError: (error) => {
          console.log('Error saving Order:', error)
          // To DO! If Order Saved, but Failed to save OrderItmes, then Delete Order
          // const { mutate: deleteOrder } = useDeleteOrderMutation()
          // deleteOrder()
          toast({
            title: 'Bestellung konnte nicht gespeichert werden! ❌',
          })
        },
      },
    )

    // Clear Data
    setDataOrderItems([])
    setCustomPrice(false)
    setCustomPriceValue('')
    setOrderComment('')
    setOrderName('')
    setPaymentMethod('cash')
    setSumOrderPrice(0)

    sessionStorage.setItem('orderItems', JSON.stringify([]))
  }

  const handleSaveOrderItems = (order_id: number) => {
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

    console.log(orderItems)
    saveOrderItems(orderItems, {
      onSuccess: (data) => {
        console.log('OrderItems saved on Success!', data)
        toast({
          title: 'Bestellung wurde gespeichert! ✅',
        })
      },
      onError: (error) => {
        console.log('Error saving OrderItems:', error)
        toast({
          title: 'Bestellung konnte nicht gespeichert werden! ❌',
        })
      },
    })
  }

  return (
    <div className="select-none">
      {/* Category and Product */}
      <div className="mt-2">
        {groupedProducts &&
          Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="flex flex-col">
              <h2 className="w-full font-bold">{category}</h2>
              {/* Iterate over each product in the current category */}
              <ProductsInCategory
                products={products}
                dataOrderItems={dataOrderItems}
                handleAddOrder={handleAddOrder}
                handleDeleteOrderItem={handleDeleteOrderItem}
              />
            </div>
          ))}
      </div>

      <div className="flex flex-col">
        {/* Comment Field */}
        <Textarea
          className="mt-2"
          placeholder="Kommentar (optional)"
          value={orderComment}
          onChange={(e) => {
            setOrderComment(e.target.value)
          }}
        ></Textarea>

        {/* Customer Name */}
        <Input
          className="mt-2"
          placeholder="Name (optional)"
          value={orderName}
          onChange={(e) => {
            setOrderName(e.target.value)
          }}
        />

        {/* Payment Method */}
        <Label className="mt-2 font-bold">Bezahlung</Label>
        <RadioGroup
          defaultValue={paymentMethod}
          className="mb-2 ml-1"
          onValueChange={setPaymentMethod}
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
            Summe: {sumOrderPrice}€
          </Label>
          <OrderDetailsPage
            dataOrderItem={dataOrderItems}
            handleDeleteOrderItem={handleDeleteOrderItem}
            products={products || []}
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
              type="number"
              value={customPriceValue}
              onChange={(e) => setCustomPriceValue(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4 flex justify-between">
          <Button
            className="mb-4 mt-2 w-min bg-amber-600"
            disabled={dataOrderItems.length === 0}
            onClick={handleSumitOrder}
          >
            Absenden <ShoppingCart className="ml-1 h-4 w-4"></ShoppingCart>
          </Button>

          <Button
            className=" ml-2 mt-2 w-min bg-amber-600"
            disabled={dataOrderItems.length === 0}
            onClick={() => {
              setDataOrderItems([])
              setCustomPrice(false)
              setCustomPriceValue('')
              setOrderComment('')
              setOrderName('')
              setPaymentMethod('cash')
              setSumOrderPrice(0)
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
