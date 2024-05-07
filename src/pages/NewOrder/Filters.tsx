import { useProductCategories } from '@/data/useProductCategories'
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

type FilterProps = {
  handleCheckboxChange: (
    type: string,
    checked: string | boolean,
    value: string,
  ) => void
  selectedCategories: string[]
}

const Filters = ({ handleCheckboxChange, selectedCategories }: FilterProps) => {
  // Categories and Products of open/waiting orders
  const { data: categories } = useProductCategories()

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`ml-2 ${selectedCategories?.length > 0 ? 'bg-amber-600 text-white' : ''}`}
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
                {categories &&
                  categories.map((category) => (
                    <div
                      key={category.category}
                      className="mt-2 flex items-center space-x-1"
                    >
                      <Checkbox
                        id={category.category}
                        checked={selectedCategories.includes(category.category)}
                        onCheckedChange={(e) => {
                          handleCheckboxChange('category', e, category.category)
                        }}
                      />
                      <Label
                        className="cursor-pointer"
                        htmlFor={category.category}
                      >
                        {category.category}
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
