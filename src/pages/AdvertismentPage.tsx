import { queryClient } from '@/App'
import { imgPlaceHolder } from '@/data/data'
import { useAppData } from '@/data/useAppData'
import { Product, useProductsQuery } from '@/data/useProducts'
import { supabase } from '@/services/supabase'
import { useEffect, useState } from 'react'

const AdvertismentPage = () => {
  // States
  const [showProduct, setShowProduct] = useState<Product>()
  const [timer, setTimer] = useState<string>('1')

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
      <div className="advertismentBackground min-h-screen overflow-clip">
        {showProduct && (
          <div className="flex min-h-screen items-center">
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
                className="cinzel-decorative-bold text-cente text-white drop-shadow-lg"
              >
                {showProduct.name}
              </h1>
              <h3 className="merriweather-regular mt-28 text-left text-[30px] text-gray-400 drop-shadow-lg">
                {showProduct.description}
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdvertismentPage
