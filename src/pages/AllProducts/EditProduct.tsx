import { Product } from '@/data/useProducts'
import { useState } from 'react'

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

import DeleteProduct from './DeleteProduct'

// import { supabase } from '@/services/supabase'

const EditProduct = ({ product }: { product: Product }) => {
  // const { data: products, error } = useProductsQuery({ searchTerm: '', ascending: true })
  // const {data: products, error} = useProductsQuery({id:""})

  // const { data: , error } = useProductQuery({ id: product_id })
  const [name, setName] = useState(product?.Name)
  const [price, setPrice] = useState(product?.Price?.toString())
  const [category, setCategory] = useState(product?.Category)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  )

  const [missing_fields, setMissingFields] = useState<boolean | null>(null)

  const handleEditProduct = (event: React.FormEvent) => {
    event.preventDefault()
    if (name === '' || price === '' || category === '') {
      setMissingFields(true)
      return
    } else {
      setMissingFields(false)
      // To DO!
    }
  }

  return (
    <Sheet>
      {/* <Button onClick={testFunction}>test</Button> */}
      <SheetTrigger asChild>
        <i className="material-icons select-none text-right hover:cursor-pointer">
          edit
        </i>
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
              defaultValue={product?.Category ? product.Category : ''}
              onValueChange={(value) => {
                setCategory(value)
              }}
            >
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
            value={selectedImage?.name ? selectedImage.name : ''}
            type="file"
            className="col-span-4 hover:cursor-pointer"
            onChange={(event) => {
              setSelectedImage(event.target.files?.[0])
            }}
          ></Input>
        </div>

        <SheetClose asChild className="">
          <div className="text-right">
            <Button className="mb-4 w-full" onClick={handleEditProduct}>
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
