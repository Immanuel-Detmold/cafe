import {
  Order,
  OrderStatus,
  useChageOrderStatusMutation,
} from '@/data/useOrders'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  // const [orderStatusName, setOrderStatusName] = useState<string>('')

  const { mutate: changeOrderStatus, isPending } = useChageOrderStatusMutation(
    order.id,
  )

  useEffect(() => {
    setOrderStatus(order.status)
  }, [order])

  const { toast } = useToast()

  const handleStatusChange = (newStatus: OrderStatus) => {
    // setOrderStatus(newStatus)
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
            {isPending ? (
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
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              'Abgeschlossen'
            )}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default OrderStatusPage
