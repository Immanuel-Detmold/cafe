import { queryClient } from '@/App'
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
}) => {
  return useQuery({
    queryKey: ['products', searchTerm, ascending],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Products')
        .select()
        .order('name', { ascending })
        .ilike('name', `%${searchTerm}%`)

      if (error) {
        throw error
      }
      return data
    },
  })
}

// Get only one Product - Not used in this project
export const useProductQuery = ({ id }: { id: number }) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Products')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }
      return data
    },
  })

export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('id', product.id)
      if (error) {
        throw error
      } else {
        console.log('Product data deleted:', product)
      }

      // If img exist -> remove from supabase storage
      if (product.image) {
        // Extract ImgID from URL
        const parts = product.image.split('/')
        const imgId = parts[parts.length - 1]
        const { data, error: removeError } = await supabase.storage
          .from('ProductImages')
          .remove([`${imgId}`])

        if (removeError) {
          throw removeError
        } else {
          console.log('Product Image removed.', data)
        }
      }
    },
    onSuccess: async () => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })
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
    onSuccess: async () => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

type UpdateProduct = Database['public']['Tables']['Products']['Update']

export const useUpdateProductMutation = (product_id: number) =>
  useMutation({
    mutationFn: async (updatedProduct: UpdateProduct) => {
      const { data, error } = await supabase
        .from('Products')
        .update(updatedProduct)
        .eq('id', product_id)
        .select()
      if (error) {
        console.log(error)
        throw error
      }

      return data
    },
    onSuccess: async () => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
