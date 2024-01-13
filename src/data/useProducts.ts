import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type Product = Database['public']['Tables']['Products']['Row']

export const useProductsQuery = ({
  searchTerm,
  ascending,
}: {
  searchTerm: string
  ascending: boolean
}) =>
  useQuery({
    queryKey: ['products', searchTerm, ascending],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Products')
        .select()
        .order('Name', { ascending })
        .ilike('Name', `%${searchTerm}%`)

      if (error) {
        throw error
      }
      return data
    },
  })

type InsertProduct = Database['public']['Tables']['Products']['Insert']

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async (newProduct: InsertProduct) => {
      const { data, error } = await supabase.from('Products').insert(newProduct)
      if (error) {
        throw error
      }
      return data
    },
  })
