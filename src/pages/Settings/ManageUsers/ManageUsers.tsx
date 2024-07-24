import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { User } from '@supabase/supabase-js'
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

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]) // Provide an initial value for the users state variable
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers()
      if (users) {
        // users.forEach((user) => {
        //   console.log(user)
        // }
        // )
        const sorted = users.sort((a, b) => {
          const roleA = (a.user_metadata?.role as string) || ''
          const roleB = (b.user_metadata?.role as string) || ''

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
    }

    void fetchUsers()
  }, [])
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <Label className="mt-2 text-xl font-bold">Benutzerliste</Label>
          {users &&
            users.map((user) => (
              <div key={user.id} className="flex flex-col">
                <Button
                  className="mt-2"
                  onClick={() => {
                    navigate(`/admin/settings/manage-users/${user.id}`)
                  }}
                >
                  <div className="flex w-full min-w-80 justify-between">
                    <div className="flex items-center">
                      {user.user_metadata.role === 'manager' ? (
                        <UserRoundSearchIcon /> // Replace with the actual icon component for managers
                      ) : user.user_metadata.role === 'admin' ? (
                        <UserRoundCogIcon />
                      ) : (
                        <User2Icon />
                      )}
                      <Label className="ml-1 cursor-pointer">
                        {user.user_metadata?.name} ({user.email})
                      </Label>
                    </div>
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
