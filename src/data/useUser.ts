import { useSyncExternalStore } from 'react'
import { supabase } from '../services/supabase'

let session: Parameters<
  Parameters<typeof supabase.auth.onAuthStateChange>[0]
>[1] = null

const subscribeToAuthChanges = (callback: () => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_, sessionData) => {
    session = sessionData
    callback()
  })
  return () => {
    subscription.unsubscribe()
  }
}

export const useUser = () => {
  const sessionData = useSyncExternalStore(
    subscribeToAuthChanges,
    () => session,
  )
  return { user: sessionData?.user, session: sessionData }
}
