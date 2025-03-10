import { queryClient } from '@/App'
import { PAYMENT_METHODS } from '@/data/data'
import { useAppData, useUpdateAppData } from '@/data/useAppData'
import { useInventory } from '@/data/useInventory'
import {
  useDeleteOrderMutation,
  useOrdersAndItemsQueryV2,
  useSaveOrderItemsMutation,
  useSaveOrderMutation,
  useSingleOrder,
} from '@/data/useOrders'
import { usePrintersQuery } from '@/data/usePrinter'
import { useProductCategories } from '@/data/useProductCategories'
import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'
import { useUser } from '@/data/useUser'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions/currencyHelperFunction'
import {
  currentDateAndTime,
  getEndOfDayToday,
  getStartOfDayToday,
} from '@/generalHelperFunctions/dateHelperFunctions'
import {
  ProductExtra,
  ProductWithVariations,
  Variation,
} from '@/lib/customTypes'
import { supabase } from '@/services/supabase'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { Loader2Icon, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import Filters from './Filters'
import OrderDetailsPage from './OrderDetailsPage'
import ProductsInCategory from './ProductsInCategory'
import { groupProductsToCategories } from './utilityFunctions/groupProductsToCategories'
import {
  GetOrderNumber,
  calcOrderPrice,
  calcSingleOrderItemPrice,
  getProductIds,
  getUniqueCategories,
} from './utilityFunctions/handleOrder'
import { runPrintReceipt } from './utilityFunctions/runPrintReceipt'

export type GroupedProducts = {
  [key: string]: Product[]
}

export type ProductOrder = {
  id: string
  product_id: number
  quantity: number
  comment: string
  extras: ProductExtra[]
  option: Variation | null
}

const NewOrder = () => {
  const [dataOrderItems, setDataOrderItems] = useState<ProductOrder[]>([])
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
  const [printReceipt, setPrintReceipt] = useState<boolean>(true)

  // For Receipt
  const [orgName, setOrgName] = useState('')
  const [orgLogo, setOrgLogo] = useState('')
  const [menuLink, setMenuLink] = useState('')

  // Print States
  const { access_token } = useUser()
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')
  const [loadingPrint, setLoadingPrint] = useState(false)

  // Add filter to NewOrder Page
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // For Edit Order --- Get OrderId from URL
  const [orderIdEdit, setOrderIdEdit] = useState<string>()
  // -------------------------------------
  // Hooks
  const { orderId } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useUser()

  // Data & Mutate
  const { data: appData } = useAppData()
  const { data: inventoryData } = useInventory()
  const { mutate: updateAppData } = useUpdateAppData()
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
    only_advertisement_screen: false,
    paused: false,
  })
  const { data: products_filtered } = useProductsQuery({
    searchTerm: searchTerm,
    ascending: true,
    categories: selectedCategories,
    only_advertisement_screen: false,
    paused: false,
  })
  const { data: dataCategories } = useProductCategories()
  const { data: printers } = usePrintersQuery()

  const { data: openOrders } = useOrdersAndItemsQueryV2({
    statusList: ['waiting', 'processing', 'ready'],
    startDate: getStartOfDayToday().finalDateString,
    endDate: getEndOfDayToday().endOfDayString,
  })

  if (error) {
    toast({ title: 'Fehler beim Laden der Produkte! ❌' })
  }

  // Realtime for Inventory, Product changes. Other Realtime functions are in supabase.ts.
  supabase
    .channel('inventory-db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Inventory' },
      () => {
        void queryClient.invalidateQueries({ queryKey: ['inventory'] })
      },
    )
    .subscribe()
  supabase
    .channel('products-db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Products' },
      () => {
        void queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    )
    .subscribe()

  // Load Order from Database if Edit Order ---
  const { data: editData } = useSingleOrder({
    orderId: orderId,
  })

  // Load Data if Edit Order
  useEffect(() => {
    if (editData) {
      editData.comment && setOrderComment(editData.comment)
      editData.customer_name && setOrderName(editData.customer_name)
      editData.payment_method && setPaymentMethod(editData.payment_method)
      editData.table_number && setTableNumber(editData.table_number)
      setOrderNumber(editData.order_number)

      const orderItems: ProductOrder[] = editData.OrderItems.map((item) => ({
        ...item,
        id: Math.random().toString(36).substring(2, 8),
        comment: item.comment ?? '',
        extras: item.extras as ProductExtra[],
        option: item.option as Variation,
      }))

      setDataOrderItems(orderItems)

      // Get Sum Price of orderItems and check if eiditData.Price is the same, if not set custom price
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

  // Redirect to login if not user
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
      }, 500) // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer) // Cleanup the timer if the component unmounts or user changes
    }
  }, [user, navigate])

  // Update Order Price
  useEffect(() => {
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
        ? (JSON.parse(sessionData) as ProductOrder[])
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

  useEffect(() => {
    // Set orderIdEdit to orderId if it exists, otherwise set to undefined
    setOrderIdEdit(orderId || undefined)
  }, [orderId])

  // Initialize a new object to group the products by category
  let groupedProducts_filtered = undefined
  if (dataCategories && products_filtered) {
    groupedProducts_filtered = groupProductsToCategories(
      dataCategories,
      products_filtered,
    )
  }

  // Const handleAddOrder. Only Local, no database TODO
  const handleAddOrder = (
    product_id: number,
    quantity: number,
    productComment: string,
    selectedOption: Variation | null,
    selectExtras: ProductExtra[] | [],
  ): void => {
    const newOrderItem = {
      id: Math.random().toString(36).substring(2, 8),
      product_id: product_id,
      quantity: quantity,
      comment: productComment,
      extras: selectExtras,
      option: selectedOption,
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

  // Delete Product from Orderlist
  const handleDeleteOrderItem = (id: string) => {
    // Filter out any item whose 'id' matches the provided parameter
    const updatedOrderItems = dataOrderItems.filter((item) => item.id !== id)

    // Update the state and session storage
    setDataOrderItems(() => {
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

  const handleSubmitOrder = () => {
    // Save Order to Database

    let orderPrice: number = 0
    if (customPrice) {
      orderPrice = EuroToCents(customPriceValue)
    } else {
      orderPrice = sumOrderPrice
    }

    // Get Unique Categories and Products
    const uniqueCategories = getUniqueCategories(dataOrderItems, products || [])
    const uniqueProducts = getProductIds(dataOrderItems)

    // Create OrderItems for Receipt
    const orderItems = dataOrderItems.map((item) => {
      const current_product = products?.find(
        (product) => product.id === item.product_id,
      )
      return {
        comment: item.comment,
        order_id: 'unkown',
        product_id: item.product_id,
        product_name: current_product?.name || 'unkown',
        order_price: calcSingleOrderItemPrice(item, current_product),
        quantity: item.quantity,
        category: current_product?.category || 'unkown',
        extras: item.extras,
        option: item.option,
      }
    })

    // Print only if Switch is ON
    {
      printReceipt && setLoadingPrint(true)
    }
    {
      printReceipt &&
        runPrintReceipt({
          printers: printers,
          payment_method: paymentMethod,
          ip: ip,
          port: port,
          access_token: access_token ?? '',
          sumPriceOrder: centsToEuro(orderPrice),
          time: currentDateAndTime(),
          orderNumber,
          orderItems: orderItems,
          organisation_name: orgName,
          organisation_logo: orgLogo,
          menu_link: menuLink,
        })
          .then(() => {
            setLoadingPrint(false)
          })
          .catch(() => {
            setLoadingPrint(false)
            toast({
              title: 'Keine Verbindung zum Server (Drucker/Audio)',
              duration: 2000,
            })
          })
    }
    // Create Order Object
    const orderData = {
      customer_name: orderName,
      comment: orderComment,
      payment_method: paymentMethod,
      price: orderPrice,
      status: 'waiting' as const,
      categories: uniqueCategories,
      product_ids: uniqueProducts,
      table_number: tableNumber,
      order_number: orderNumber,
      custom_price: customPrice,
    }

    saveOrder(orderData, {
      onSuccess: (order) => {
        // If editOrder is true, then delete it before adding new Order
        if (orderIdEdit) {
          deleteOrder(parseInt(orderIdEdit))
        }

        // Increase Order Number if not edited
        if (!orderIdEdit) {
          updateAppData(
            {
              key: 'order_number',
              value: orderNumber,
            },
            {
              onSuccess: (data) => {
                if (data.length > 0 && data[0]?.key == 'order_number') {
                  setOrderNumber(data[0]?.value || '1')
                }
              },
            },
          )
        }

        const order_id = order[0]?.id
        if (order_id) {
          handleSaveOrderItems(order_id, orderNumber)
        }
      },
      onError: (error) => {
        // To DO! If Order Saved, but Failed to save OrderItmes, then Delete Order
        // const { mutate: deleteOrder } = useDeleteOrderMutation()
        // deleteOrder()
        toast({
          title: 'Bestellung konnte nicht gespeichert werden! ❌',
          description: error.message,
        })
      },
    })

    handleResetOrder()
    // setOrderIdEdit(undefined)
    navigate('/admin/new-order')
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
      const current_product = products?.find(
        (product) => product.id === item.product_id,
      )
      return {
        comment: item.comment,
        order_id: order_id,
        product_id: item.product_id,
        product_name: current_product?.name || 'unkown',
        order_price: calcSingleOrderItemPrice(item, current_product),
        quantity: item.quantity,
        option: item.option,
        extras: item.extras,
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

  // Load AppData for IP and Port
  useEffect(() => {
    const serverIpData = appData?.find((item) => item.key === 'server_ip')
    const serverPortData = appData?.find((item) => item.key === 'server_port')
    const print_on = appData?.find((item) => item.key === 'print_mode')
    const name = appData?.find((item) => item.key === 'organisation_name')
    const logo = appData?.find((item) => item.key === 'organisation_logo')
    const link = appData?.find((item) => item.key === 'menu_link')

    if (serverIpData) setIp(serverIpData.value)
    if (serverPortData) setPort(serverPortData.value)
    if (name) setOrgName(name.value)
    if (logo) setOrgLogo(logo.value)
    if (link) setMenuLink(link.value)

    if (print_on) {
      if (print_on.value === 'true') {
        setPrintReceipt(true)
      } else {
        setPrintReceipt(false)
      }
    }
  }, [appData])

  return (
    <div className="select-none">
      {/* <ProductDetails /> */}
      <div className="header bg-background sticky top-0 z-10 flex items-center pb-1 pt-2">
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

      {/* Shopping Cart Icon */}
      <div className="sticky top-16 z-30 float-right -mt-12 mr-4">
        <OrderDetailsPage
          dataOrderItems={dataOrderItems}
          handleDeleteOrderItem={handleDeleteOrderItem}
          products={products || []}
          sumOrderPrice={sumOrderPrice}
          onlyCart={true}
        />
      </div>

      {/* Category and Product */}
      <div className="relative">
        {groupedProducts_filtered &&
          Object.entries(groupedProducts_filtered).map(
            ([category, products]) => (
              <div key={category} className="mt-4">
                <h2 className="w-full font-bold">{category}</h2>
                {/* Iterate over each product in the current category */}
                <ProductsInCategory
                  products={products as ProductWithVariations[]}
                  dataOrderItems={dataOrderItems}
                  handleAddOrder={handleAddOrder}
                  InventoryData={inventoryData}
                  openOrders={openOrders ?? []}
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
          {PAYMENT_METHODS.map((method, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={method.name} id={`r${index + 1}`} />
              <Label htmlFor={`r${index + 1}`}>{method.label}</Label>
            </div>
          ))}
        </RadioGroup>

        {/* Costs */}

        <div className="flex items-center">
          <Label className="w-min whitespace-nowrap rounded-lg border p-2 font-bold text-orange-600">
            Summe: {centsToEuro(sumOrderPrice)}€
          </Label>
          <OrderDetailsPage
            dataOrderItems={dataOrderItems}
            handleDeleteOrderItem={handleDeleteOrderItem}
            products={products || []}
            sumOrderPrice={sumOrderPrice}
            onlyCart={false}
          />
        </div>

        {/* Printing Receipt */}
        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="print-receipt"
            checked={printReceipt}
            onCheckedChange={() => {
              setPrintReceipt(!printReceipt)
            }}
          />
          <Label htmlFor="airplane-mode" className="font-bold">
            Kassenbon drucken
          </Label>
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

        {/* Send & Reset Button */}
        <div className="flex justify-between">
          <Button
            className="mb-4 mt-2 w-min bg-amber-600"
            disabled={dataOrderItems.length === 0}
            onClick={handleSubmitOrder}
          >
            {loadingOrder || loadingOrderItems || loadingPrint ? (
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
