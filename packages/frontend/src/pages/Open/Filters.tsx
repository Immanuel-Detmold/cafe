import { useOrderAndItemsQuery } from '@/data/useOrders'
import { useProductCategories } from '@/data/useProductCategories'
import { Product, useProductsQuery } from '@/data/useProducts'
import { Label } from '@radix-ui/react-label'
import { ListFilterIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  // States
  const [showCategories, setShowCategories] = useState<string[]>([])

  // Data
  // Categories and Products of open/waiting orders
  const { data: openOrders } = useOrderAndItemsQuery(['waiting', 'processing'])
  const { data: categories } = useProductCategories()
  const { data: products } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })

  // Functions
  const { currentProducts } = getCategoriesAndProducts(openOrders)
  // const combinedCategories = Array.from(
  //   new Set([...currentCategories, ...selectedCategories]),
  // )

  // Get Combined Products currentProducts and selectedProducts
  // selectedProducts is in format ["123", "23", ...]
  // currentProducts is in format [{id: 123, name: "Product 1"}, {id: 23, name: "Product 2"}, ...]
  const getCombinedProducts = (
    currentProducts: Product[],
    selectedProducts: string[],
  ) => {
    const combinedProducts = [...currentProducts]
    selectedProducts.forEach((id) => {
      const product = products?.find((p) => p.id.toString() === id)
      if (product && !combinedProducts.some((p) => p.id === product.id)) {
        combinedProducts.push(product)
      }
    })
    return combinedProducts
  }

  const combinedProducts = getCombinedProducts(
    currentProducts,
    selectedProducts,
  )

  useEffect(() => {
    // Transform Categories into List of Strings ["Category 1", "Category 2", ...]
    const showCategories =
      categories?.map((category) => category.category) || []
    setShowCategories(showCategories)
  }, [categories])

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`ml-2 ${selectedCategories?.length > 0 || selectedProducts?.length > 0 ? 'bg-amber-600 text-white' : ''}`}
          >
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
              <AccordionTrigger className="-mb-3">
                Produktkategorie
              </AccordionTrigger>

              <AccordionContent>
                {showCategories &&
                  showCategories.map((category) => (
                    <div
                      key={category}
                      className="mt-2 flex items-center space-x-1"
                    >
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(e) => {
                          handleCheckboxChange('category', e, category)
                        }}
                      />
                      <Label className="cursor-pointer" htmlFor={category}>
                        {category}
                      </Label>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="-mb-3">Produkte</AccordionTrigger>
              <AccordionContent>
                {combinedProducts &&
                  combinedProducts.map((product) => (
                    <div
                      key={product.id.toString()}
                      className="mt-2 flex items-center space-x-1"
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
                      <Label
                        className="cursor-pointer"
                        htmlFor={product.id.toString()}
                      >
                        {product.name}
                      </Label>
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
