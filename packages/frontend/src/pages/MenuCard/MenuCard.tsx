import { imgPlaceHolder } from '@/data/data'
import { useProductCategories } from '@/data/useProductCategories'
import { useProductsQuery } from '@/data/useProducts'
import { centsToEuro } from '@/generalHelperFunctions/currencyHelperFunction'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

import { groupProductsToCategories } from '../NewOrder/utilityFunctions/groupProductsToCategories'
import ProductDetails from './ProductDetails'

const MenuCard = () => {
  // Mini Functions
  const { toast } = useToast()

  // Data
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
    only_advertisement_screen: false,
    paused: false,
  })
  const { data: dataCategories } = useProductCategories()

  let groupedProducts = undefined
  if (dataCategories && products) {
    groupedProducts = groupProductsToCategories(dataCategories, products)
  }

  if (error) {
    toast({ title: 'Fehler beim Laden der Produkte! ❌' })
  }

  return (
    <>
      <div className="mt-6">
        <h1 className="cinzel-decorative-bold  text-center text-4xl">
          Menükarte
        </h1>
      </div>

      <div className="pb-8">
        {Object.entries(groupedProducts ?? {}).map(([category, products]) => (
          <div key={category} className="container mt-2 px-4">
            {/* Category */}
            <h2 className="cinzel-decorative-regular mb-2 mt-6  text-2xl">
              {category}
            </h2>
            {/* Products */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="">
                  <Dialog>
                    <DialogTrigger className="w-full rounded-lg">
                      {/* Single card */}
                      <div className="flex min-h-20 rounded-md border">
                        {/* Image block */}
                        <div className="flex min-h-20 min-w-20">
                          <img
                            className="mx-auto aspect-square h-full max-h-20 rounded-l-md object-cover"
                            src={product.images?.[0] ?? imgPlaceHolder}
                            alt={product.name}
                          />
                        </div>

                        {/* Text Block */}
                        <div className="ml-2 mt-1 w-full">
                          <div className="relative flex w-full justify-between">
                            <h3 className="cinzel-decorative-regular text-left text-lg">
                              {product.name}
                            </h3>
                            <p className="cinzel-decorative-regular mr-2 min-w-fit text-left text-sm text-gray-500">
                              {centsToEuro(product.price)} €
                            </p>
                          </div>
                          <p className="merriweather-regular mt-1 text-left text-sm text-gray-500 ">
                            {product.short_description}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="w-min">
                      <ProductDetails product={product} />
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default MenuCard
