import {
  Order,
  OrderStatus,
  useChageOrderStatusMutation,
} from '@/data/useOrders'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const OrderStatusPage = ({ order }: { order: Order }) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status)
  const { mutate: changeOrderStatus, isPending } = useChageOrderStatusMutation(
    order.id,
  )
  const { toast } = useToast()

  const handleStatusChange = (newStatus: OrderStatus) => {
    setOrderStatus(newStatus)
    changeOrderStatus(newStatus, {
      onSuccess: () => {
        // toast({ title: 'Status erfolgreich geändert ✅', duration: 500 })
      },
      onError: () => {
        toast({ title: 'Fehler beim Ändern des Status ❌' })
      },
    })
  }

  return (
    <Select
      onValueChange={(status: OrderStatus) => handleStatusChange(status)}
      defaultValue={orderStatus}
    >
      <SelectTrigger
        className={`ml-2 w-[140px] ${orderStatus === 'processing' ? 'bg-amber-600 text-white' : orderStatus === 'finished' ? 'bg-emerald-800 text-white' : ''}`}
      >
        <SelectValue placeholder="Wähle Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="waiting">
            {isPending ? 'Loading...' : 'Warten'}
          </SelectItem>
          <SelectItem value="processing">
            {isPending ? 'Loading...' : 'In Bearbeitung'}
          </SelectItem>
          <SelectItem value="ready">
            {isPending ? 'Loading...' : 'Abholbereit'}
          </SelectItem>
          <SelectItem value="finished">
            {isPending ? 'Loading...' : 'Abgeschlossen'}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default OrderStatusPage
