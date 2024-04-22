import { Bars3Icon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
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
        <Bars3Icon className="ml-3 h-14 w-8 text-white" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader className="text-left">
          <SheetTitle>Info</SheetTitle>

          {/*  NavLinks */}
          <NavLink
            to="./all-products"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <Label className="cursor-pointer">Alle Produkte</Label>
          </NavLink>

          <NavLink
            to="./closed-orders"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <Label className="cursor-pointer">Abgeschlossen (Heute)</Label>
          </NavLink>

          <NavLink
            to="/admin/statistic"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <Label className="cursor-pointer">Statistik</Label>
          </NavLink>
          <NavLink
            to="/admin/cafe-cards"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <Label className="cursor-pointer">Cafe Karten</Label>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <Label className="cursor-pointer">Login</Label>
          </NavLink>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
