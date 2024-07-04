import { imgPlaceHolder } from '@/data/data'
import { type Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { Label } from '@radix-ui/react-label'
import { EditIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'

import { AspectRatio } from './ui/aspect-ratio'

const Product = ({ product }: { product: Product }) => {
  const navigate = useNavigate()
  const imgUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : imgPlaceHolder
  return (
    <div className="h-full">
      <Card className="h-full overflow-clip p-1">
        {/* Under Picture */}
        <div className="relative flex h-full flex-col p-1 sm:p-2">
          <AspectRatio ratio={1 / 1}>
            <img
              src={imgUrl}
              alt={product.name}
              className="mx-auto aspect-square rounded-md object-cover"
            />
          </AspectRatio>
          <Label className="mt-2 text-sm font-bold md:text-lg">
            {product.name}
          </Label>
          <Label className="mt-2 text-xs md:text-lg">{product.category}</Label>
          <Label className="m-0 mt-2 text-xs text-gray-700 md:text-lg">
            Preis: {centsToEuro(product.price)} €
          </Label>

          <div className="absolute bottom-0 right-0">
            <EditIcon
              className="mb-2 mr-2 cursor-pointer"
              onClick={() => {
                navigate('/admin/all-products/' + product.id)
              }}
            />
            {/* <EditProduct product={product} /> */}
          </div>
        </div>
        {/* <CardContent className="p-3 pt-0 text-sm md:p-6 md:pt-0 md:text-md">
          <p>{product.Price} €</p>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default Product
