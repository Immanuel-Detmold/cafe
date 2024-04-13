import { queryClient } from '@/App'
import { createClient } from '@supabase/supabase-js'

import { Database } from './supabase.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_ANONKEY as string

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: 'supabase.auth.token',
  },
})

supabase
  .channel('order-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
    },
    (payload) => {
      console.log('Realtime Payload: ', payload)
      void queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
    },
  )
  .subscribe()

export async function login({ email }: { email: string }) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
}

export async function loginWithPW({
  email,
  password,
}: {
  email: string
  password: string
}) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function verifyOtp({
  email,
  token,
}: {
  email: string
  token: string
}) {
  return await supabase.auth.verifyOtp({ email, token, type: 'email' })
}

export async function logout() {
  return await supabase.auth.signOut()
}

export async function getUser() {
  return (await supabase.auth.getSession()).data.session?.user
}
