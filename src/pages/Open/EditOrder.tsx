import { EditIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const EditOrder = ({ orderId }: { orderId: number }) => {
  const navigate = useNavigate()

  return (
    <div>
      <Button variant="outline">
        <EditIcon
          onClick={() => {
            // Delete old Order
            navigate('/admin/new-order/edit/' + orderId.toString())
          }}
          className=""
        />
      </Button>
    </div>
  )
}

export default EditOrder
