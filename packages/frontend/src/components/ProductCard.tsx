import { imgPlaceHolder } from '@/data/data'
import { type Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'
import { Label } from '@radix-ui/react-label'

import { Card } from '@/components/ui/card'

import { AspectRatio } from './ui/aspect-ratio'

const Product = ({ product }: { product: Product }) => {
  const imgUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : imgPlaceHolder
  return (
    <div className="relative h-full">
      <Card className="h-full overflow-clip p-1">
        {/* Under Picture */}
        <div className="relative flex h-full flex-col p-1 sm:p-2">
          <div className="relative inline-block">
            <AspectRatio ratio={1 / 1}>
              <img
                src={imgUrl}
                alt={product.name}
                className="mx-auto aspect-square rounded-md object-cover"
              />
            </AspectRatio>
            {product.paused && (
              <div className="absolute -right-9 top-14 w-32 origin-top-right rotate-45 transform bg-gray-800 bg-opacity-75 px-2 py-1 text-center text-lg font-bold text-white">
                Pausiert
              </div>
            )}
          </div>
          <Label className="mt-2 cursor-pointer text-sm font-bold md:text-lg">
            {product.name}
          </Label>

          <Label className="m-0 mt-2 cursor-pointer text-xs text-gray-700 md:text-lg">
            Preis: {centsToEuro(product.price)} €
          </Label>
        </div>
        {/* <CardContent className="p-3 pt-0 text-sm md:p-6 md:pt-0 md:text-md">
          <p>{product.Price} €</p>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default Product
