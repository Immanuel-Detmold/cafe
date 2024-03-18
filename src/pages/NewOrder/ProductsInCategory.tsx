import { Product } from '@/data/useProducts'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
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
    <div className="flex flex-wrap">
      {props.products?.map((product: Product) => (
        <div key={product.id} className="m-1 w-min">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-14">
                <Avatar className="">
                  <AvatarImage
                    src={product.Image ? product.Image : placeHolderImage}
                  />
                </Avatar>
                <Label className="ml-1">
                  {product.Name} ({product.Price}€)
                </Label>
              </Button>

              {/* Popover -> Select Product Count or Remove */}
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col gap-1">
                <Button variant="secondary">
                  1<ShoppingCartIcon className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary">
                  2<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  3<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  4<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  5<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  6<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  7<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  8<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  9<ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  10
                  <ShoppingCartIcon className="ml-2 h-4" />
                </Button>
                <Button variant="secondary">
                  Entfernen
                  <TrashIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default ProductsInCategory
