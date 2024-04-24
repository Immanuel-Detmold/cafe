import { useUser } from '@/data/useUser'
import { changePassword } from '@/services/supabase'
import { Label } from '@radix-ui/react-label'
import { ChevronDownIcon, KeyIcon, SaveIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const PasswordChange = () => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const { user } = useUser()
  const [password, setPassword] = useState('')

  const { toast } = useToast()

  const handlePasswordChange = async () => {
    if (password === '') {
      setError('Bitte gib ein neues Passwort ein.')
    } else {
      const { data, error } = await changePassword({ newPassword: password })

      if (error) {
        setError(error.message)
        return
      }
      if (data) {
        setPassword('')
        setError('')

        toast({ title: 'Passwort wurde geändert ✅' })
      }
    }
  }

  return (
    <>
      <div>
        <Button
          className="w-full"
          onClick={() => {
            setOpen(!open)
          }}
        >
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <KeyIcon />
              <Label className="ml-1 cursor-pointer">Passwort ändern</Label>
            </div>
            <ChevronDownIcon className="" />
          </div>
        </Button>

        {open && (
          <div className="flex flex-col">
            <Label className="mt-2 font-bold">Email: {user?.email} </Label>
            <Input
              className="mt-2"
              type="password"
              placeholder="Neues Passwort"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <Button
              className="mt-2"
              onClick={handlePasswordChange}
              variant="outline"
            >
              <SaveIcon />{' '}
              <Label className="ml-1 cursor-pointer">Speichern</Label>
            </Button>
            {error && (
              <div className="mt-2">
                <Label className="text-red-600">{error}</Label>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default PasswordChange
