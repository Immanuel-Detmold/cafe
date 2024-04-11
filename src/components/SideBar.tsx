import { Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const SideBar = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>
        <Bars3Icon className="ml-3 h-14 w-8 text-secondary" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader className="text-left">
          <SheetTitle>Info</SheetTitle>

          {/*  NavLinks */}
          <NavLink
            to="./all-products"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div>Alle Produkte</div>
          </NavLink>

          <NavLink
            to="./"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div>Statistik (Offen)</div>
          </NavLink>
          <NavLink
            to="./"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div>Statistik (Abgeschlossen)</div>
          </NavLink>
          <NavLink
            to="/Me"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div>Me</div>
          </NavLink>
          <NavLink
            to="/Login"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-gray-100 p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div>Login</div>
          </NavLink>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
