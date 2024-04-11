import { useOrderAndItemsQuery } from '@/data/useOrders'
import { Label } from '@radix-ui/react-label'
import { ListFilterIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { getCategoriesAndProducts } from './helperFunctions'

type FilterProps = {
  handleCheckboxChange: (
    type: string,
    checked: string | boolean,
    value: string,
  ) => void
  selectedCategories: string[]
  selectedProducts: string[]
}

const Filters = ({
  handleCheckboxChange,
  selectedCategories,
  selectedProducts,
}: FilterProps) => {
  // Categories and Products of open/waiting orders
  const { data: openOrders } = useOrderAndItemsQuery(['waiting', 'processing'])
  const { currentCategories, currentProducts } =
    getCategoriesAndProducts(openOrders)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-2">
            Filter
            <ListFilterIcon className="mx-2 h-6 w-6 cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {/* Head */}
          <div className="grid gap-2">
            {/* Categories */}
            <h4 className="font-medium leading-none">Produktkategorie</h4>

            {currentCategories &&
              currentCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(e) => {
                      handleCheckboxChange('category', e, category)
                    }}
                  />
                  <Label>{category}</Label>
                </div>
              ))}

            <h4 className="font-medium leading-none">Produkte</h4>
            {currentProducts &&
              currentProducts.map((product) => (
                <div
                  key={product.id.toString()}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={product.id.toString()}
                    checked={selectedProducts.includes(product.id.toString())}
                    onCheckedChange={(e) => {
                      handleCheckboxChange('product', e, product.id.toString())
                    }}
                  />
                  <Label>{product.name}</Label>
                </div>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Filters
