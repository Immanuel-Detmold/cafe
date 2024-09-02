import { queryClient } from '@/App'
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
    const { error } = await supabase.rpc('delete_user', {
      user_id: userId,
    })

    // Invalidate queries related to the users if needed
    if (error) {
      console.log(error)
      toast({ title: `Fehler: ${error.message}` })
    } else {
      toast({ title: 'Nutzer wurde gelöscht ✅', duration: 2000 })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/admin/settings/manage-users')
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
