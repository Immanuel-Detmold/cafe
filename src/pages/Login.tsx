import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { login, verifyOtp } from '../services/supabase'

type EmailInputs = {
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
    <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Your email
        </label>
        <input
          {...register('email', { required: true })}
          type="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  )
}

type CodeInputs = {
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
    <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="code"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Your code
        </label>
        <input
          {...register('token', { required: true })}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {errors.token && (
          <span className="text-sm text-red-500">{errors.token.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-5 text-3xl font-bold">Login</h1>
      {email ? (
        <CodeStep email={email} onDone={() => navigateTo('/me')} />
      ) : (
        <EmailStep onDone={setEmail} />
      )}
    </div>
  )
}
