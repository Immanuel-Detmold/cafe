import { queryClient } from '@/App'
import { imgPlaceHolder } from '@/data/data'
import { useAppData } from '@/data/useAppData'
import { Product, useProductsQuery } from '@/data/useProducts'
import { supabase } from '@/services/supabase'
import { useEffect, useState } from 'react'

const AdvertismentPage = () => {
  // States
  const [showProduct, setShowProduct] = useState<Product>()
  const [timer, setTimer] = useState<string>('15')

  // Data
  const { data: products } = useProductsQuery({
    searchTerm: '',
    ascending: true,
    advertisement: true,
  })
  const { data: appData } = useAppData()
  const imgUrl =
    showProduct && showProduct.images && showProduct.images.length > 0
      ? showProduct.images[0]
      : imgPlaceHolder

  // Functions
  const getFontSize = (name: string) => {
    // Split string with spaces and get length of longest word
    const longestWord = name
      .split(' ')
      .reduce((a, b) => (a.length > b.length ? a : b))

    if (longestWord.length < 8) {
      return '7.5rem'
    } else if (longestWord.length < 10) {
      return '7rem'
    } else if (longestWord.length < 12) {
      return '6.5rem'
    } else if (longestWord.length < 14) {
      return '6rem'
    }
    return '4rem' // Default font size
  }

  // RealTime changes
  supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Products',
      },
      () => void queryClient.invalidateQueries({ queryKey: ['products'] }),
    )
    .subscribe()

  // Use Effect
  useEffect(() => {
    if (products && products.length > 0) {
      let currentIndex = 0
      setShowProduct(products[currentIndex])

      const interval = setInterval(
        () => {
          currentIndex = (currentIndex + 1) % products.length
          setShowProduct(products[currentIndex])
        },
        parseInt(timer + '000'),
      )

      return () => clearInterval(interval) // Cleanup interval on component unmount
    }
  }, [products, timer])

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
      <div className="advertismentBackground relative min-h-screen overflow-clip">
        {/* Logo Absolute */}
        {showProduct && (
          <div className="relative flex min-h-screen items-center">
            {/* Price Absoulte*/}
            {showProduct.description ? (
              <h3 className="merriweather-bold absolute bottom-24 right-20 text-[40px] text-gray-400 drop-shadow-lg">
                2,00€
              </h3>
            ) : (
              ''
            )}
            <img
              src="src\components\ui\icons\svg_immanuel_cafe.svg"
              alt={'Immanuel Cafe Logo'}
              className="absolute right-0 top-0 aspect-square w-[270px] object-cover drop-shadow-lg"
            />

            {/* src\components\ui\icons\svg_immanuel_cafe.svg */}
            {/* Image */}
            <div className="w-1/2">
              <img
                src={imgUrl}
                alt={showProduct.name}
                className="mx-auto aspect-square max-h-screen rounded-3xl border-4 border-gray-400 object-cover shadow-2xl drop-shadow-2xl"
              />
            </div>

            {/* Text */}
            {/* <div className="flex flex-col w-1/2">
              <h1 className="cinzel-decorative-bold text-[120px] text-center">{showProduct.name}</h1>
            </div> */}

            <div className="flex w-1/2 flex-col px-12">
              <h1
                style={{ fontSize: getFontSize(showProduct.name) }}
                className={`cinzel-decorative-bold text-cente text-white drop-shadow-lg ${showProduct.description ? 'text-center' : 'text-center'}`}
              >
                {showProduct.name}
              </h1>
              <h3 className="merriweather-regular mt-4 text-left text-[30px] text-gray-400 drop-shadow-lg">
                {showProduct.description}
              </h3>
              {showProduct.description ? (
                ''
              ) : (
                <h3 className="merriweather-bold text-center text-[40px] text-gray-400 drop-shadow-lg">
                  2,00€
                </h3>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdvertismentPage
