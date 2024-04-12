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
  } = useForm<FormFields>({
    // defaultValues: {
    //   email: 'cafe@cafe',
    //   password: 'cafe@cafe',
    // },
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { data: authData, error: authError } = await loginWithPW({
        email: data.email,
        password: data.password,
      })
      if (authError) {
        console.error('Auth Error: ', authError)
        setError('root', { message: 'Email oder Passwort ist falsch.' })
      } else {
        console.log('Auth Data: ', authData)
        navigate('/admin/new-order')
      }
    } catch (error) {
      setError('root', { message: 'Email oder Passwort ist falsch.' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col  items-center justify-center">
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

        <Button type="submit" className="mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Login'}
        </Button>
        {errors.root && <Label className="mt-2">{errors.root?.message}</Label>}
      </form>
    </div>
  )
}

export default LoginPw
