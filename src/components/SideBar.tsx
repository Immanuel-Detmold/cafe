import { Bars3Icon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import {
  BookCheckIcon,
  CoffeeIcon,
  CreditCardIcon,
  LineChartIcon,
  LogInIcon,
  MonitorUpIcon,
} from 'lucide-react'
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
            <div className="flex cursor-pointer">
              <CoffeeIcon />
              <Label className="ml-1 cursor-pointer">Alle Produkte</Label>
            </div>
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
            <div className="flex cursor-pointer">
              <BookCheckIcon />
              <Label className="ml-1 cursor-pointer">
                Abgeschlossen (Heute)
              </Label>
            </div>
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
            <div className="flex cursor-pointer">
              <LineChartIcon />
              <Label className="ml-1 cursor-pointer">Statistik</Label>
            </div>
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
            <div className="flex cursor-pointer">
              <CreditCardIcon />
              <Label className="ml-1 cursor-pointer">Cafe Karten</Label>
            </div>
          </NavLink>

          <NavLink
            to="/screen"
            className={({ isActive }) =>
              isActive ? 'rounded-md bg-secondary p-2' : 'p-2'
            }
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div className="flex cursor-pointer">
              <MonitorUpIcon />
              <Label className="ml-1 cursor-pointer">Screen</Label>
            </div>
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
            <div className="flex cursor-pointer">
              <LogInIcon />
              <Label className="ml-1 cursor-pointer">Login </Label>
            </div>
          </NavLink>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
