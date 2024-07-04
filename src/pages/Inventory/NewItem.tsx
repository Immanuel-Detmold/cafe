import { Label } from '@radix-ui/react-label'
import { SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const NewItem = () => {
  const navigate = useNavigate()

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [comment, setComment] = useState('')
  const params = useParams()
  console.log(params)

  // Handle form submission
  const handleSubmit = () => {
    // Implement submission logic here
    console.log({ name, category, quantity, comment })
    // Navigate back or to another page upon successful submission
    navigate('/admin/inventory')
  }

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="mt-2 flex flex-col">
          <Label htmlFor="name" className="font-bold">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            placeholder="Item Name"
          />

          <Label htmlFor="category" className="mt-4 font-bold">
            Kategorie
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1"
            placeholder="Item Kategorie"
          />

          <Label htmlFor="quantity" className="mt-4 font-bold">
            Anzahl
          </Label>
          <Input
            id="quantity"
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1"
            placeholder="Item Anzahl"
          />

          <Label htmlFor="comment" className="mt-4 font-bold">
            Kommentar
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1"
            placeholder="Zusätzlicher Kommentar"
          ></Textarea>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>
            <div className="flex items-center">
              Speichern <SaveIcon className="ml-1" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewItem
