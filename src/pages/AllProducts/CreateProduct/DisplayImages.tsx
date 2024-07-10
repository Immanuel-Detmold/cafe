import { queryClient } from '@/App'
import { Product, useUpdateProductMutationV2 } from '@/data/useProducts'
import { getImagePath } from '@/generalHelperFunctions.tsx/supabase'
import { supabase } from '@/services/supabase'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { DownloadIcon, Trash } from 'lucide-react'
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
  // States
  const [images, setImages] = useState<string[]>()
  console.log(images)

  // Mini Functions
  const { toast } = useToast()

  // Mutations
  const updateImages = useUpdateProductMutationV2()

  // Functions
  const handleDelete = async (imgUrl: string) => {
    // First change the image array in the database
    console.log('Deleting: ', imgUrl)
    const newImages = images?.filter((img) => img !== imgUrl)
    updateImages.mutate({
      updatedProduct: { images: newImages },
      product_id: productData.id,
    })

    // Remove image from storage
    const toDeleteUrl = getImagePath(imgUrl)
    const { data, error } = await supabase.storage
      .from('ProductImages')
      .remove([toDeleteUrl])

    await queryClient.invalidateQueries({ queryKey: ['products'] })
    if (data) {
      if (newImages) setImages(newImages)
      toast({ title: 'Bild erfolgreich gelöscht!✅' })
    }
    if (error) {
      toast({ title: 'Bild konnte nicht gelöscht werden!❌' })
    }
  }

  // Download Image
  const downloadImage = (url: string) => {
    // const subPath = url.split('ProductImages/')[1]
    const subPath = url.split('ProductImages/')[1]
    const { data } = supabase.storage
      .from('ProductImages')
      .getPublicUrl(subPath ? subPath : '', {
        download: true,
      })

    const aTag = document.createElement('a')
    aTag.href = data.publicUrl
    aTag.setAttribute('download', 'img.png')
    document.body.appendChild(aTag)
    aTag.click()
    aTag.remove()
  }

  useEffect(() => {
    if (productData.images) setImages(productData.images)
  }, [productData])

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
                        <DownloadIcon
                          onClick={() => {
                            downloadImage(imgUrl)
                          }}
                          className="absolute bottom-2 left-2 h-8 w-8 cursor-pointer rounded-md bg-secondary p-1"
                        >
                          Test
                        </DownloadIcon>
                        <AlertDialog>
                          <AlertDialogTrigger
                            asChild
                            className="absolute bottom-2 right-2 h-8 w-8 cursor-pointer rounded-md bg-secondary p-1"
                          >
                            <Trash className="" />
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
