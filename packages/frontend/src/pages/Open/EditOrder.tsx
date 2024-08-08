import { Edit2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const EditOrder = ({ orderId }: { orderId: number }) => {
  const navigate = useNavigate()

  return (
    <div>
      <Button variant="outline">
        <Edit2Icon
          onClick={() => {
            // Delete old Order
            navigate('/admin/new-order/edit/' + orderId.toString())
          }}
          className="h-5 w-5"
        />
      </Button>
    </div>
  )
}

export default EditOrder
