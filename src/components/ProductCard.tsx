import { imgPlaceHolder } from '@/data/data'
import { type Product } from '@/data/useProducts'
import EditProduct from '@/pages/AllProducts/EditProduct'
import { Label } from '@radix-ui/react-label'

import { Card } from '@/components/ui/card'

const Product = ({ product }: { product: Product }) => {
  const imgUrl = product.image ? product.image : imgPlaceHolder
  return (
    <div className="h-full">
      <Card className="h-full overflow-clip p-1">
        {/* Under Picture */}
        <div className="relative flex h-full flex-col p-1 sm:p-2">
          <img
            src={imgUrl}
            alt={product.name}
            className="mx-auto aspect-square rounded-md object-cover "
          />
          <Label className="mt-2 text-sm font-bold md:text-lg">
            {product.name}
          </Label>
          <Label className="mt-2 text-xs md:text-lg">{product.category}</Label>
          <Label className="m-0 mt-2 text-xs text-gray-700 md:text-lg">
            Preis: {product.price} €
          </Label>

          <div className="absolute bottom-0 right-0">
            <EditProduct product={product} />
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
