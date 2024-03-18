import { useProductsQuery } from '@/data/useProducts'
import { Product } from '@/data/useProducts'
import { Label } from '@radix-ui/react-label'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import ExampleData from './ExampleData'
import ProductsInCategory from './ProductsInCategory'

type GroupedProducts = Record<string, Product[]>

const NewOrder = () => {
  const { data: products, error } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })
  if (error) {
    console.log(error)
  }

  const groupedProducts = products?.reduce((groupMap, product) => {
    const key = product.Category || 'Other'
    const group = groupMap[key] ?? []
    return {
      ...groupMap,
      [key]: [...group, product],
    }
  }, {} as GroupedProducts)

  return (
    <div>
      {/* Change Quantity */}
      {/* <div className="flex items-center mt-2 font-bold justify-items-center">
        <h1 className="">Anzahl: 0</h1>
        <MinusCircleIcon className="w-8 h-8 ml-2 hover:cursor-pointer" />
        <PlusCircleIcon className="w-8 h-8 ml-2 hover:cursor-pointer" />
      </div> */}

      {/* Category and Product */}
      <div className="mt-2">
        {groupedProducts &&
          Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="flex flex-col">
              <h2 className="w-full font-bold">{category}</h2>
              {/* Iterate over each product in the current category */}
              <ProductsInCategory products={products} />
            </div>
          ))}

        {/* Examples of Products*/}
        <ExampleData />
      </div>

      <div className="flex flex-col">
        {/* Comment Fild */}
        <Label className="my-2 font-bold">Kommentar</Label>
        <Textarea className="mb-2"></Textarea>

        {/* Bezahlung */}
        <Label className="font-bold">Bezahlung</Label>
        <RadioGroup defaultValue="Bar" className="mb-2 ml-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Bar" id="r1" />
            <Label htmlFor="r1">Bar</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Café Karte" id="r2" />
            <Label htmlFor="r2">Café Karte</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Paypal" id="r3" />
            <Label htmlFor="r3">Paypal</Label>
          </div>
        </RadioGroup>

        {/* Kosten */}
        <Label className="mb-2 w-min whitespace-nowrap rounded-lg border p-2 font-bold text-orange-600">
          Kosten: 12.5€
        </Label>

        {/* Custom Price */}
        <div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode" className="font-bold">
              Kunde bezahlt abweichenden Preis
            </Label>
          </div>
        </div>

        <Label className="mt-1">
          Da die Bezahlung auf Spendenbasis beruht, hat der Kunde das Recht,
          einen selbst bestimmten Betrag zu bezahlen. Ist das der Fall,
          aktiviere diese Checkbox.
        </Label>

        <Button className="mb-2 mt-1 w-min bg-amber-600">
          Absenden <ShoppingCart className="m-1 h-4 w-4"></ShoppingCart>
        </Button>
      </div>
    </div>
  )
}

export default NewOrder
