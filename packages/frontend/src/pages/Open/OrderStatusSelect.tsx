import { Inventory, useChangeInventoryItemQuantity } from '@/data/useInventory'
import {
  Order,
  OrderItem,
  OrderStatus,
  useChageOrderStatusMutation,
} from '@/data/useOrders'
import { Product } from '@/data/useProducts'
import { getAllConsumptions } from '@/generalHelperFunctions/consumptionHelper'
import { supabase } from '@/services/supabase'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LoadingOverlay } from '@/components/LoadingOverlay'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const OrderStatusPage = ({
  order,
  productData,
  inventory,
  orderItems,
}: {
  order: Order
  productData: Product[] | undefined
  inventory: Inventory[] | undefined
  orderItems: OrderItem[] | null
}) => {
  // States
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status)
  const [loadingStock, setLoadingStock] = useState(false)

  // MiniFunctions
  const { toast } = useToast()

  // Mutations
  const { mutate: changeOrderStatus, isPending } = useChageOrderStatusMutation(
    order.id,
  )
  const { mutate: changeInventory, isPending: isPendingInventory } =
    useChangeInventoryItemQuantity()

  // Use Effect
  useEffect(() => {
    setOrderStatus(order.status)
  }, [order])

  // Handle Status Change
  const handleStatusChange = (newStatus: OrderStatus) => {
    // Call Consumption
    if (newStatus === 'finished' && inventory && productData && orderItems) {
      const consumptions = getAllConsumptions(orderItems, productData)
      changeInventory({ consumption: consumptions, inventory })

      // Update Stock for each product
      setLoadingStock(true)
      orderItems.forEach(async (orderItem) => {
        const product = productData.find(
          (product) => product.id === orderItem.product_id,
        )
        if (
          product &&
          product.stock !== null &&
          product.stock > 0 &&
          orderItem.quantity !== null
        ) {
          await supabase.rpc('update_product_stock', {
            product_id: product.id,
            quantity: -orderItem.quantity,
          })
        }
      })
      setLoadingStock(false)
    }

    changeOrderStatus(newStatus, {
      onSuccess: () => {
        if (inventory) {
          // changeInventory({consumption: order.consumption, inventory})
        }
        // toast({ title: 'Status erfolgreich geändert ✅', duration: 500 })
      },
      onError: () => {
        toast({ title: 'Fehler beim Ändern des Status ❌' })
      },
    })
  }

  return (
    <>
      <LoadingOverlay
        isLoading={isPending || isPendingInventory || loadingStock}
        message="Daten werden gespeichert..."
      />

      <Select
        onValueChange={(status: OrderStatus) => handleStatusChange(status)}
        defaultValue={orderStatus}
        value={orderStatus}
      >
        <SelectTrigger
          className={`ml-2 w-[140px] ${orderStatus === 'processing' ? 'bg-amber-600 text-white' : orderStatus === 'finished' ? 'bg-emerald-800 text-white' : ''}`}
        >
          <SelectValue placeholder="Wähle Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="waiting">
              {isPending ? <Loader2Icon className="animate-spin" /> : 'Warten'}
            </SelectItem>
            <SelectItem value="processing">
              {isPending || isPendingInventory ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                'In Bearbeitung'
              )}
            </SelectItem>
            <SelectItem value="ready">
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                'Abholbereit'
              )}
            </SelectItem>
            <SelectItem value="finished">
              {isPending || isPendingInventory || loadingStock ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                'Abgeschlossen'
              )}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}

export default OrderStatusPage
