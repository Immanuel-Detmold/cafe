import { Product } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const ProductDetails = ({ product }: { product: Product }) => {
  return (
    <>
      <div className="flex w-72 flex-col items-center lg:w-96">
        {product.images && product.images?.length > 0 && (
          <Carousel className="max-w-x w-full">
            <CarouselContent className="">
              {product.images?.map((imgUrl, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className={`mt-4 border-none p-1 shadow-none`}>
                      <CardContent
                        className={`relative flex aspect-square items-center justify-center ${product.images && product.images.length > 1 ? 'p-3' : 'p-0'}`}
                      >
                        <AspectRatio
                          ratio={1 / 1}
                          className="rounded-md shadow-md shadow-black"
                        >
                          <img
                            src={imgUrl}
                            alt={'Product'}
                            className="mx-auto aspect-square rounded-md object-cover"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.images && product.images?.length > 1 && (
              <CarouselPrevious className="ml-8 h-7 w-7" />
            )}
            {product.images && product.images?.length > 1 && (
              <CarouselNext className="mr-8 h-7 w-7" />
            )}
          </Carousel>
        )}
        <h1 className="cinzel-decorative-regular mt-2 w-full text-2xl">
          {product.name}
        </h1>
        <p className="cinzel-decorative-regular mt-2 w-full text-left text-sm text-gray-500">
          {product.description}
        </p>
        <p className="cinzel-decorative-regular w-full text-left text-sm text-gray-500">
          {centsToEuro(product.price)} €
        </p>
      </div>
    </>
  )
}

export default ProductDetails
