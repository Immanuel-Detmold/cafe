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
    () => {
      void queryClient.invalidateQueries({ queryKey: ['ordersAndItems'] })
      void queryClient.invalidateQueries({ queryKey: ['appData'] })
    },
  )
  .subscribe()

// Login
export async function login({ email }: { email: string }) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
}

// Login with Password
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

// Verify OTP
export async function verifyOtp({
  email,
  token,
}: {
  email: string
  token: string
}) {
  return await supabase.auth.verifyOtp({ email, token, type: 'email' })
}

// Logout
export async function logout() {
  return await supabase.auth.signOut()
}

export async function getUser() {
  return (await supabase.auth.getSession()).data.session?.user
}

// Create new User / Register User
export async function registerUser({
  email,
  password,
  name,
  role,
}: {
  email: string
  password: string
  name: string
  role: string
}) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: role,
      },
    },
  })
}

// Change Password
export async function changePassword({ newPassword }: { newPassword: string }) {
  return await supabase.auth.updateUser({
    password: newPassword,
  })
}

// Reset Password
export async function resetPassword({ email }: { email: string }) {
  return await supabase.auth.resetPasswordForEmail(email)
}
