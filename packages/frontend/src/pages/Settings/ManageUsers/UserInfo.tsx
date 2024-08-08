import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'

import DeleteUser from './DeleteUser'

type reqUser = {
  id: string
  email: string
  raw_user_meta_data?: {
    name?: string
    role?: string
  }
}

const UserInfo = () => {
  const { userId } = useParams()
  const [user, setUser] = useState<reqUser | null>(null)
  const [error, setError] = useState<string>()
  const [name, setName] = useState<string>('')
  const [userRole, setUserRole] = useState('user')
  const { toast } = useToast()

  const navigate = useNavigate()
  // Load Users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.rpc('get_auth_users')
      if (data && userId) {
        const users = data as reqUser[]
        const singleUser = users.find((user) => user.id === userId)
        if (singleUser) {
          setUser(singleUser)
          setName((singleUser?.raw_user_meta_data?.name as string) || '')
          setUserRole(
            (singleUser?.raw_user_meta_data?.role as string) || 'user',
          )
        }
      }
      if (error) {
        toast({ title: 'Fehler beim Laden des Benutzers ❌', duration: 2000 })
      }
    }

    void fetchUsers()
  }, [
    userId,
    toast,
    user?.raw_user_meta_data?.name,
    user?.raw_user_meta_data?.role,
  ])

  if (!user) {
    return (
      <div className="mt-2 flex">
        <Loader2Icon className="animate-spin" />
      </div>
    )
  }

  const handleSave = async () => {
    // Test ID:
    // aa0069e4-8f4b-4445-8a83-a3c1e51e8f84

    const { error, status } = await supabase.rpc('update_single_user', {
      user_id: user.id,
      name: name,
      user_role: userRole,
    })

    if (status === 204) {
      toast({
        title: 'Benutzer wurde gespeichert ✅',
        description: 'Benutzer muss sich erneut einloggen.',
        duration: 5000,
      })
      navigate('/admin/settings/manage-users')
    }
    if (error) {
      setError(error.message)
      toast({
        title: 'Fehler beim Speichern des Benutzers ❌',
        description: error.message,
        duration: 2000,
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-2 grid w-3/4 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Email */}
        <div className="flex flex-col">
          <Label className="font-bold">Email</Label>
          <Label className="">{user.email}</Label>
        </div>

        {/*  Name */}
        <div className="flex flex-col">
          <Label className="font-bold">Name</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          ></Input>
        </div>

        {/* User Role */}
        <div className="flex flex-col">
          <Label className="font-bold">Rolle</Label>
          <RadioGroup
            defaultValue={userRole}
            className="mt-2"
            onValueChange={(value) => {
              setUserRole(value)
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Normaler Benutzer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manager" id="manager" />
              <Label htmlFor="manager">Manager</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Back or Save */}
        <div className="ml-auto mt-auto flex">
          <Button
            className=""
            onClick={() => {
              navigate('/admin/settings/manage-users')
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <DeleteUser userId={user.id} />
          <Button className="ml-2" onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </div>
      {error && <Label>{error}</Label>}
    </div>
  )
}

export default UserInfo
