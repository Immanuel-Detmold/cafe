import { queryClient } from '@/App.tsx'
import { ConsumptionType } from '@/pages/AllProducts/CreateProduct/CreateProductV2.tsx'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './useUserActions.tsx'

export type Inventory = Database['public']['Tables']['Inventory']['Row']
export type InsertInventory =
  Database['public']['Tables']['Inventory']['Insert']

export type UpdateInventory =
  Database['public']['Tables']['Inventory']['Update']

// Get whole Inventory
export const useInventory = () =>
  useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Inventory')
        .select()
        .eq('deleted', false)
        .order('name', { ascending: true })

      if (error) {
        throw error
      }

      return data
    },
  })

// Get single Item
export const useInventoryItem = (id?: string) =>
  useQuery({
    queryKey: ['inventoryItem', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID is required')
      }
      const { data, error } = await supabase
        .from('Inventory')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },
    enabled: !!id,
  })

// Update single Item
export const useUpdateInventoryMutation = () => {
  return useMutation({
    mutationFn: async ({
      inventoryItem,
      id,
    }: {
      inventoryItem: UpdateInventory
      id: number
    }) => {
      const { data, error } = await supabase
        .from('Inventory')
        .update(inventoryItem)
        .eq('id', id)
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Update Inventory Item: ${data[0]?.name}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
// Delete single Item
export const useMarkInventoryItemAsDeletedMutation = () => {
  return useMutation({
    mutationFn: async (item: Inventory) => {
      const { data, error } = await supabase
        .from('Inventory')
        .update({ deleted: true })
        .eq('id', item.id)
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Marked Inventory Item as Deleted: ${data[0]?.name}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

// Save Inventory Item
export const useSaveInventoryMutation = () => {
  return useMutation({
    mutationFn: async (inventoryItem: InsertInventory) => {
      const { data, error } = await supabase
        .from('Inventory')
        .insert(inventoryItem)
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Save Inventory: ${data[0]?.name}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

// Subtract or Add Quantity to Inventory Item
export const useChangeInventoryItemQuantity = () => {
  return useMutation({
    mutationFn: async ({
      consumption,
      inventory,
    }: {
      consumption: ConsumptionType[]
      inventory: Inventory[]
    }) => {
      // Loop through all consumption items
      for (const item of consumption) {
        for (const invItem of inventory) {
          if (invItem.name === item.name) {
            // Subtract quantity from inventory
            const newQuantity = invItem.quantity - parseInt(item.quantity)
            const { data, error } = await supabase
              .from('Inventory')
              .update({ quantity: newQuantity })
              .eq('id', invItem.id)
              .select()

            if (error) {
              throw error
            }

            await saveUserAction({
              action: data,
              short_description: `Subtract Quantity from Inventory: ${data[0]?.name}`,
            })
            await queryClient.invalidateQueries({ queryKey: ['inventory'] })
          }
        }
      }
    },
    onSuccess: async () => {},
  })
}
