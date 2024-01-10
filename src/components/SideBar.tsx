import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        {/* <Bars3Icon className={isWhiteMode ? 'text-blue-300' :"text-amber-700 w-10 h-10"} /> */}
        <Bars3Icon className="text-secondary w-10 h-16 ml-3" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader className="text-left">
          <SheetTitle>Info</SheetTitle>

          {/*  Buttons */}
          {/* <Button>Alle Produkte</Button>
          <Button>Alle Bestellungen</Button>
          <Button>Statistik (Offen)</Button>
          <Button>Statistik (Abgeschlossen)</Button> */}

          {/*  NavLinks */}
          <SheetClose asChild>
            <NavLink to="/all-products" className={({ isActive }) => (isActive ? 'bg-gray-100 p-2 rounded-md' : 'p-2')}>
              <div>Alle Produkte</div>
            </NavLink>
          </SheetClose>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'bg-gray-100 p-2 rounded-md' : 'p-2')}>
            <div>Alle Bestellungen</div>
          </NavLink>
          <NavLink to="/1" className={({ isActive }) => (isActive ? 'bg-gray-100 p-2 rounded-md' : 'p-2')}>
            <div>Statistik (Offen)</div>
          </NavLink>
          <NavLink to="/2" className={({ isActive }) => (isActive ? 'bg-gray-100 p-2 rounded-md' : 'p-2')}>
            <div>Statistik (Abgeschlossen)</div>
          </NavLink>
        </SheetHeader>
        
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
