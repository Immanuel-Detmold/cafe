import { useAppData, useUpdateAppData } from '@/data/useAppData'
import {
  useProductsQuery,
  useUpdateProductMutationV2,
} from '@/data/useProducts'
import { ChevronLeftIcon, InfoIcon, Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'

const AdvertismentSettings = () => {
  // State
  const [clickedId, setClickedId] = useState<number | null>(null)
  const [timer, setTimer] = useState<string>('1')

  // Mutations
  const { mutate: updatedProduct, isPending } = useUpdateProductMutationV2()
  const { mutate: updateAppData, isPending: loadingTimerUpdate } =
    useUpdateAppData()

  // Hooks
  const navigate = useNavigate()

  // Data
  const { data: products } = useProductsQuery({
    searchTerm: '',
    ascending: true,
  })
  const { data: appData } = useAppData()

  // Use Effect
  useEffect(() => {
    const time_value = appData?.find(
      (item) => item.key === 'advertisement_timer',
    )
    if (time_value) {
      if (time_value.value !== '') {
        setTimer(time_value.value)
      }
    }
  }, [appData])

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="mt-2 flex flex-col">
            {/* Timer */}

            <div className="flex items-center">
              <label htmlFor="timer" className="whitespace-nowrap font-bold">
                Werbetimer (in Sekunden)
              </label>
              <Popover>
                <PopoverTrigger>
                  <InfoIcon className="ml-2 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                  Das ist die Zeit, die ein Produkt angezeigt wird, bevor das
                  nächste Produkt angezeigt wird.
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Input
                value={timer}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) {
                    // Regular expression to check if the value contains only digits
                    setTimer(value)
                    // Update App Data with the new timer value
                    if (appData)
                      appData.map((item) => {
                        if (item.key === 'advertisement_timer') {
                          item.value = value
                        }
                        return item
                      })

                    updateAppData({ key: 'advertisement_timer', value: value })
                  }
                }}
                type="string"
                id="timer"
                name="timer"
                min="1"
                max="60"
                className="ml-2"
              />

              {loadingTimerUpdate && (
                <Loader2Icon className="h-6 w-6 animate-spin" />
              )}
            </div>

            <label htmlFor="ip" className="mt-4 font-bold">
              Werbung aktivieren
            </label>
            {products &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="my-2 ml-2 mt-2 flex items-center 2xl:my-1"
                  onClick={() => {
                    setClickedId(product.id)
                  }}
                >
                  <Switch
                    id={product.id.toString()}
                    defaultChecked={product.advertisement}
                    onCheckedChange={(checked) => {
                      updatedProduct({
                        updatedProduct: {
                          ...product,
                          advertisement: checked,
                        },
                        product_id: product.id,
                      })
                    }}
                  />
                  <label htmlFor={product.id.toString()} className="ml-2">
                    {product.name}
                  </label>
                  {isPending && clickedId === product.id && (
                    <Loader2Icon className="ml-2 h-6 w-6 animate-spin" />
                  )}
                </div>
              ))}
          </div>
          <div className="mt-4 flex justify-start">
            <Button
              className="mr-auto"
              onClick={() => {
                navigate('/admin/settings/')
              }}
            >
              <ChevronLeftIcon className="cursor-pointer" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdvertismentSettings
