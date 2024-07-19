import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type Printer = Database['public']['Tables']['Printers']['Row']
export type InsertPrinter = Database['public']['Tables']['Printers']['Insert']
export type UpdatePrinter = Database['public']['Tables']['Printers']['Update']

export const usePrintersQuery = () => {
  return useQuery({
    queryKey: ['printers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Printers').select()

      if (error) {
        throw error
      }
      return data
    },
  })
}

export const usePrinterQuery = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ['printer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Printers')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }
      return data
    },
  })
}

export const useCreatePrinterMutation = () => {
  return useMutation({
    mutationFn: async (newPrinter: InsertPrinter) => {
      const { data, error } = await supabase
        .from('Printers')
        .insert([newPrinter])
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['printers'] })
    },
  })
}

export const useUpdatePrinterMutation = (id: number) => {
  return useMutation({
    mutationFn: async (updates: UpdatePrinter) => {
      const { data, error } = await supabase
        .from('Printers')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['printers'] })
    },
  })
}

export const useDeletePrinterMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('Printers')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['printers'] })
    },
  })
}
