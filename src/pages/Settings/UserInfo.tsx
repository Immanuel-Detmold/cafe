import { supabase } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { User } from '@supabase/supabase-js'
import { ChevronLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'

const UserInfo = () => {
  const { userId } = useParams()
  const [user, setUser] = useState<User>()
  const [error, setError] = useState<string>()
  const [name, setName] = useState<string>('')
  const [userRole, setUserRole] = useState('user')
  const { toast } = useToast()

  const navigate = useNavigate()

  console.log(user?.user_metadata.role)
  useEffect(() => {
    const fetchUser = async () => {
      if (userId === undefined) return null
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      if (error) throw error

      setUser(data.user)
      if (data.user.user_metadata.name) {
        setName((data.user.user_metadata.name as string) || '')
      }
      if (data.user.user_metadata.role) {
        setUserRole((data.user.user_metadata.role as string) || 'user')
      }
    }

    void fetchUser()
  }, [userId])

  if (!user) {
    return <div className="mt-2">Loading...</div>
  }

  const handleSave = async () => {
    if (!user) return
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        name: name,
        role: userRole,
      },
    })

    if (error) {
      setError(error.message)
    }
    if (data) {
      toast({
        title: 'Benutzer wurde gespeichert ✅',
        description: 'Benutzer muss sich erneut einloggen.',
      })
      setError('')
      navigate('/admin/settings/manage-users')
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
