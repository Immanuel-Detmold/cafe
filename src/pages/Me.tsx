import { useUser } from '../data/useUser'

export const Me = () => {
  const { user } = useUser()
  return (
    <div>
      <h1>Me</h1>
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
    </div>
  )
}
