import { queryClient } from '@/App'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export type CafeCard = Database['public']['Tables']['CafeCards']['Insert']

// Get Cafe Cards
export const useCafeCards = () =>
  useQuery({
    queryKey: ['cafeCards'],
    queryFn: async () => {
      const { data, error } = await supabase.from('CafeCards').select()

      if (error) {
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
      console.log(data)
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['CafeCards'] })
    },
  })
