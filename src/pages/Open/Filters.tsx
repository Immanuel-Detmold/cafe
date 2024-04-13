import { useOrderAndItemsQuery } from '@/data/useOrders'
import { Label } from '@radix-ui/react-label'
import { ListFilterIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['item-1']}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Produktkategorie</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Produkte</AccordionTrigger>
              <AccordionContent>
                {currentProducts &&
                  currentProducts.map((product) => (
                    <div
                      key={product.id.toString()}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={product.id.toString()}
                        checked={selectedProducts.includes(
                          product.id.toString(),
                        )}
                        onCheckedChange={(e) => {
                          handleCheckboxChange(
                            'product',
                            e,
                            product.id.toString(),
                          )
                        }}
                      />
                      <Label>{product.name}</Label>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Filters
