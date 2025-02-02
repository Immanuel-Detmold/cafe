import { Printer } from '@/data/usePrinter'
import { ProductExtra, Variation } from '@/lib/customTypes'
import { Json } from '@/services/supabase.types'

type OrderItem = {
  comment: string
  order_id: string
  product_id: number
  product_name: string
  order_price: number
  quantity: number
  category: string
  option: Variation | null
  extras: ProductExtra[]
}

type printProps = {
  access_token: string
  printers: Printer[] | undefined
  payment_method: string
  ip: string
  port: string
  sumPriceOrder: string
  time: string
  orderNumber: string
  orderItems: OrderItem[]
  organisation_name: string
  organisation_logo: string
  menu_link: string
}

export const runPrintReceipt = async (props: printProps) => {
  const requestURL = `${props.ip}/print-receipt`
  try {
    const response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.access_token}`,
      },
      body: JSON.stringify(props),
    })

    if (response.ok) {
      ;(await response.json()) as Json
      console.log('Server Reached')
      return 'Server reached'
    } else {
      throw 'Keine Verbindung zum Server (Drucker/Audio)'
    }
  } catch (error) {
    throw 'Keine Verbindung zum Server (Drucker/Audio)'
  }
}
