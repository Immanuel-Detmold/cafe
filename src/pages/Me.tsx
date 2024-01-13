import { Button } from '@/components/ui/button'

import { useUser } from '../data/useUser'
import { logout } from '../services/supabase'

export const Me = () => {
  const { user } = useUser()
  return (
    <div>
      <h1>Me</h1>
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
      <Button
        onClick={() => {
          logout().catch((error) => {
            console.error('Logout failed', error)
          })
        }}
      >
        Logout
      </Button>
    </div>
  )
}
