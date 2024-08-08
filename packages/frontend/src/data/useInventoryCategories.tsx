import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions.tsx'

export type InventoryCategory =
  Database['public']['Tables']['InventoryCategories']['Row']

export const useInventoryCategories = () => {
  return useQuery({
    queryKey: ['categoriesInventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('InventoryCategories')
        .select()
        .order('category', { ascending: true })

      if (error) {
        throw error
      }
      return data
    },
  })
}

type InsertInventoryCategories = {
  category: string
}

export const useDeleteInventoryCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('InventoryCategories')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categoriesInventory'] })

      await saveUserAction({
        action: data,
        short_description: `Delete Inventory Category: ${data[0]?.category}`,
      })
    },
  })
}

export const useAddInventoryCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: InsertInventoryCategories) => {
      const { data, error } = await supabase
        .from('InventoryCategories')
        .insert(newCategory)
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categoriesInventory'] })

      await saveUserAction({
        action: data,
        short_description: `Add Inventory Category: ${data[0]?.category}`,
      })
    },
  })
}
