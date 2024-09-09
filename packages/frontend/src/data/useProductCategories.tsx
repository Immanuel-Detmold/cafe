import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions.tsx'

export type InsertProductCategories =
  Database['public']['Tables']['ProductCategories']['Insert']

export type Category = Database['public']['Tables']['ProductCategories']['Row']

export const useProductCategories = (hideNumber = true) => {
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

      if (data) {
        return hideNumber
          ? data.map((categoryObject) => ({
              ...categoryObject,
              // Replace any leading number and dash (e.g., "1-", "2-", "10-", etc.)
              category: categoryObject.category.replace(/^\d+-/, ''),
            }))
          : data
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
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      await saveUserAction({
        action: data,
        short_description: `Add Category: ${data[0]?.category}`,
      })
    },
  })
