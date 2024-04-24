import { registerUser } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { ChevronDownIcon, UserPlus2Icon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const RegisterNewUser = () => {
  const [addUser, setAddUser] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()

  // Register new user
  const handleRegisterUser = async () => {
    if (email === '' || password === '' || name === '') {
      setError('Bitte fülle alle Felder aus.')
    } else {
      const { data, error } = await registerUser({ email, password, name })

      if (error) {
        console.error(error)
        setError(error.message)
        toast({ title: 'Fehler ❌', description: error.message })
        return
      }

      // Handle successful registration
      if (data) {
        setEmail('')
        setError('')
        toast({ title: 'Nutzer wurde angelegt ✅' })
      }
    }
  }
  return (
    <div>
      <Button
        onClick={() => {
          setAddUser(!addUser)
        }}
      >
        <div className="flex w-full min-w-80 justify-between">
          <div className="flex items-center">
            <UserPlus2Icon />
            <Label className="ml-1 cursor-pointer">
              Neuen Benutzer erstellen
            </Label>
          </div>
          <ChevronDownIcon className="ml-1" />
        </div>
      </Button>
      {addUser && (
        <div className="mt-2 flex flex-col">
          <Label className="font-bold">E-Mail</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <Label className="font-bold">Passwort</Label>
          <Input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />

          <Label className="font-bold">Name</Label>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />

          <Button
            className="mt-2"
            onClick={handleRegisterUser}
            variant="outline"
          >
            <UserPlus2Icon />
            <Label className="ml-1 cursor-pointer">Nutzer Anlegen</Label>
          </Button>

          {error && (
            <p className="text-red-600">
              Fehler:
              <Label className="ml-2">{error}</Label>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default RegisterNewUser
