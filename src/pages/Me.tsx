import { useUser } from '../data/useUser'
import { Button } from '@/components/ui/button'

export const Me = () => {
  const { user } = useUser()
  return (
    <div>
      <h1>Me</h1>
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
      <Button>Click me</Button>
    </div>
  )
}
