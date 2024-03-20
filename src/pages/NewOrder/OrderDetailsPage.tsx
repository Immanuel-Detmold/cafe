import { TrashIcon } from '@heroicons/react/24/outline'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const OrderDetailsPage = () => {
  const placeHolderImage =
    'https://hmwxeqgcfhhumndveboe.supabase.co/storage/v1/object/public/ProductImages/PlaceHolder.jpg?t=2024-03-14T12%3A07%3A02.697Z'

  return (
    <div className="ml-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Details zur Bestellung</DialogTitle>
            <DialogDescription>
              Hier kannst du deine Bestellung überprüfen und Produkte entfernen
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center">
                <Label htmlFor="name" className="font-bold">
                  Produkt
                </Label>
              </div>
              <Label className="font-bold">Anzahl</Label>
            </div>

            <Separator />

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center">
                <Label className="">Kaffee</Label>
                <Avatar className="ml-1 h-6 w-6">
                  <AvatarImage src={placeHolderImage} />
                </Avatar>
              </div>
              <Label className="flex items-center">
                2 <TrashIcon className="ml-2 h-5 w-5" />
              </Label>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center">
                <Label className="">Tee</Label>
                <Avatar className="ml-1 h-6 w-6">
                  <AvatarImage src={placeHolderImage} />
                </Avatar>
              </div>
              <Label className="flex items-center">
                3 <TrashIcon className="ml-2 h-5 w-5" />
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderDetailsPage
