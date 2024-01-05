import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_ANONKEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: 'supabase.auth.token',
  },
})

export async function login({ email }: { email: string }) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
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
  return (await supabase.auth.getSession()).data?.session?.user
}
