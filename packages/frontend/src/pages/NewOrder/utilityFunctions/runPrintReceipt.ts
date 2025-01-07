import { Printer } from '@/data/usePrinter'
import { OrderItemWithVariations } from '@/lib/customTypes'
import { Json } from '@/services/supabase.types'

type printProps = {
  access_token: string
  printers: Printer[] | undefined
  payment_method: string
  ip: string
  port: string
  sumPriceOrder: string
  time: string
  orderNumber: string
  orderItems: OrderItemWithVariations[]
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
