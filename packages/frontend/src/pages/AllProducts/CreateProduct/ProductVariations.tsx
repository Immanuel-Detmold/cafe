import { Variation } from '@/lib/customTypes'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProductVariationsProps {
  options: Variation[]
  extras: Variation[]
  onUpdateOptions: (newOptions: Variation[]) => void
  onUpdateExtras: (newExtras: Variation[]) => void
}

export function ProductVariations({
  options,
  extras,
  onUpdateOptions,
  onUpdateExtras,
}: ProductVariationsProps) {
  const handlePriceChange = (inputValue: string) => {
    inputValue = inputValue.replace(/\D/g, '')
    const p = inputValue.replace(',', '')
    const l = p.substring(0, p.length - 2)
    const r = p.substring(p.length - 2, p.length)
    inputValue = l + ',' + r
    if (inputValue === ',') inputValue = ''
    return inputValue
  }

  const addVariation = (type: 'option' | 'extra') => {
    const newVariation = { id: Date.now().toString(), name: '', price: '' }
    if (type === 'option') {
      onUpdateOptions([...options, newVariation])
    } else {
      onUpdateExtras([...extras, newVariation])
    }
  }

  const updateVariation = (
    type: 'option' | 'extra',
    id: string,
    field: 'name' | 'price',
    value: string,
  ) => {
    const updateFn = (items: Variation[]) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'price' ? handlePriceChange(value) : value,
            }
          : item,
      )

    if (type === 'option') {
      onUpdateOptions(updateFn(options))
    } else {
      onUpdateExtras(updateFn(extras))
    }
  }

  const deleteVariation = (type: 'option' | 'extra', id: string) => {
    const filterFn = (items: Variation[]) =>
      items.filter((item) => item.id !== id)

    if (type === 'option') {
      onUpdateOptions(filterFn(options))
    } else {
      onUpdateExtras(filterFn(extras))
    }
  }

  return (
    <div className="mt-4 space-y-6">
      <div>
        <Label className="mb-4 font-bold">Produktoptionen</Label>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Input
                placeholder="Optionsname"
                value={option.name}
                onChange={(e) =>
                  updateVariation('option', option.id, 'name', e.target.value)
                }
                className="flex-grow"
              />
              <Input
                type="text"
                placeholder="Preis"
                value={option.price}
                onChange={(e) =>
                  updateVariation('option', option.id, 'price', e.target.value)
                }
                className="w-24"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteVariation('option', option.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          onClick={() => addVariation('option')}
          className="mt-2"
          size="sm"
          variant={'link'}
        >
          + Option hinzufügen
        </Button>
      </div>

      <div>
        <Label className="mb-4 font-bold">Extras</Label>
        <div className="space-y-2">
          {extras.map((extra) => (
            <div key={extra.id} className="flex items-center space-x-2">
              <Input
                placeholder="Extraname"
                value={extra.name}
                onChange={(e) =>
                  updateVariation('extra', extra.id, 'name', e.target.value)
                }
                className="flex-grow"
              />
              <Input
                type="text"
                placeholder="Preis"
                value={extra.price}
                onChange={(e) =>
                  updateVariation('extra', extra.id, 'price', e.target.value)
                }
                className="w-24"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteVariation('extra', extra.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          onClick={() => addVariation('extra')}
          className="mt-2"
          size="sm"
          variant={'link'}
        >
          + Extra hinzufügen
        </Button>
      </div>
    </div>
  )
}
