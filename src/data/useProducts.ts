import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions.tsx'

export type Product = Database['public']['Tables']['Products']['Row']

export const useProductsQuery = ({
  searchTerm,
  ascending,
  categories,
}: {
  searchTerm: string
  ascending: boolean
  categories?: string[]
}) => {
  return useQuery({
    queryKey: ['products', searchTerm, ascending, categories],
    queryFn: async () => {
      let query = supabase
        .from('Products')
        .select()
        .eq('deleted', false)
        .order('name', { ascending })
        .ilike('name', `%${searchTerm}%`)

      if (categories && categories.length > 0) {
        query = query.in('category', categories)
      }

      const { data, error } = await query

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

// Makes soft delete -> set deleted to true
export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (product: Product) => {
      const { data: productData, error } = await supabase
        .from('Products')
        .update({ deleted: true })
        .eq('id', product.id)
        .select()

      if (error) {
        throw error
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
      return productData
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Delteted Product: ${data[0]?.name}`,
      })
    },
  })

type InsertProduct = Database['public']['Tables']['Products']['Insert']

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async (newProduct: InsertProduct) => {
      const { data, error } = await supabase
        .from('Products')
        .insert(newProduct)
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Created Product: ${data[0]?.name}`,
      })
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
    onSuccess: async (data) => {
      // After the mutation succeeds, invalidate the useProductsQuery
      await queryClient.invalidateQueries({ queryKey: ['products'] })

      await saveUserAction({
        action: data,
        short_description: `Edit Product: ${data[0]?.name}`,
      })
    },
  })
