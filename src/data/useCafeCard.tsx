import { queryClient } from '@/App'
import { centsToEuro } from '@/generalHelperFunctions.tsx/currencyHelperFunction'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

import { saveUserAction } from './userLog'

export type CafeCard = Database['public']['Tables']['CafeCards']['Row']
export type CafeCardInsert = Database['public']['Tables']['CafeCards']['Insert']

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
    mutationFn: async (cafeCard: CafeCardInsert) => {
      const { data, error } = await supabase
        .from('CafeCards')
        .insert([cafeCard])
        .select()

      if (error) {
        throw error
      }
      return data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })

      await saveUserAction({
        action: data,
        short_description: `Created Card: ${centsToEuro(data[0]?.price ?? 0)}`,
      })
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
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['cafeCards'] })

      await saveUserAction({
        action: data,
        short_description: `Deleted Card: ${centsToEuro(data[0]?.price ?? 0)}`,
      })
    },
  })
