import { Product } from '@/data/useProducts'
import { useUpdateProductMutation } from '@/data/useProducts'
import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { supabase } from '@/services/supabase'
import { EditIcon } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

import DeleteProduct from './DeleteProduct'

// import { supabase } from '@/services/supabase'

const EditProduct = ({ product }: { product: Product }) => {
  // const { data: products, error } = useProductsQuery({ searchTerm: '', ascending: true })
  // const {data: products, error} = useProductsQuery({id:""})

  // const { data: , error } = useProductQuery({ id: product_id })
  const [name, setName] = useState(product?.name)
  const [price, setPrice] = useState(centsToEuro(product?.price).toString())
  const [category, setCategory] = useState(product?.category)
  const [method, setMethod] = useState<string | null>(product?.method)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  )

  const [missing_fields, setMissingFields] = useState<boolean | null>(null)
  const { mutate: editProduct } = useUpdateProductMutation(product.id)

  const handleEditProduct = async (event: React.FormEvent) => {
    let img_uuid: string | null = ''
    if (selectedImage) {
      img_uuid = await handleUpload(selectedImage)
    } else {
      img_uuid = product?.image
    }
    event.preventDefault()
    if (
      name == '' ||
      category == '' ||
      price == '' ||
      EuroToCents(price) == 0
    ) {
      setMissingFields(true)
      return
    } else {
      setMissingFields(false)
      editProduct({
        name: name,
        price: EuroToCents(price),
        category: category,
        method: method,
        image: img_uuid,
      })

      console.log('Updating Product!')
      setSheetOpen(false)
      toast({
        title: 'Produkt aktualisiert!✅',
      })
    }
  }

  // Upload Image to Supabase Storage
  const handleUpload = async (file: File) => {
    // Remove Old Image if image existed
    if (product.image) {
      const parts = product.image.split('/')
      const toDeleteImgId = parts[parts.length - 1]
      const { data, error } = await supabase.storage
        .from('ProductImages')
        .remove(['' + toDeleteImgId])
      if (error) {
        console.log(error)
      } else {
        console.log('New Image: ', data)
        console.log('Old Image ID: ', toDeleteImgId)
      }
    }

    const i_uuidv4 = uuidv4()
    const { data, error } = await supabase.storage
      .from('ProductImages')
      .upload('/' + i_uuidv4, file)

    if (error) {
      console.log(error)
    }
    if (data) {
      const imgUrl = supabase.storage
        .from('ProductImages')
        .getPublicUrl(i_uuidv4).data.publicUrl
      console.log('IMG3: ' + i_uuidv4)
      return imgUrl
    }
    console.log('IMage?:', product.image)

    return i_uuidv4
  }

  const handlePriceChange = (inputValue: string) => {
    inputValue = inputValue.replace(/\D/g, '')
    //remove any existing decimal
    const p = inputValue.replace(',', '')

    //get everything except the last 2 digits
    const l = p.substring(-2, p.length - 2)

    //get the last 2 digits
    const r = p.substring(p.length - 2, p.length)

    //update the value
    inputValue = l + ',' + r
    if (inputValue === ',') inputValue = ''
    setPrice(inputValue)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        {/* <i className="material-icons select-none text-right hover:cursor-pointer">
          edit
        </i> */}
        <EditIcon className="mb-1 mr-1 h-4 w-4 select-none text-right hover:cursor-pointer sm:mb-2 md:h-6 md:w-6 lg:h-7 lg:w-7"></EditIcon>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Produkt Bearbeiten</SheetTitle>
          <SheetDescription>Passe dein Produkt an.</SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-4 items-center gap-4 py-4">
          <Label htmlFor="name" className="col-span-4">
            Name
          </Label>
          <Input
            tabIndex={-1}
            id="name"
            value={name}
            className="col-span-4"
            placeholder="Produktname"
            onChange={(e) => {
              setName(e.target.value)
            }}
          />

          <Label htmlFor="username" className="col-span-4">
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
            className="col-span-4"
            placeholder="1,00 €"
            step=".01"
          />

          {/* Dropdown Category */}
          <div className="col-span-4">
            <Select
              defaultValue={product?.category ? product.category : ''}
              onValueChange={(value) => {
                setCategory(value)
              }}
            >
              <SelectTrigger className="w-fill" tabIndex={-1}>
                <SelectValue placeholder="Wähle Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kaffee">Kaffee</SelectItem>
                <SelectItem value="Heißgetränk">Heißgetränk</SelectItem>
                <SelectItem value="Kaltgetränk">Kaltgetränk</SelectItem>
                <SelectItem value="Tee">Tee</SelectItem>
                <SelectItem value="Kuchen">Kuchen</SelectItem>
                <SelectItem value="Süßes">Süßes</SelectItem>
                <SelectItem value="Home Spezialität">
                  Home Spezialität
                </SelectItem>
                <SelectItem value="Sonstiges">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Method */}
          <Label className="col-span-4 w-full">Zubereitung</Label>
          <Textarea
            tabIndex={-1}
            className="col-span-4 w-full"
            placeholder="Kommentar (optional)"
            value={method?.toString()}
            onChange={(e) => {
              setMethod(e.target.value)
            }}
          ></Textarea>

          {/* Image */}
          <Label htmlFor="picture" className="col-span-4 hover:cursor-pointer">
            Bild
          </Label>
          <Input
            tabIndex={-1}
            id="picture"
            type="file"
            className="col-span-4 hover:cursor-pointer"
            onChange={(event) => {
              setSelectedImage(event.target.files?.[0])
            }}
          />
        </div>

        <SheetClose asChild className="">
          <div className="text-right">
            <Button
              className="mb-4 w-full"
              onClick={handleEditProduct}
              tabIndex={-1}
            >
              Speichern
            </Button>
          </div>
        </SheetClose>

        {/* Delete Produkt Button and Alert Box */}
        <DeleteProduct product={product} />

        {missing_fields && (
          <div className="mt-2 text-center font-bold text-red-500">
            Bitte fülle alle Felder aus!
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default EditProduct
