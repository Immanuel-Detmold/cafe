import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './userLog'

export type InsertProductCategories =
  Database['public']['Tables']['ProductCategories']['Insert']

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ProductCategories')
        .select()
        .order('category', { ascending: true })

      if (error) {
        throw error
      }
      return data
    },
  })
}

// Delete Category
export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('ProductCategories')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })

      await saveUserAction({
        action: data,
        short_description: `Delete Category: ${data[0]?.category}`,
      })
    },
  })
}

// Add Category
export const useAddCategory = () =>
  useMutation({
    mutationFn: async (newCategory: InsertProductCategories) => {
      const { data, error } = await supabase
        .from('ProductCategories')
        .insert(newCategory)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })

      await saveUserAction({
        action: data,
        short_description: `Add Category: ${data[0]?.category}`,
      })
    },
  })
