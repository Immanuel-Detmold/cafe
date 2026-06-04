import { CafeCardInsert } from '@/data/useCafeCard'
import { Label } from '@radix-ui/react-label'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import CardHistory from './CardHistory'
import SaveCafeCard from './SaveCafeCard'

const CafeCards = () => {
  const [tenCount, setTenCount] = useState(0)
  const [fiveCount, setFiveCount] = useState(0)
  const [threeCount, setThreeCount] = useState(0)

  const totalCards = tenCount + fiveCount + threeCount
  const totalPrice =
    (tenCount * 1000 + fiveCount * 500 + threeCount * 300) / 100

  const cards = useMemo<CafeCardInsert[]>(() => {
    const result: CafeCardInsert[] = []
    for (let i = 0; i < tenCount; i++) result.push({ price: 1000 })
    for (let i = 0; i < fiveCount; i++) result.push({ price: 500 })
    for (let i = 0; i < threeCount; i++) result.push({ price: 300 })
    return result
  }, [tenCount, fiveCount, threeCount])

  const resetCards = () => {
    setTenCount(0)
    setFiveCount(0)
    setThreeCount(0)
  }

  return (
    <>
      <div className="mt-2 flex justify-center">
        <Tabs
          defaultValue="create-card"
          className="flex w-[400px] flex-col items-center"
        >
          <TabsList className="">
            <TabsTrigger value="create-card">Karte anlegen</TabsTrigger>
            <TabsTrigger value="history">Historie</TabsTrigger>
          </TabsList>
          <TabsContent value="create-card">
            <div className="mt-2 flex flex-col place-items-center gap-4">
              <div className="grid gap-4">
                {/* 10€ Card */}
                <div className="flex h-40 w-80 flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black">
                  <Label className="3xl cinzel-decorative-regular font-bold text-amber-400">
                    CAFÈ-KARTE
                  </Label>
                  <Label className="3xl cinzel-decorative-regular font-bold">
                    10€
                  </Label>
                  <div className="mt-3 flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      disabled={tenCount === 0}
                      onClick={() => setTenCount((c) => c - 1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-lg font-bold">
                      {tenCount}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      onClick={() => setTenCount((c) => c + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* 5€ Card */}
                <div className="flex h-40 w-80 flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black">
                  <Label className="3xl cinzel-decorative-regular font-bold text-amber-400">
                    CAFÈ-KARTE
                  </Label>
                  <Label className="3xl cinzel-decorative-regular font-bold">
                    5€
                  </Label>
                  <div className="mt-3 flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      disabled={fiveCount === 0}
                      onClick={() => setFiveCount((c) => c - 1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-lg font-bold">
                      {fiveCount}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      onClick={() => setFiveCount((c) => c + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* 3€ Card */}
                <div className="flex h-40 w-80 flex-col items-center justify-center rounded-sm border-2 border-zinc-500 bg-zinc-900 p-4 text-white shadow-inner shadow-black">
                  <Label className="3xl cinzel-decorative-regular font-bold text-amber-400">
                    CAFÈ-KARTE
                  </Label>
                  <Label className="3xl cinzel-decorative-regular font-bold ">
                    3€
                  </Label>
                  <div className="mt-3 flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      disabled={threeCount === 0}
                      onClick={() => setThreeCount((c) => c - 1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-lg font-bold">
                      {threeCount}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-black"
                      onClick={() => setThreeCount((c) => c + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col items-center gap-1">
                <Label className="cinzel-decorative-bold text-3xl font-bold">
                  Summe
                </Label>
                <Label className="text-lg">
                  {totalCards > 0
                    ? `${totalCards} Karte${totalCards !== 1 ? 'n' : ''} · ${totalPrice.toFixed(2).replace('.', ',')}€`
                    : '—'}
                </Label>
              </div>

              <SaveCafeCard cards={cards} resetCards={resetCards} />
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
