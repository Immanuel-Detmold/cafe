import { Bars3Icon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const SideBar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        {/* <Bars3Icon className={isWhiteMode ? 'text-blue-300' :"text-amber-700 w-10 h-10"} /> */}
        <Bars3Icon className="ml-3 h-14 w-8 text-secondary" />
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
            <NavLink
              to="/all-products"
              className={({ isActive }) =>
                isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
              }
            >
              <div>Alle Produkte</div>
            </NavLink>
          </SheetClose>
          <SheetClose asChild>
            <NavLink
              to="/all-products"
              className={({ isActive }) =>
                isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
              }
            >
              <div>Alle Bestellungen</div>
            </NavLink>
          </SheetClose>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
          >
            <div>Statistik (Offen)</div>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
          >
            <div>Statistik (Abgeschlossen)</div>
          </NavLink>
          <NavLink
            to="/Me"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
          >
            <div>Me</div>
          </NavLink>
          <NavLink
            to="/Login"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
          >
            <div>Login</div>
          </NavLink>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
