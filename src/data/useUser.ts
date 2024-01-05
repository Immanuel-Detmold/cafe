import { useSyncExternalStore } from 'react'
import { getUser, supabase } from '../services/supabase'
import { UserResponse } from '@supabase/supabase-js'

let user: UserResponse | null = null
getUser().then((u) => {
  user = u
})

const subscribeToAuthChanges = (callback: () => void) => {
  const updateUser = async () => {
    user = await getUser()
    console.log('🚀 ~ file: useUser.ts:10 ~ updateUser ~ user:', user)
    callback()
  }
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(updateUser)
  updateUser()
  return () => {
    subscription.unsubscribe()
  }
}

export const useUser = () => {
  const userData = useSyncExternalStore(subscribeToAuthChanges, () => user)
  return { user: userData }
}
