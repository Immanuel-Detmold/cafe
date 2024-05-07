// Save User Action
import { supabase } from '@/services/supabase'
import { Database, Json } from '@/services/supabase.types'
import { useQuery } from '@tanstack/react-query'

// Input: email, name, action, user_id. Save User Action
export const saveUserAction = async ({
  action,
  short_description,
}: {
  action: Json
  short_description: string
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user ||
    !action ||
    !user.email ||
    !user.user_metadata ||
    !user.user_metadata.name
  ) {
    throw new Error('User is required')
  }

  const userName = (user.user_metadata?.name as string) ?? 'Unknown User'

  const { data, error } = await supabase
    .from('UserActions')
    .insert({
      email: user.email,
      name: userName,
      action: action,
      user_id: user.id,
      short_description: short_description,
    })
    .select()

  if (error) {
    throw error
  }
  return data
}

export type UserActionsType = Database['public']['Tables']['UserActions']['Row']

export const useUserActionsQuery = () =>
  useQuery({
    queryKey: ['userActions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('UserActions')
        .select()
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data
    },
  })
