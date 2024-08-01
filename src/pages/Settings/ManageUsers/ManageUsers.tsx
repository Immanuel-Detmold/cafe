import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  User2Icon,
  UserRoundCogIcon,
  UserRoundSearchIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type supabaseUser = {
  id: string
  email: string
  raw_user_meta_data?: {
    name?: string
    role?: string
  }
}

const ManageUsers = () => {
  // States
  const [users, setUsers] = useState<supabaseUser[]>([]) // Provide an initial value for the users state variable

  // Hooks
  const navigate = useNavigate()
  const { toast } = useToast()

  // Load Users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.rpc('get_auth_users')
      if (data) {
        const users = data as supabaseUser[]
        const sorted = users.sort((a, b) => {
          const roleA = (a.raw_user_meta_data?.role as string) || ''
          const roleB = (b.raw_user_meta_data?.role as string) || ''

          if (roleA < roleB) {
            return 1
          }
          if (roleA > roleB) {
            return -1
          }
          return 0
        })
        setUsers(sorted)
      }
      if (error) {
        toast({ title: 'Fehler beim Laden der Benutzer ❌', duration: 2000 })
      }
    }

    void fetchUsers()
  }, [toast])

  const truncateEmail = (email: string) => {
    return email.length > 20 ? email.substring(0, 20) + '...' : email
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <Label className="mt-2 text-xl font-bold">Benutzerliste</Label>
          {users &&
            users.map((user) => (
              <div key={user.id} className="flex flex-col">
                <Button
                  className="mt-2 text-wrap"
                  onClick={() => {
                    navigate(`/admin/settings/manage-users/${user.id}`)
                  }}
                >
                  <div className="flex w-full max-w-96 justify-between">
                    {/* User Icon and Label (Left side)*/}
                    <div className="flex items-center">
                      {user.raw_user_meta_data?.role === 'manager' ? (
                        <UserRoundSearchIcon /> // Replace with the actual icon component for managers
                      ) : user.raw_user_meta_data?.role === 'admin' ? (
                        <UserRoundCogIcon />
                      ) : (
                        <User2Icon />
                      )}

                      <Label className="ml-1 cursor-pointer ">
                        {user.raw_user_meta_data?.name} (
                        {truncateEmail(user.email)})
                      </Label>
                    </div>
                    {/* Chevron Icon */}
                    <ChevronRightIcon className="ml-1" />
                  </div>
                </Button>
              </div>
            ))}

          {/* Back Button */}
          <Button
            onClick={() => {
              navigate('/admin/settings')
            }}
            className="ml-auto mt-2"
          >
            <ChevronLeftIcon />
          </Button>
        </div>
      </div>
    </>
  )
}

export default ManageUsers
