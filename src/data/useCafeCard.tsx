import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type CafeCard = Database['public']['Tables']['CafeCards']['Row']

// Get Cafe Cards
export const useCafeCards = ({ startDate }: { startDate?: string }) =>
  useQuery({
    queryKey: ['cafeCards', startDate],
    queryFn: async () => {
      let query = supabase
        .from('CafeCards')
        .select()
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('created_at', startDate)
      }

      const { data, error } = await query

      if (error) {
        console.log(error)
        throw error
      }

      return data
    },
  })

export const useCreateCafeCard = () =>
  useMutation({
    mutationFn: async (cafeCard: CafeCard) => {
      const { data, error } = await supabase
        .from('CafeCards')
        .insert([cafeCard])
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })
    },
  })

export const useDeleteCafeCard = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('CafeCards')
        .delete()
        .match({ id: id })
        .select()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })
    },
  })
