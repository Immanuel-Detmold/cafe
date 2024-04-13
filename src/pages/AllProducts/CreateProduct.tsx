import { useCreateProductMutation } from '@/data/useProducts'
import { supabase } from '@/services/supabase'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const CreateProduct = () => {
  // const navigate = useNavigate()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Auswählen')
  const [method, setMethod] = useState<string>('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: createProduct } = useCreateProductMutation()
  // const [img_uuid, setImg_uuid] = useState('')

  const [missing_fields, setMissingFields] = useState<boolean | null>(null)

  const handleAddProduct = async () => {
    let img_uuid = ''

    // If an image is selected, upload it to Supabase Storage and get uuid from Image
    if (selectedImage) {
      img_uuid = await handleUpload(selectedImage)
    } else {
      img_uuid = ''
    }
    createProduct({
      name: name,
      price: parseFloat(price),
      category: category,
      image: img_uuid,
      method: method,
    })
    toast({
      title: 'Produkt wurde angelegt! ✅',
    })
  }
  // Upload Image to Supabase Storage
  const handleUpload = async (file: File) => {
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
      console.log(data)
      console.log('IMG3: ' + i_uuidv4)
      return imgUrl
    }
    return i_uuidv4
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger
        asChild
        onClick={() => {
          setCategory('')
        }}
      >
        <Button variant="outline" className="mx-2 select-none">
          + Neus Produkt
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Neus Produkt</SheetTitle>
          <SheetDescription>
            Hier kannst du ein neues Produkt erstellen.
          </SheetDescription>
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
            type="number"
            onChange={(e) => {
              setPrice(e.target.value)
            }}
            className="col-span-4"
            placeholder="1,00 €"
            step=".01"
          />

          {/* Dropdown */}
          {/* <Label htmlFor="username" className="col-span-4">
            Kategorie
          </Label> */}
          <div className="col-span-4">
            <Select
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
            value={method}
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

        <SheetFooter>
          <SheetClose asChild>
            <Button
              tabIndex={-1}
              className="w-full"
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                if (isLoading) {
                  return
                }
                if (name == '' || price == '' || category == '') {
                  setMissingFields(true)
                  console.log('Error Missing Fields!')
                  console.log(name)
                  console.log(price)
                  console.log(category)
                } else {
                  setIsLoading(true)
                  setMissingFields(false)
                  handleAddProduct()
                    .then(() => {
                      setIsLoading(false)
                      setSheetOpen(false)
                      // navigate('/new-order')
                    })
                    .catch((error) => {
                      setIsLoading(false)
                      console.log(error)
                    })
                }
              }}
            >
              Speichern
            </Button>
          </SheetClose>
        </SheetFooter>
        {missing_fields && (
          <div className="mt-2 text-center font-bold text-red-500">
            Bitte fülle alle Felder aus!
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CreateProduct
