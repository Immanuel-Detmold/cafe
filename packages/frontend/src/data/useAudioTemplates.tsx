import { queryClient } from '@/App'
import { saveUserAction } from '@/data/useUserActions'
import { supabase } from '@/services/supabase'
import { Database } from '@/services/supabase.types'
import { useMutation, useQuery } from '@tanstack/react-query'

// Saved announcement texts ("Das Café schließt um 13 Uhr."), used on /audio
// and as sample texts in settings/voice.

export type AudioTemplate =
  Database['public']['Tables']['AudioTemplates']['Row']

export const useAudioTemplatesQuery = () =>
  useQuery({
    queryKey: ['audioTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .select()
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
  })

export const useCreateAudioTemplateMutation = () =>
  useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .insert({ text: text.trim() })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Durchsage-Vorlage erstellt: ${data.text.substring(0, 30)}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
    },
  })

export const useUpdateAudioTemplateMutation = () =>
  useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .update({ text: text.trim() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Durchsage-Vorlage geändert: ${data.text.substring(0, 30)}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
    },
  })

export const useDeleteAudioTemplateMutation = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('AudioTemplates')
        .delete()
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      await saveUserAction({
        action: data,
        short_description: `Durchsage-Vorlage gelöscht: ${data.text.substring(0, 30)}`,
      })
      await queryClient.invalidateQueries({ queryKey: ['audioTemplates'] })
    },
  })
