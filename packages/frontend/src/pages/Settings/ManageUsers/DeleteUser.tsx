import { supabase } from '@/services/supabase'
import { TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

// Adjust the import path as necessary

const DeleteUser = ({ userId }: { userId: string }) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error
      if (data) {
        navigate('/admin/settings/manage-users')
      }
      toast({ title: 'User deleted successfully ✅', duration: 2000 })
      // Invalidate queries related to the users if needed
      // queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      toast({ title: `Error: ${(error as Error).message}` })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="ml-2">
        <div className="">
          <Button className="w-min bg-red-700" variant="destructive">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Möchtest du den Benutzer wirklich löschen?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="">
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>

            <AlertDialogAction
              className="ml-2 bg-red-700"
              onClick={async () => {
                await handleDeleteUser(userId)
              }}
            >
              Löschen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUser
