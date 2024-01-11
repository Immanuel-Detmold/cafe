import { useUser } from '@/data/useUser'
import { supabase } from '@/services/supabase'
import { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
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
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Auswählen')
  const [selectedImage, setSelectedImage] = useState(null)
  const { user } = useUser()
  // const [img_uuid, setImg_uuid] = useState('')

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
      <SheetTrigger asChild onClick={() => setCategory('Auswählen')}>
        <Button variant="outline" className="mx-2">
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
            placeholder="€"
          />

          <Label htmlFor="username" className="col-span-4">
            Kategorie
          </Label>
          <div className="col-span-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-right inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-foreground hover:text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                {category}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Getränk</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategory('Kaffee')}>
                  Kaffee
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory('Tee')}>
                  Tee
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory('Kaltgetränk')}>
                  Kaltgetränk
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory('Heißgetränk')}>
                  Heißgetränk
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCategory('Home Spezialität')}
                >
                  Home Spezialität
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Essen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategory('Süßigkeit')}>
                  Süßigkeit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory('Kaffee')}>
                  Kuchen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Label htmlFor="picture" className="col-span-4">
            Bild
          </Label>
          <Input
            id="picture"
            type="file"
            className="col-span-4"
            onChange={(event) => {
              setSelectedImage(event.target.files[0])
            }}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleAddProduct}>
              Speichern
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CreateProduct
