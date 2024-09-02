import { useProductCategories } from '@/data/useProductCategories'
import { FilterIcon } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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

export default function AllProductsFilter({
  handleCheckboxChange,
  selectedCategories,
}: FilterProps) {
  // States
  const { data: categories } = useProductCategories()

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <FilterIcon
            className={`cursor-pointer hover:text-gray-500 ${selectedCategories?.length > 0 ? 'text-amber-600' : ''}`}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h1 className="font-bold">Produktkategorie</h1>
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
                <Label className="cursor-pointer" htmlFor={category.category}>
                  {category.category}
                </Label>
              </div>
            ))}
        </PopoverContent>
      </Popover>
    </>
  )
}
