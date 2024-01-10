import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'

const useFetchProducts = (inputValue: unknown, ascendingg: boolean) => {
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const abortCont = new AbortController()

    const fetchProducts = async () => {
      try {
        // let query = supabase.from('Products').select().order('Name')

        // if (inputValue) {
        //   query = query.filter('Name', 'cs', inputValue)
        // }
        // const { data, error } = await query
        const { data, error } = await supabase
          .from('Products')
          .select()
          .order('Name', {ascending: ascendingg })
          .like('Name', `%${inputValue}%`)

        if (error) {
          setError('Could not fetch Products!' as any)
          setProducts([])
          console.log(error)
        }
        if (data) {
          setProducts(data as any[])
          setError(null)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('An error occurred while fetching products.' as any)
      }
    }

    fetchProducts()

    return () => abortCont.abort()
  }, [inputValue, ascendingg])

  return { products, error }
}

export default useFetchProducts
