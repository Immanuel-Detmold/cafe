import { Product } from '@/data/useProducts'
import { Label } from '@radix-ui/react-label'

type ProductDetailProps = {
  product: Product
}

const ProductDetails = (props: ProductDetailProps) => {
  return (
    <>
      <div className="container absolute z-50 min-h-screen bg-primary">
        <Label>{props.product.name}</Label>
      </div>
    </>
  )
}

export default ProductDetails
