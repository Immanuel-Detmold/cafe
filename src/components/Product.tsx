import { type Product } from '@/data/useProducts'
import EditProduct from '@/pages/AllProducts/EditProduct'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const Product = ({ product }: { product: Product }) => {
  const imgUrl = product.Image
    ? product.Image
    : 'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/PlaceHolder.jpg'
  return (
    <div className="h-full">
      <Card className="h-full overflow-hidden p-1">
        <img
          src={imgUrl}
          alt={product.Name}
          className="mx-auto aspect-square rounded-md object-cover"
        />
        <CardHeader className="p-1 sm:p-2 md:p-5">
          <CardDescription className="text-xs md:text-lg">
            {product.Category}
          </CardDescription>
          <CardTitle className="text-sm md:text-lg">{product.Name}</CardTitle>

          <div className="grid grid-cols-2">
            <CardDescription className="m-0 text-xs md:text-lg">
              {product.Price} €
            </CardDescription>

            <EditProduct product={product} />
          </div>
        </CardHeader>
        {/* <CardContent className="p-3 pt-0 text-sm md:p-6 md:pt-0 md:text-md">
          <p>{product.Price} €</p>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default Product
