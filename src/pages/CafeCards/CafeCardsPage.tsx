import {
  EuroToCents,
  centsToEuro,
} from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

import { Input } from '@/components/ui/input'

import SaveCafeCard from './SaveCafeCard'

const CafeCards = () => {
  const [price, setPrice] = useState('')

  const handleCardClick = (priceInput: string) => {
    if (price === '') {
      setPrice(priceInput)
    } else {
      const priceInput2 = EuroToCents(priceInput)
      const prevPrice = EuroToCents(price)

      const newPrice = priceInput2 + prevPrice
      setPrice(centsToEuro(newPrice))
    }
  }

  const handlePriceChange = (inputValue: string) => {
    inputValue = inputValue.replace(/\D/g, '')
    //remove any existing decimal
    const p = inputValue.replace(',', '')

    //get everything except the last 2 digits
    const l = p.substring(-2, p.length - 2)

    //get the last 2 digits
    const r = p.substring(p.length - 2, p.length)

    inputValue = l + ',' + r
    if (inputValue === ',') inputValue = ''
    setPrice(inputValue)
  }
  return (
    <>
      {/* Whole Block */}
      <div className="mt-2 flex flex-col place-items-center gap-4">
        <div className="grid gap-4">
          {/* Cafe Card */}
          <div
            onClick={() => {
              handleCardClick('10,00')
            }}
            className="flex h-40 w-80 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black hover:bg-yellow-800"
          >
            <Label className="3xl cinzel-decorative-regular font-bold">
              CAFÈ-KARTE
            </Label>
            <Label className="3xl cinzel-decorative-regular font-bold">
              10€
            </Label>
          </div>

          {/* Cafe Card */}
          <div
            onClick={() => {
              handleCardClick('5,00')
            }}
            className="flex h-40 w-80 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black hover:bg-yellow-800"
          >
            <Label className="3xl cinzel-decorative-regular font-bold">
              CAFÈ-KARTE
            </Label>
            <Label className="3xl cinzel-decorative-regular font-bold">
              5€
            </Label>
          </div>
        </div>

        <Label className="cinzel-decorative-bold text-3xl font-bold">
          Summe
        </Label>
        <Input
          className="w-80"
          placeholder="1,00 €"
          value={price}
          type="string"
          onChange={(e) => {
            handlePriceChange(e.target.value)
          }}
        />

        <SaveCafeCard price={price} />
      </div>
    </>
  )
}

export default CafeCards
