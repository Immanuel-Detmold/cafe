import { useProductCategories } from '@/data/useProductCategories'
import {
  Product,
  useCreateProductMutation,
  useProductQuery,
  useUpdateProductMutationV2,
  useUploadProductImagesMutation,
} from '@/data/useProducts'
import { useUser } from '@/data/useUser'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions/currencyHelperFunction'
import { Variation } from '@/lib/customTypes'
import { formatCentsToEuroString } from '@/pages/NewOrder/utilityFunctions/handleOrder'
import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import InfoIconPopover from '@/components/InfoIconPopover'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import DeleteProduct from '../DeleteProduct'
import Consumption from './Consumption'
import DisplayImages from './DisplayImages'
import FileUpload from './FileUpload'
import { ProductVariations } from './ProductVariations'

interface FileMap {
  [key: string]: File
}

export type ConsumptionType = {
  name: string
  quantity: string
}

const CreateProductV2 = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form Data
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [method, setMethod] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [shortDescription, setShortDescription] = useState<string>('')
  const [showOnlyOnAdvertisement, setShowOnlyOnAdvertisement] = useState(false)
  const [showAdervertisement, setShowAdvertisement] = useState(false)
  const [showConsumption, setShowConsumption] = useState(false)
  const [paused, setPaused] = useState(false)
  const [stock, setStock] = useState<string>('0')
  const [options, setOptions] = useState<Variation[]>([])
  const [extras, setExtras] = useState<Variation[]>([])

  // User State
  const [userRole, setUserRole] = useState('user')
  const { user } = useUser()

  const [consumption, setConsumption] = useState<ConsumptionType[]>([])
  const [missing_fields, setMissingFields] = useState<boolean>(false)

  // Images
  const [files, setFiles] = useState<FileMap>({})

  const upload_images = useUploadProductImagesMutation()

  // Compress Image
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 800 // Set the maximum width you want for compressed images
        const scaleSize = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleSize
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        ctx?.canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Canvas to Blob conversion failed'))
          }
        }, file.type)
      }
      img.onerror = reject
    })
  }

  // Compressing all files
  const compressAllFiles = async () => {
    const compressedFilesMap: FileMap = {}
    for (const key in files) {
      const fileArray = files[key]
      if (fileArray) {
        try {
          const compressedFilesArray = await compressImage(fileArray)
          compressedFilesMap[key] = compressedFilesArray
        } catch (error) {
          toast({ title: 'Fehler beim Komprimieren der Bilder!❌' })
        }
      }
    }
    return compressedFilesMap
  }

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
    if (name == '' || category == '') {
      setMissingFields(true)
      toast({ title: 'Bitte gib Name und Kategorie an.' })

      return
    } else {
      setMissingFields(false)
    }

    if (price === '') {
      setPrice('0')
    }
    // if userRole is user, then stop code execution
    if (userRole === 'user') {
      toast({
        title:
          'Nur Admins und Manager können Produkte anlegen oder bearbeiten!❌',
      })
      return
    }

    const cleanAndFormatData = (data: Variation[]) =>
      data
        .filter(({ name, price }) => name.trim() !== '' && price.trim() !== '')
        .map((item) => ({
          ...item,
          price: item.price
            .replace(',', '')
            .replace('.', '')
            .replace(/^0+(?!\.)/, ''), // Remove leading zeroes
        }))

    const cleanedOptions = cleanAndFormatData(options)
    const cleanedExtras = cleanAndFormatData(extras)

    const FilteredConsumption = consumption.filter(
      (item) => item.name !== '' && item.quantity !== '',
    )

    const newProduct = {
      name: name,
      price: EuroToCents(price),
      category: category,
      method: method,
      consumption: FilteredConsumption,
      short_description: shortDescription,
      description: description,
      only_advertisement_screen: showOnlyOnAdvertisement,
      show_consumption: showConsumption,
      paused: paused,
      advertisement: showAdervertisement,
      stock: parseInt(stock),
      options: cleanedOptions,
      extras: cleanedExtras,
    }

    // New Product
    if (!productId) {
      createProduct(newProduct, {
        onSuccess: async (product) => {
          if (Object.keys(files).length > 0) {
            toast({
              title: 'Bilder werden hochgeladen...',
            })
            await handleAddImages(product)
          } else {
            toast({
              title: 'Produkt wurde angelegt!✅',
              duration: 2000,
            })
            navigate('/admin/all-products')
          }
        },
        onError: () => {
          toast({
            title: 'Fehler beim Anlegen des Produkts!❌',
            duration: 2000,
          })
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
          onSuccess: async () => {
            if (Object.keys(files).length > 0) {
              toast({
                title: 'Bilder werden hochgeladen...',
              })

              await handleAddImages()
            } else {
              toast({
                title: 'Produkt wurde aktualisiert!✅',
                duration: 2000,
              })
              navigate('/admin/all-products')
            }
          },
        },
      )
    }
  }

  const handleAddImages = async (product?: Product) => {
    // const allFiles = Object.values(files)
    // Compress images
    const allCompressedFiles = Object.values(await compressAllFiles())
    // If product is not new
    const uploadProp = {
      files: allCompressedFiles,
      product: productData.data,
    }
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

  // Use Effect
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        const { data, error } = await supabase
          .from('Products')
          .select()
          .eq('id', parseInt(productId))
          .single()

        if (data) {
          const {
            name,
            price,
            category,
            method,
            options,
            extras,
            consumption,
            short_description,
            description,
            only_advertisement_screen,
            show_consumption,
            paused,
            advertisement,
            stock,
          } = data
          setName(name)
          setPrice(centsToEuro(price))
          setCategory(category)
          setShowConsumption(show_consumption)
          setPaused(paused)
          setShowAdvertisement(advertisement)
          if (method) {
            setMethod(method)
          }
          if (options) {
            // Apply the format to each price in the array of variations
            setOptions(
              (options as Variation[]).map((opt) => ({
                ...opt,
                price: formatCentsToEuroString(opt.price),
              })),
            )
          }
          if (extras) {
            // Apply the format to each price in the array of extras
            setExtras(
              (extras as Variation[]).map((ext) => ({
                ...ext,
                price: formatCentsToEuroString(ext.price),
              })),
            )
          }
          if (consumption) {
            setConsumption(consumption as ConsumptionType[])
          }
          if (short_description) {
            setShortDescription(short_description)
          }
          if (description) {
            setDescription(description)
          }
          if (only_advertisement_screen) {
            setShowOnlyOnAdvertisement(only_advertisement_screen)
          }
          if (stock) {
            setStock(stock.toString())
          }
        } else if (error) {
          console.error('Error fetching product data:', error)
        }
      }
    }

    void fetchProductData()
  }, [productId])

  useEffect(() => {
    const role = user?.user_metadata?.role as string
    if (role) {
      setUserRole(role)
    }
  }, [user])

  return (
    <>
      <div className="mt-2 flex flex-col items-center overflow-x-hidden">
        <div className="w-full max-w-xl p-1">
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

            <div className="mt-4 flex items-center">
              <Label htmlFor="" className=" font-bold">
                Preis
              </Label>
            </div>
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
              <select
                id="categorySelect"
                className="border-border bg-background text-foreground select w-full rounded-md border p-2"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="" disabled>
                  Wähle Kategorie
                </option>
                {categoryData?.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Method */}
            <div className="mt-4 flex items-center">
              <Label className="font-bold">Zubereitung</Label>
              <InfoIconPopover text="In den offenen Bestllungen kann auf das Produkt geklickt werden und die Zubereitung gelesen werden." />
            </div>
            <Textarea
              tabIndex={-1}
              className="mt-1 w-full"
              placeholder="Kommentar (optional)"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value)
              }}
            ></Textarea>

            {/* Shortdescription */}
            <div className="mt-4 flex items-center">
              <Label className="font-bold">Kurzbeschreibung</Label>
              <InfoIconPopover text="Wird auf der Menükarte angezeigt." />
            </div>
            <Textarea
              tabIndex={-1}
              className="mt-1 w-full"
              placeholder="Kurze Produktbeschreibung (optional)"
              value={shortDescription}
              onChange={(e) => {
                setShortDescription(e.target.value)
              }}
            ></Textarea>

            {/* Description */}
            <div className="mt-4 flex items-center">
              <Label className="font-bold">Produktbeschreibung</Label>
              <InfoIconPopover text="Wird im Werbebildschirm und auf der Menükarte in den Propduktdetails angezeigt." />
            </div>
            <Textarea
              tabIndex={-1}
              className="mt-1 w-full"
              placeholder="Produktbeschreibung (optional)"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
            ></Textarea>

            {/* Pause product */}
            <div className="mt-4 flex items-center">
              <Switch
                id="pause-product"
                checked={paused}
                onCheckedChange={(e) => {
                  setPaused(e)
                }}
              />
              <label htmlFor="pause-product" className="ml-2">
                Produkt pausieren
              </label>
              <InfoIconPopover text="Das Produkt wird bei Aktivierung nicht mehr in der Bestellungsaufnahme und Menükarte angezeigt." />
            </div>

            {/* Switch Show Product/Slogan only on advertisement screen */}
            <div className="mt-4 flex items-center">
              <Switch
                id="show-advertisement"
                checked={showAdervertisement}
                onCheckedChange={(e) => {
                  setShowAdvertisement(e)
                }}
              />
              <label htmlFor="show-advertisement" className="ml-2">
                In der Werbung anzeigen
              </label>
              <InfoIconPopover text="Das Produkt wird in der Werbung angezeigt." />
            </div>

            {/* Switch Show Product/Slogan only on advertisement screen */}
            <div className="mt-4 flex items-center">
              <Switch
                id="only-on-advertisement"
                checked={showOnlyOnAdvertisement}
                onCheckedChange={(e) => {
                  setShowOnlyOnAdvertisement(e)
                }}
              />
              <label htmlFor="only-on-advertisement" className="ml-2">
                <span className="font-bold">Nur</span> in der Werbung anzeigen
              </label>
              <InfoIconPopover text="Das Produkt wird nur in der Werbung angezeigt.\nDas Produkt wird nicht in der Bestellungsaufnahme und Menükarte angezeigt.\nTipp: Es kann für Slogans im Werbebildschirm verwendet werden." />
            </div>

            {/* Switch Show Product/Slogan only on advertisement screen */}
            <div className="mt-4 flex items-center">
              <Switch
                id="show-consumption"
                checked={showConsumption}
                onCheckedChange={(e) => {
                  setShowConsumption(e)
                }}
              />
              <label htmlFor="show-consumption" className="ml-2">
                Inventar vom Produkt bei Bestellung anzeigen
              </label>
              <InfoIconPopover text="Kann verwendet werden, um bei der Bestellungsaufnahme anzuzeigen, wie viel von dem Produkt noch im Inventar ist." />
            </div>

            {/* Stock */}
            <div className="mt-4 flex flex-col">
              <div className="flex items-center">
                <Label htmlFor="stock" className="font-bold">
                  Vorrätig
                </Label>
                <InfoIconPopover text="Kann alternativ zum Iventar verwendet werden." />
              </div>
              <Input
                tabIndex={-1}
                id="stock"
                value={stock}
                type="text"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setStock(value)
                }}
                placeholder="0"
                className="mt-1"
              />
            </div>

            {/* Add consumptions to Product */}
            <Consumption
              consumption={consumption}
              setConsumption={setConsumption}
            />
          </div>

          {/* Product Options */}
          <ProductVariations
            options={options}
            extras={extras}
            onUpdateOptions={setOptions}
            onUpdateExtras={setExtras}
          />

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
              {productData.data && userRole !== 'user' && (
                <DeleteProduct product={productData.data} />
              )}

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
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <div className="flex items-center justify-center">
                    <SaveIcon className="mr-1" />
                    Speichern
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
