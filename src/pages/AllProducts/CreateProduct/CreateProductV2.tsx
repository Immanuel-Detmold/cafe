import { useProductCategories } from '@/data/useProductCategories'
import {
  Product,
  useCreateProductMutation,
  useProductQuery,
  useUpdateProductMutationV2,
  useUploadProductImagesMutation,
} from '@/data/useProducts'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import { ProductDetails } from '../../../components/ProductOptions'
import DeleteProduct from '../DeleteProduct'
import DisplayImages from './DisplayImages'
import FileUpload from './FileUpload'
import { removeEmptyValues } from './helperFunction'

const initialProductDetails: ProductDetails = {
  options: [],
  extras: [],
}

interface FileMap {
  [key: string]: File
}

const CreateProductV2 = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form Data
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [method, setMethod] = useState<string>('')
  const [productDetails, setProductDetails] = useState<ProductDetails>(
    initialProductDetails,
  )
  const [missing_fields, setMissingFields] = useState<boolean>(false)

  // Images
  const [files, setFiles] = useState<FileMap>({})
  const upload_images = useUploadProductImagesMutation()

  // Create Product
  const { mutate: createProduct, isPending: isPendingAddProduct } =
    useCreateProductMutation()

  // Update Product
  const updateProduct = useUpdateProductMutationV2()

  // Categories
  const { data: categoryData } = useProductCategories()

  // Edit Product
  const { productId } = useParams<{ productId: string }>()

  // Add Product
  const handleAddProduct = () => {
    if (
      name == '' ||
      category == '' ||
      price == '' ||
      EuroToCents(price) == 0
    ) {
      setMissingFields(true)
      toast({ title: 'Bitte fülle alle Felder aus!' })
    } else {
      setMissingFields(false)
    }

    const { FilteredProductDetails } = removeEmptyValues(productDetails)

    const newProduct = {
      name: name,
      price: EuroToCents(price),
      category: category,
      method: method,
      product_details: FilteredProductDetails,
    }

    // New Product
    if (!productId) {
      createProduct(newProduct, {
        onSuccess: (product) => {
          if (Object.keys(files).length > 0) {
            toast({
              title: 'Bilder werden hochgeladen...',
            })

            handleAddImages(product)
          } else {
            navigate('/admin/all-products')
            toast({
              title: 'Produkt wurde angelegt!✅',
            })
          }
        },
      })

      // Edit Product
    } else {
      updateProduct.mutate(
        {
          updatedProduct: newProduct,
          product_id: parseInt(productId),
        },
        {
          onSuccess: () => {
            if (Object.keys(files).length > 0) {
              toast({
                title: 'Bilder werden hochgeladen...',
              })

              handleAddImages()
            } else {
              toast({
                title: 'Produkt wurde aktualisiert!✅',
              })
              navigate('/admin/all-products')
            }
          },
        },
      )
    }
  }

  const handleAddImages = (product?: Product) => {
    const allFiles = Object.values(files)

    // If product is not new
    const uploadProp = { files: allFiles, product: productData.data }
    // If product is new
    if (product) {
      uploadProp.product = product
    }

    upload_images.mutate(uploadProp, {
      onSuccess: () => {
        setFiles({})

        navigate('/admin/all-products')
        toast({
          title: 'Bilder wurden hochgeladen. Produkt wurde angelegt!✅',
        })
      },
      onError: () => {
        toast({ title: 'Fehler beim Hochladen der Bilder!❌' })
      },
    })
  }

  // Enter Price
  const handlePriceChange = (inputValue: string) => {
    inputValue = inputValue.replace(/\D/g, '')
    const p = inputValue.replace(',', '')
    const l = p.substring(-2, p.length - 2)
    const r = p.substring(p.length - 2, p.length)
    inputValue = l + ',' + r
    if (inputValue === ',') inputValue = ''
    setPrice(inputValue)
  }

  // Get Product Images and Data for Edit Mode
  const productData = useProductQuery({ id: productId ? productId : undefined })

  useEffect(() => {
    if (productId) {
      if (productData.data) {
        const { name, price, category, method, product_details } =
          productData.data
        setName(name)
        setPrice(centsToEuro(price))
        setCategory(category)
        if (method) {
          setMethod(method)
        }
        if (product_details) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setProductDetails(product_details as ProductDetails)
        }
      }
    }
  }, [productId, productData.data])

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-full max-w-xl">
          {productData.data?.images && productData.data.images.length > 0 && (
            <DisplayImages productData={productData.data} />
          )}

          {/* Rest */}
          <div className="mt-2 flex flex-col">
            <Label htmlFor="name" className="font-bold">
              Name
            </Label>
            <Input
              tabIndex={-1}
              id="name"
              value={name}
              className="mt-1"
              placeholder="Produktname"
              onChange={(e) => {
                setName(e.target.value)
              }}
            />

            <Label htmlFor="" className="mt-4 font-bold">
              Preis
            </Label>
            <Input
              tabIndex={-1}
              id="price"
              value={price}
              type="string"
              onChange={(e) => {
                handlePriceChange(e.target.value)
              }}
              className="mt-1"
              placeholder="1,00 €"
              step=".01"
            />

            {/* Dropdown */}
            {/* <Label htmlFor="username" className="col-span-4">
            Kategorie
          </Label> */}
            <div className="mt-4">
              <Select
                onValueChange={(value) => {
                  setCategory(value)
                }}
                defaultValue={category}
                value={category}
              >
                <SelectTrigger className="w-fill" tabIndex={-1}>
                  <SelectValue placeholder="Wähle Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoryData?.map((category) => (
                    <SelectItem key={category.id} value={category.category}>
                      {category.category}
                    </SelectItem>
                  ))}
                  <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Method */}

            <Label className="mt-4 w-full font-bold">Zubereitung</Label>
            <Textarea
              tabIndex={-1}
              className="mt-1 w-full"
              placeholder="Kommentar (optional)"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value)
              }}
            ></Textarea>
          </div>

          {/* Product Options */}
          {/* <ProductOptions
            productDetails={productDetails}
            setProductDetails={setProductDetails}
          /> */}

          {/* Images */}
          <FileUpload files={files} setFiles={setFiles} />

          <div className="flex justify-between">
            <Button
              className=""
              onClick={() => {
                navigate('/admin/all-products')
              }}
            >
              <ChevronLeftIcon className="cursor-pointer" />
            </Button>

            <div className="flex">
              {productData.data && <DeleteProduct product={productData.data} />}

              <Button
                disabled={
                  upload_images.isPending ||
                  isPendingAddProduct ||
                  updateProduct.isPending
                }
                className="ml-1 text-right"
                onClick={handleAddProduct}
              >
                {upload_images.isPending ||
                isPendingAddProduct ||
                updateProduct.isPending ? (
                  'Loading...'
                ) : (
                  <div className="flex items-center justify-center">
                    Speichern <SaveIcon className="ml-1" />
                  </div>
                )}
              </Button>
            </div>
          </div>
          {missing_fields && (
            <Alert className="mt-2">
              <AlertTitle>Achtung!</AlertTitle>
              <AlertDescription>
                Die Felder Name, Preis und Kategorie dürfen nicht leer sein.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  )
}

export default CreateProductV2
