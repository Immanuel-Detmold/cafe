import { Product } from '@/data/useProducts'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const ProductsInCategory = (props: { products: Product[] }) => {
  const placeHolderImage =
    'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/PlaceHolder.jpg?t=2024-03-14T12%3A07%3A02.697Z'
  return (
    <div>
      {props.products?.map((product) => (
        <div key={product.id} className="m-2 py-6" onClick={() => {}}>
          <Avatar className="">
            <AvatarImage
              src={product.Image ? product.Image : placeHolderImage}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="ml-2 content-center whitespace-nowrap">
            {product.Name} ({product.Price}€)
          </h1>
        </div>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-1">
            <Button variant="secondary">1 Hinzufügen</Button>
            <Button variant="secondary">2 Hinzufügen</Button>
            <Button variant="secondary">3 Hinzufügen</Button>
            <Button variant="secondary">4 Hinzufügen</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ProductsInCategory
