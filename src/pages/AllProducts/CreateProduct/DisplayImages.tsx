import { Product, useUpdateProductMutationV2 } from '@/data/useProducts'
import { getImagePath } from '@/generalHelperFunctions.tsx/supabase'
import { supabase } from '@/services/supabase'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useToast } from '@/components/ui/use-toast'

const DisplayImages = ({ productData }: { productData: Product }) => {
  const updateImages = useUpdateProductMutationV2()
  const { toast } = useToast()
  const [images, setImages] = useState(productData.images)

  const handleDelete = async (imgUrl: string) => {
    const newImages = productData.images?.filter((img) => img !== imgUrl)
    updateImages.mutate({
      updatedProduct: { images: newImages },
      product_id: productData.id,
    })

    //
    const toDeleteUrl = getImagePath(imgUrl)

    const { data, error } = await supabase.storage
      .from('ProductImages')
      .remove([toDeleteUrl])

    if (data) {
      if (newImages) setImages(newImages)
      toast({ title: 'Bild erfolgreich gelöscht!✅' })
    }
    if (error) {
      toast({ title: 'Bild konnte nicht gelöscht werden!❌' })
    }
  }

  useEffect(() => {
    setImages(productData.images)
  }, [productData.images])

  return (
    <>
      <div className="flex justify-center">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {images?.map((imgUrl, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="relative flex aspect-square items-center justify-center p-6">
                      <AspectRatio ratio={1 / 1}>
                        <img
                          src={imgUrl}
                          alt={'Product'}
                          className="mx-auto aspect-square rounded-md object-cover"
                        />
                        <AlertDialog>
                          <AlertDialogTrigger
                            asChild
                            className="absolute bottom-2 right-2 h-10 w-10 cursor-pointer rounded-md bg-secondary p-1"
                          >
                            <Trash2 className="" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Möchtest du das Bild wirklich löschen?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Diese Aktion kann nicht rückgängig gemacht
                                werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <div className="block text-right">
                                <AlertDialogCancel tabIndex={-1}>
                                  Abbrechen
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  className="ml-2 bg-red-700"
                                  onClick={async () => {
                                    await handleDelete(imgUrl)
                                  }}
                                >
                                  Löschen
                                </AlertDialogAction>
                              </div>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  )
}

export default DisplayImages
