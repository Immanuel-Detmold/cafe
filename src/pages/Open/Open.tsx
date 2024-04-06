import { imgPlaceHolder } from '@/data/data'
import { useOrderQuery } from '@/data/useOrders'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-select'

import { Button } from '@/components/ui/button'

const Open = () => {
  const { data: orders, error } = useOrderQuery('waiting')

  if (orders) {
    console.log(orders)
  }

  return (
    <div className="flex flex-col">
      {error && <div>{JSON.stringify(error)}</div>}
      <Button
        className="mt-2"
        onClick={() => {
          console.log(orders)
        }}
      >
        Test
      </Button>
      {/* Order Card */}
      <div className="mt-2 rounded-lg border">
        {/* Order Card Top*/}
        <div className="flex w-full items-center justify-between overflow-hidden bg-secondary p-2">
          {/* Left Info Box */}
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8" />
            <div className="ml-1 flex flex-col">
              <Label className="font-bold">Ronny Schlidt</Label>
              <Label>18:55</Label>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="flex flex-col">
            <Label className="text-right">Bestellung: #13</Label>
            <Label className="text-right">Summe: 29€</Label>
          </div>
        </div>

        {/* Order Card Middle */}
        <div className="px-2 pb-2">
          {/* Row for Product */}
          <div className="mt-2 grid grid-cols-6">
            {/* Product Name and Img */}
            <div className="col-span-4 flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage className="rounded-full" src={imgPlaceHolder} />
              </Avatar>
              <Label className="ml-1">Cappuccio</Label>
              {/* Comment Bubble, if it exists*/}
              <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
            </div>
            {/* Quantity */}
            <div className="item-center col-span-1 flex">
              <ShoppingBagIcon className="h-6" />
              <Label>1</Label>
            </div>

            <div className="col-span-1 flex flex-col">
              <Label className="text-right">12€</Label>
            </div>
          </div>

          {/* Produkt2 */}
          <div className="mt-2 grid grid-cols-6">
            {/* Product Name and Img */}
            <div className="col-span-4 flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage className="rounded-full" src={imgPlaceHolder} />
              </Avatar>
              <Label className="ml-1">Roter Tee</Label>
              {/* Comment Bubble, if it exists*/}
              <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
            </div>
            {/* Quantity */}
            <div className="item-center col-span-1 flex">
              <ShoppingBagIcon className="h-6" />
              <Label>3</Label>
            </div>
            <div className="col-span-1 flex flex-col">
              <Label className="text-right">15€</Label>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <Separator className="mx-2 mb-1 mt-2 border-t" />
        {/* Order Card Bottom */}
        <div className="px-2 pb-2">
          <Label className="">
            Kommentar: Bitte achtet darauf dass der Kaffee heiß bleibt.
          </Label>
          <div className="mt-2 flex justify-between">
            <Button variant="outline" className="">
              Details
            </Button>
            <div>
              <Button variant="destructive">
                Abbruch
                {/* <TrashIcon className='h-5 ml-1'/> */}
              </Button>
              <Button className="ml-2" variant="default">
                In Bearbeitung
              </Button>
            </div>
          </div>
        </div>

        {/* End*/}
      </div>

      {/* Order Card 2*/}
      <div className="mt-2 rounded-lg border">
        {/* Order Card Top*/}
        <div className="flex w-full items-center justify-between overflow-hidden bg-secondary p-2">
          {/* Left Info Box */}
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8" />
            <div className="ml-1 flex flex-col">
              <Label className="font-bold">Michael Barbula</Label>
              <Label>18:55</Label>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="flex flex-col">
            <Label className="text-right">Bestellung: #13</Label>

            <Label className="text-right">Summe: 29€</Label>
          </div>
        </div>

        {/* Order Card Middle */}
        <div className="px-2 pb-2">
          {/* Row for Product */}
          <div className="mt-2 grid grid-cols-6">
            {/* Product Name and Img */}
            <div className="col-span-4 flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage className="rounded-full" src={imgPlaceHolder} />
              </Avatar>
              <Label className="ml-1">Cappuccio</Label>
              {/* Comment Bubble, if it exists*/}
              <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
            </div>
            {/* Quantity */}
            <div className="item-center col-span-1 flex">
              <ShoppingBagIcon className="h-6" />
              <Label>1</Label>
            </div>

            <div className="col-span-1 flex flex-col">
              <Label className="text-right">12€</Label>
            </div>
          </div>

          {/* Produkt2 */}
          <div className="mt-2 grid grid-cols-6">
            {/* Product Name and Img */}
            <div className="col-span-4 flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage className="rounded-full" src={imgPlaceHolder} />
              </Avatar>
              <Label className="ml-1">Roter Tee</Label>
              {/* Comment Bubble, if it exists*/}
              <ChatBubbleBottomCenterTextIcon className="ml-2 h-5 cursor-pointer text-red-700" />
            </div>
            {/* Quantity */}
            <div className="item-center col-span-1 flex">
              <ShoppingBagIcon className="h-6" />
              <Label>3</Label>
            </div>
            <div className="col-span-1 flex flex-col">
              <Label className="text-right">15€</Label>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <Separator className="mx-2 mb-1 mt-2 border-t" />
        {/* Order Card Bottom */}
        <div className="px-2 pb-2">
          <Label className="">
            Kommentar: Bitte achtet darauf dass der Kaffee heiß bleibt.
          </Label>
          <div className="mt-2 flex justify-between">
            <Button variant="outline" className="">
              Details
            </Button>
            <div>
              <Button variant="destructive">
                Abbruch
                {/* <TrashIcon className='h-5 ml-1'/> */}
              </Button>
              <Button className="ml-2" variant="default">
                In Bearbeitung
              </Button>
            </div>
          </div>
        </div>

        {/* End*/}
      </div>
    </div>
  )
}

export default Open
