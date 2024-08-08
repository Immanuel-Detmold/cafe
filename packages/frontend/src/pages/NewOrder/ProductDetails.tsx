import { Product } from '@/data/useProducts'
import { Label } from '@radix-ui/react-label'

type ProductDetailProps = {
  product: Product
}

const ProductDetails = (props: ProductDetailProps) => {
  return (
    <>
      <div className="bg-primary container absolute z-50 min-h-screen">
        <Label>{props.product.name}</Label>
      </div>
    </>
  )
}

export default ProductDetails
