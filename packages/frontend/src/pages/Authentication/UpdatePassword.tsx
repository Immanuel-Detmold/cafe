import { changePassword } from '@/services/supabase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

const UpdatePassword = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!password) {
      setError('Bitte gib das Passwort ein.')
      return
    }

    setLoading(true)
    const { data, error } = await changePassword({ newPassword: password })
    setLoading(false)

    if (data.user != null) {
      console.log('data', data)
      toast({ title: 'Password aktualisiert! ✅' })
      setError('')
      navigate('/admin/new-order')
    }
    if (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="grid w-80 grid-cols-1 gap-4 rounded-lg border p-4">
          <Label className="text-2xl font-bold">Passwort Aktualisieren</Label>
          <Label className="font-bold">Neues Passwort:</Label>
          <form onSubmit={handleFormSubmit}>
            <Input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <div className="mt-4 flex w-full justify-end">
              <Button type="submit" className="" disabled={loading}>
                {loading ? 'Loading...' : 'Aktualisieren'}
              </Button>
            </div>
          </form>
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </>
  )
}

export default UpdatePassword
