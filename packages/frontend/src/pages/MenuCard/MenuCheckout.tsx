import { Product } from '@/data/useProducts'
import { loadSumUpScript } from '@/data/useSumUpWidget'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { supabase } from '@/services/supabase'
import { ArrowLeft, CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import { useMenuCart } from './MenuCartContext'
import { addTrackedOrder } from './orderTrackingStore'

declare global {
  interface Window {
    SumUpCard: {
      mount: (config: {
        id: string
        checkoutId: string
        onResponse: (type: string, body: Record<string, unknown>) => void
      }) => { unmount: () => void }
    }
  }
}

interface CheckoutResponse {
  checkout_id?: string
  checkout_reference?: string
  verified_price?: number
  error?: string
}

interface VerifyResponse {
  success?: boolean
  order_id?: number
  order_number?: string
  error?: string
}

type CheckoutState = 'creating' | 'paying' | 'verifying' | 'success' | 'error'

const MenuCheckout = ({
  products,
  customerName,
  onBack,
}: {
  products: Product[]
  customerName: string
  onBack: () => void
}) => {
  const { items, clearCart, totalPrice } = useMenuCart()
  const navigate = useNavigate()
  const [state, setState] = useState<CheckoutState>('creating')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const widgetRef = useRef<{ unmount: () => void } | null>(null)
  const checkoutIdRef = useRef<string | null>(null)
  const mountedRef = useRef(true)

  const total = totalPrice(products)

  const buildOrderItems = useCallback(() => {
    return items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      extras: item.extras.map((e) => ({
        id: e.id,
        name: e.name,
        price: e.price,
        quantity: e.quantity ?? 1,
      })),
      option: item.option
        ? {
            id: item.option.id,
            name: item.option.name,
            price: item.option.price,
          }
        : null,
    }))
  }, [items])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      widgetRef.current?.unmount()
    }
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    const initCheckout = async () => {
      try {
        setState('creating')

        // 1. Create checkout server-side (price calculated on server)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data, error } =
          await supabase.functions.invoke<CheckoutResponse>(
            'sumup-create-online-checkout',
            { body: { order_items: buildOrderItems() } },
          )

        if (error || !data?.checkout_id) {
          throw new Error(
            data?.error ?? 'Checkout konnte nicht erstellt werden',
          )
        }

        if (!mountedRef.current) return

        checkoutIdRef.current = data.checkout_id

        // 2. Load SumUp Card Widget script
        await loadSumUpScript()
        if (!mountedRef.current) return

        setState('paying')
      } catch (err) {
        if (!mountedRef.current) return
        setState('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'Unbekannter Fehler',
        )
      }
    }

    void initCheckout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mount SumUp widget after DOM element is rendered
  useEffect(() => {
    if (state !== 'paying' || !checkoutIdRef.current) return

    const checkoutId = checkoutIdRef.current
    const timerId = setTimeout(() => {
      if (!mountedRef.current) return
      widgetRef.current = window.SumUpCard.mount({
        id: 'sumup-card-widget',
        checkoutId,
        onResponse: (type, body) => {
          if (!mountedRef.current) return

          if (type === 'success') {
            void handlePaymentSuccess()
          } else if (type === 'error' || type === 'fail') {
            setState('error')
            setErrorMessage(
              (body?.message as string) ?? 'Zahlung fehlgeschlagen',
            )
          }
        },
      })
    }, 0)

    return () => clearTimeout(timerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const handlePaymentSuccess = async () => {
    try {
      setState('verifying')

      // 4. Verify payment + create order server-side
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, error } = await supabase.functions.invoke<VerifyResponse>(
        'sumup-verify-create-order',
        {
          body: {
            checkout_id: checkoutIdRef.current,
            order_items: buildOrderItems(),
            customer_name: customerName || undefined,
          },
        },
      )

      if (error || !data?.success) {
        throw new Error(
          data?.error ?? 'Bestellung konnte nicht bestätigt werden',
        )
      }

      if (!mountedRef.current) return

      setOrderNumber(data.order_number ?? '')

      // Store order for tracking
      if (data.order_id && data.order_number) {
        addTrackedOrder({
          orderId: data.order_id,
          orderNumber: data.order_number,
          createdAt: new Date().toISOString(),
        })
      }

      // Request notification permission
      if (
        typeof Notification !== 'undefined' &&
        Notification.permission === 'default'
      ) {
        void Notification.requestPermission()
      }

      clearCart()
      setState('success')
    } catch (err) {
      if (!mountedRef.current) return
      setState('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Verifizierung fehlgeschlagen',
      )
    }
  }

  const handleRetry = () => {
    setErrorMessage('')
    widgetRef.current?.unmount()
    widgetRef.current = null
    checkoutIdRef.current = null
    // Re-trigger the checkout flow by remounting
    setState('creating')
    window.location.reload()
  }

  return (
    <div className="bg-background/95 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Creating checkout */}
        {state === 'creating' && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
            <p className="text-lg">Checkout wird erstellt...</p>
            <p className="text-muted-foreground text-sm">
              {centsToEuro(total)} €
            </p>
          </div>
        )}

        {/* Payment widget */}
        {state === 'paying' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Zurück
              </Button>
              <p className="text-lg font-bold">{centsToEuro(total)} €</p>
            </div>
            <div id="sumup-card-widget" className="min-h-[300px]" />
          </div>
        )}

        {/* Verifying */}
        {state === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
            <p className="text-lg">Zahlung wird überprüft...</p>
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
            <h2 className="text-2xl font-bold">Zahlung erfolgreich!</h2>
            {orderNumber && (
              <p className="text-lg">
                Bestellnummer: <strong>#{orderNumber}</strong>
              </p>
            )}
            <p className="text-muted-foreground">
              Deine Bestellung wird vorbereitet.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={() => navigate('/menu/orders')}>
                Bestellung verfolgen
              </Button>
              <Button variant="outline" onClick={onBack}>
                Zurück zur Menükarte
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <XCircle className="text-destructive h-16 w-16" />
            <h2 className="text-xl font-bold">Fehler</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                Zurück
              </Button>
              <Button onClick={handleRetry}>Erneut versuchen</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuCheckout
