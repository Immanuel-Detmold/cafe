import { CheckIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const ExampleData = () => {
  const placeHolderImage =
    'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/PlaceHolder.jpg?t=2024-03-14T12%3A07%3A02.697Z'
  return (
    <div>
      <h2 className="w-full font-bold">Example Data</h2>
      <Button variant="outline" className="h-14">
        <Avatar className="">
          <AvatarImage src={placeHolderImage} />
        </Avatar>
        <Label className="ml-1">Coffee (3€)</Label>
      </Button>

      <Button variant="outline" className="h-14">
        <Avatar className="">
          <AvatarImage src={placeHolderImage} />
        </Avatar>
        <Label className="ml-1">Capuuccino (3€)</Label>
        <CheckIcon className="ml-1 h-4 w-4 text-green-700" />
      </Button>

      <Button variant="outline" className="h-14">
        <Avatar className="">
          <AvatarImage src={placeHolderImage} />
        </Avatar>
        <Label className="ml-1">Tee (3€)</Label>
        <Label className="ml-1 text-green-700">(3)</Label>
      </Button>

      <Button variant="outline" className="h-14">
        <Avatar className="">
          <AvatarImage src={placeHolderImage} />
        </Avatar>
        <Label className="ml-1">Red Drink (2€)</Label>
        <Label className="ml-1 text-green-700">(2)</Label>
      </Button>

      <Button variant="outline" className="h-14">
        <Avatar className="">
          <AvatarImage src={placeHolderImage} />
        </Avatar>
        <Label className="ml-1">Kuchen (1.5€)</Label>
        <Label className="ml-1 text-green-700">(1)</Label>
      </Button>
    </div>
  )
}

export default ExampleData
