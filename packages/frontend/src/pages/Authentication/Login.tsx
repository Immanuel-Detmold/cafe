import { login, verifyOtp } from '@/services/supabase'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface EmailInputs {
  email: string
}

const EmailStep = ({ onDone }: { onDone: (email: string) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInputs>()

  const onSubmit = handleSubmit(async ({ email }) => {
    const { data, error } = await login({ email })
    if (error) {
      console.error(error)
      return
    }
    if (data) onDone(email)
  }, console.error)

  return (
    <form className="mx-auto max-w-sm" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Your email
        </label>
        <input
          {...register('email', { required: true })}
          type="email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  )
}

interface CodeInputs {
  token: string
}

const CodeStep = ({ email, onDone }: { email: string; onDone: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeInputs>()

  const onSubmit = handleSubmit(async ({ token }) => {
    const { data, error } = await verifyOtp({ email, token })
    if (error) {
      console.error(error)
      return
    }
    if (data) onDone()
  }, console.error)

  return (
    <form className="mx-auto max-w-sm" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Your code
        </label>
        <input
          {...register('token', { required: true })}
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        {errors.token && (
          <span className="text-sm text-red-500">{errors.token.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  )
}

export const Login = () => {
  const [email, setEmail] = useState('')
  const navigateTo = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-5 text-3xl font-bold">Login</h1>
      {email ? (
        <CodeStep
          email={email}
          onDone={() => {
            navigateTo('admin/me')
          }}
        />
      ) : (
        <EmailStep onDone={setEmail} />
      )}
    </div>
  )
}
