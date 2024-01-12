import { supabase } from '@/services/supabase';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
const Product = ({ product }: { product: any }) => {
  const navigate = useNavigate()

  const publicUrl = supabase.storage
    .from('ProductImages')
    .getPublicUrl(product.Image).data.publicUrl
  return (
    <div className="h-full">
      <Card className="overflow-hidden p-1 h-full" >
        <img
          src={publicUrl}
          alt={product.Name}
          className="object-cover aspect-square rounded-md mx-auto"
        />
        <CardHeader className="p-1 sm:p-2 md:p-5">
          <CardDescription className="text-xs md:text-lg">
            {product.Category}
          </CardDescription>
          <CardTitle className="text-sm md:text-lg">
            {product.Name}
          </CardTitle>

          <div className='grid grid-cols-2'>
            <CardDescription className="text-xs md:text-lg m-0">
              {product.Price} €
            </CardDescription>
            <i className="material-icons text-right hover:cursor-pointer select-none" onClick={() => navigate("/")}>edit</i>
          </div>
        </CardHeader>
        {/* <CardContent className="text-sm p-3 pt-0 md:p-6 md:pt-0 md:text-md">
          <p>{product.Price} €</p>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default Product
