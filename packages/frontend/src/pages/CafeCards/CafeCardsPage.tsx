import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import CardHistory from './CardHistory'
import SaveCafeCard from './SaveCafeCard'

const CafeCards = () => {
  const [price, setPrice] = useState('')

  const handleCardClick = (priceInput: string) => {
    setPrice(priceInput)
  }

  // Forwarded to child component
  const resetPrice = () => {
    setPrice('')
  }
  return (
    <>
      <div className="mt-2 flex justify-center">
        <Tabs
          defaultValue="create-card"
          className="flex w-[400px] flex-col items-center"
        >
          <TabsList className="">
            {/* Tab Create Card */}
            <TabsTrigger value="create-card">Karte anlegen</TabsTrigger>
            <TabsTrigger value="history">Historie</TabsTrigger>
          </TabsList>
          <TabsContent value="create-card">
            {/* Create Card Tab */}
            <div className="mt-2 flex flex-col place-items-center gap-4">
              <div className="grid gap-4">
                {/* Cafe Card */}
                <div
                  onClick={() => {
                    handleCardClick('10,00')
                  }}
                  className="flex h-40 w-80 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black hover:bg-yellow-800"
                >
                  <Label className="3xl cinzel-decorative-regular cursor-pointer font-bold">
                    CAFÈ-KARTE
                  </Label>
                  <Label className="3xl cinzel-decorative-regular cursor-pointer font-bold">
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
                  <Label className="3xl cinzel-decorative-regular cursor-pointer font-bold">
                    CAFÈ-KARTE
                  </Label>
                  <Label className="3xl cinzel-decorative-regular cursor-pointer font-bold">
                    5€
                  </Label>
                </div>
              </div>
              <Label className="cinzel-decorative-bold text-3xl font-bold">
                Summe
              </Label>
              <Label>
                {price} {price && '€'}
              </Label>
              <SaveCafeCard price={price} resetPrice={resetPrice} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <CardHistory />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default CafeCards
