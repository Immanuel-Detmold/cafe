import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type Expense = Database['public']['Tables']['Expense']['Row']
export type InsertExpense = Database['public']['Tables']['Expense']['Insert']
export type UpdateExpense = Database['public']['Tables']['Expense']['Update']

// Get all expenses
export const useExpensesQuery = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Expense')
        .select()
        .order('purchase_date', { ascending: false })

      if (error) {
        throw error
      }
      return data
    },
  })
}

// Get a single expense
export const useExpenseQuery = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Expense')
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

// Create a new expense
export const useCreateExpenseMutation = () => {
  return useMutation({
    mutationFn: async (newExpense: InsertExpense) => {
      const { data, error } = await supabase
        .from('Expense')
        .insert([newExpense])
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

// Update an expense
export const useUpdateExpenseMutation = (id: number) => {
  return useMutation({
    mutationFn: async (updates: UpdateExpense) => {
      const { data, error } = await supabase
        .from('Expense')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

// Delete an expense
export const useDeleteExpenseMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('Expense')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}
