import { OrderStatus } from '@/data/useOrders'
import { supabase } from '@/services/supabase'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Bell,
  BellOff,
  Clock,
  Flame,
  PartyPopper,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  TrackedOrder,
  getTrackedOrders,
  pruneExpiredOrders,
  removeTrackedOrder,
} from './orderTrackingStore'

type TrackedOrderWithStatus = TrackedOrder & {
  status: OrderStatus
  items: { product_name: string; quantity: number }[]
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  waiting: {
    label: 'Warten',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <Clock className="h-4 w-4" />,
  },
  processing: {
    label: 'In Bearbeitung',
    className: 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse',
    icon: <Flame className="h-4 w-4" />,
  },
  ready: {
    label: 'Bereit zur Abholung!',
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: <PartyPopper className="h-4 w-4" />,
  },
  finished: {
    label: 'Abgeholt',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Clock className="h-4 w-4" />,
  },
}

const useTrackedOrdersQuery = (trackedOrders: TrackedOrder[]) => {
  const orderIds = trackedOrders.map((o) => o.orderId)
  return useQuery({
    queryKey: ['trackedOrders', orderIds],
    queryFn: async () => {
      if (orderIds.length === 0) return []

      const { data: orders, error: ordersError } = await supabase
        .from('Orders')
        .select('id, order_number, status')
        .in('id', orderIds)

      if (ordersError) throw ordersError
      if (!orders?.length) return []

      const { data: items, error: itemsError } = await supabase
        .from('OrderItems')
        .select('order_id, product_name, quantity')
        .in(
          'order_id',
          orders.map((o) => o.id),
        )

      if (itemsError) throw itemsError

      return trackedOrders
        .map((tracked) => {
          const order = orders.find((o) => o.id === tracked.orderId)
          if (!order) return null
          return {
            ...tracked,
            status: order.status,
            items: (items ?? [])
              .filter((i) => i.order_id === order.id)
              .map((i) => ({
                product_name: i.product_name,
                quantity: i.quantity,
              })),
          } satisfies TrackedOrderWithStatus
        })
        .filter(Boolean) as TrackedOrderWithStatus[]
    },
    enabled: orderIds.length > 0,
    refetchInterval: 30000,
  })
}

const OrderTracking = () => {
  const queryClient = useQueryClient()
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>(() => {
    pruneExpiredOrders()
    return getTrackedOrders()
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () =>
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted',
  )
  const prevStatusesRef = useRef<Record<number, OrderStatus>>({})

  const { data: orders, isLoading } = useTrackedOrdersQuery(trackedOrders)

  // Realtime subscription for live updates
  useEffect(() => {
    if (trackedOrders.length === 0) return

    const channel = supabase
      .channel('menu-order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Orders',
        },
        (payload) => {
          const updatedId = payload.new.id as number
          if (trackedOrders.some((o) => o.orderId === updatedId)) {
            void queryClient.invalidateQueries({
              queryKey: ['trackedOrders'],
            })
          }
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [trackedOrders, queryClient])

  // Fire browser notification when order becomes "ready"
  useEffect(() => {
    if (!orders) return

    for (const order of orders) {
      const prev = prevStatusesRef.current[order.orderId]
      if (prev && prev !== 'ready' && order.status === 'ready') {
        if (
          typeof Notification !== 'undefined' &&
          Notification.permission === 'granted'
        ) {
          new Notification(`Bestellung #${order.orderNumber} ist bereit! 🎉`, {
            body: 'Deine Bestellung kann abgeholt werden.',
            icon: '/cafe/favicon.ico',
          })
        }
      }
      prevStatusesRef.current[order.orderId] = order.status
    }
  }, [orders])

  const handleRequestNotifications = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotificationsEnabled(result === 'granted')
  }, [])

  const handleRemoveOrder = (orderId: number) => {
    removeTrackedOrder(orderId)
    setTrackedOrders(getTrackedOrders())
  }

  const activeOrders = orders?.filter((o) => o.status !== 'finished')
  const finishedOrders = orders?.filter((o) => o.status === 'finished')

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/menu">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Menükarte
          </Button>
        </Link>
        <h1 className="cinzel-decorative-bold text-xl">Meine Bestellungen</h1>
      </div>

      {/* Live indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          Live-Updates aktiv
        </div>

        {/* Notification toggle */}
        {typeof Notification !== 'undefined' &&
          Notification.permission !== 'denied' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleRequestNotifications()}
              className="gap-1.5 text-sm"
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="h-4 w-4 text-green-600" />
                  Benachrichtigung an
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4" />
                  Benachrichtigung aus
                </>
              )}
            </Button>
          )}
      </div>

      {/* Empty state */}
      {trackedOrders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Clock className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            Keine aktiven Bestellungen vorhanden.
          </p>
          <Link to="/menu">
            <Button>Zur Menükarte</Button>
          </Link>
        </div>
      )}

      {/* Loading */}
      {isLoading && trackedOrders.length > 0 && (
        <div className="flex justify-center py-12">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      )}

      {/* Active orders */}
      {activeOrders && activeOrders.length > 0 && (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onRemove={handleRemoveOrder}
            />
          ))}
        </div>
      )}

      {/* Finished orders */}
      {finishedOrders && finishedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-muted-foreground mb-3 text-sm font-medium">
            Abgeholte Bestellungen
          </h2>
          <div className="space-y-3 opacity-60">
            {finishedOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onRemove={handleRemoveOrder}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const OrderCard = ({
  order,
  onRemove,
}: {
  order: TrackedOrderWithStatus
  onRemove: (id: number) => void
}) => {
  const config = STATUS_CONFIG[order.status]
  const isReady = order.status === 'ready'

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-all ${
        isReady
          ? 'border-green-300 bg-green-50 ring-2 ring-green-200 dark:border-green-700 dark:bg-green-950'
          : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">#{order.orderNumber}</span>
          <Badge variant="outline" className={`gap-1 ${config.className}`}>
            {config.icon}
            {config.label}
          </Badge>
        </div>
        {order.status === 'finished' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => onRemove(order.orderId)}
          >
            Entfernen
          </Button>
        )}
      </div>

      {/* Items */}
      {order.items.length > 0 && (
        <div className="mt-3 space-y-1">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="text-muted-foreground flex justify-between text-sm"
            >
              <span>{item.product_name}</span>
              <span>×{item.quantity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ready celebration */}
      {isReady && (
        <div className="mt-3 rounded-lg bg-green-100 p-3 text-center text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          🎉 Deine Bestellung ist bereit zur Abholung!
        </div>
      )}
    </div>
  )
}

export default OrderTracking
