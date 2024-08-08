import { resetPassword } from '@/services/supabase'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      setError('Bitte gib deine Email-Adresse ein.')
      return
    }

    setLoading(true)
    const { data, error } = await resetPassword({ email: email })
    setLoading(false)
    if (data) {
      setEmailSent(true)
      setEmail('')
      setError('')
    }
    if (error) {
      setError('Email nicht gefunden.')
    }
  }

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="grid w-80 grid-cols-1 gap-4 rounded-lg border p-4">
            <Label className="text-2xl font-bold">Passwort zurücksetzen</Label>
            <Label className="text-gray-500">
              Bitte gib deine Email-Adresse ein.
            </Label>
            <Label className="font-bold">Email:</Label>
            <form onSubmit={handleFormSubmit}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              ></Input>
              <div className="mt-4 flex w-full justify-end">
                <Button type="submit" className="" disabled={loading}>
                  {loading ? 'Loading...' : 'Email Senden'}
                </Button>
              </div>
              {emailSent && (
                <div className="mt-4 flex justify-end">
                  <Label className="text-right text-emerald-600">
                    Email wurde gesendet! ✅
                  </Label>
                </div>
              )}
            </form>
          </div>

          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
