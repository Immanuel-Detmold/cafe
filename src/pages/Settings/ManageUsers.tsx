import { supabase } from '@/services/supabase'

const ManageUsers = () => {
  const fetchUsers = async () => {
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers()
    if (users) {
      console.log(users)
      return users
    }
  }
  const users = fetchUsers()
  return (
    <>
      <div>{JSON.stringify(users)}</div>
    </>
  )
}

export default ManageUsers
