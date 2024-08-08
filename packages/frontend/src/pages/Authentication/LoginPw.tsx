import { loginWithPW } from '@/services/supabase'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormFields = {
  email: string
  password: string
}
const LoginPw = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({})

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { error: authError } = await loginWithPW({
        email: data.email,
        password: data.password,
      })
      if (authError) {
        setError('root', { message: 'Email oder Passwort ist falsch.' })
      } else {
        navigate('/admin/new-order')
      }
    } catch (error) {
      setError('root', { message: 'Email oder Passwort ist falsch.' })
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <form
        className="flex flex-col items-end"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid w-80 grid-cols-1 gap-4 rounded-lg border p-4">
          <Label className="text-2xl font-bold">Account Login</Label>
          <Label className="text-gray-500">
            Die Registrierung erfolgt über einen Admin.
          </Label>
          <Label className="font-bold">Email:</Label>
          <Input {...register('email')} type="email" required></Input>

          <Label className="font-bold">Password:</Label>
          <Input {...register('password')} type="password" required></Input>
        </div>

        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Login'}
          </Button>
          <Button
            className="mt-2 w-full"
            onClick={() => {
              navigate('/admin/forgot-pw')
            }}
            variant={'ghost'}
            tabIndex={-1}
          >
            Passwort vergessen
          </Button>
          {errors.root && (
            <Label className="mt-2 text-red-500">{errors.root?.message}</Label>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPw
