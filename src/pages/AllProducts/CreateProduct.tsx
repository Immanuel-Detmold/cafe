import { useUser } from '@/data/useUser'
import { supabase } from '@/services/supabase'
import { Value } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
// Remove the unused import statement for uuid4
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const CreateProduct = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Auswählen')
  const [selectedImage, setSelectedImage] = useState(null)
  // const [img_uuid, setImg_uuid] = useState('')

  const [missing_fields, setMissingFields] = useState<Boolean | null>(null)

  const handleAddProduct = async () => {
    var img_uuid = ''

    // If an image is selected, upload it to Supabase Storage and get uuid from Image
    if (selectedImage) {
      var img_uuid = await handleUpload(selectedImage)
    } else {
      img_uuid = ''
    }
    const { data, error } = await supabase.from('Products').insert([
      {
        Name: name,
        Price: price,
        Category: category,
        Image: img_uuid,
      },
    ])
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
  }
  // Upload Image to Supabase Storage
  const handleUpload = async (file: any) => {
    const i_uuidv4 = uuidv4()
    const { data, error } = await supabase.storage
      .from('ProductImages')
      .upload('/' + i_uuidv4, file)

    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
      console.log('IMG3: ' + i_uuidv4)
    }
    return i_uuidv4
  }

  return (
    <Sheet>
      <SheetTrigger asChild onClick={() => setCategory('')}>
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
        <div className="grid grid-cols-4 py-4 gap-4 items-center">
          <Label htmlFor="name" className="col-span-4">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            className="col-span-4"
            placeholder="Produktname"
            onChange={(e) => setName(e.target.value)}
          />

          <Label htmlFor="username" className="col-span-4">
            Preis
          </Label>
          <Input
            id="price"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            className="col-span-4"
            placeholder="1,00 €"
            step=".01"
          />

          {/* Dropdown */}
          {/* <Label htmlFor="username" className="col-span-4">
            Kategorie
          </Label> */}
          <div className="col-span-4">
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-fill">
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

          {/* Image */}
          <Label htmlFor="picture" className="col-span-4 hover:cursor-pointer">
            Bild
          </Label>
          <Input
            id="picture"
            type="file"
            className="col-span-4 hover:cursor-pointer"
            onChange={(event) => {
              setSelectedImage(event.target.files[0])
            }}
          />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault()

                if (name == '' || price == '' || category == '') {
                  setMissingFields(true)
                  console.log('Error Missing Fields!')
                  console.log(name)
                  console.log(price)
                  console.log(category)
                } else {
                  setMissingFields(false)
                  handleAddProduct()
                  navigate('/')
                }
              }}
            >
              Speichern
            </Button>
          </SheetClose>
        </SheetFooter>
        {missing_fields && (
          <div className="text-red-500 text-center mt-2 font-bold">
            Bitte fülle alle Felder aus!
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CreateProduct
