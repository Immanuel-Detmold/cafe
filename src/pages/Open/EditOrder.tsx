import { EditIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const EditOrder = () => {
  return (
    <div>
      <Button variant="outline" disabled={true}>
        <EditIcon className="" />
      </Button>
    </div>
  )
}

export default EditOrder
