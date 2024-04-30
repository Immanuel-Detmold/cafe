import { useUser } from '@/data/useUser'
import { logout } from '@/services/supabase'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import {
  BookCheckIcon,
  CoffeeIcon,
  CreditCardIcon,
  LineChartIcon,
  LogInIcon,
  LogOutIcon,
  MonitorUpIcon,
  SettingsIcon,
  User2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const SideBar = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useUser()
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>
        <Bars3Icon className="ml-3 h-14 w-8 text-white" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader className="relative text-left">
          <SheetTitle>Info</SheetTitle>

          {/*  All Products */}
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

          {/* Finished (Today) */}
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

          {/* Statistic */}
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

          {/* Cafe Cards */}
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

          {/* Screen */}
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

          {/* Login */}
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

        {/* Footer */}
        <div className="absolute bottom-4">
          {/* Settings */}

          <NavLink
            to="/admin/settings"
            className="p-2"
            onClick={() => {
              setSheetOpen(false)
            }}
          >
            <div className="flex cursor-pointer">
              <SettingsIcon />
              <Label className="ml-1 cursor-pointer">Einstellungen </Label>
            </div>
          </NavLink>
          {/* Logout */}
          <div
            className="flex cursor-pointer"
            onClick={() => {
              logout().catch((error) => {
                console.error('Logout failed', error)
              })
              navigate('/admin/login')
            }}
          >
            <LogOutIcon />
            <Label className="ml-1 cursor-pointer">Logout</Label>
          </div>

          {user?.user_metadata.name && (
            <div className="mt-6 flex">
              <User2Icon />
              <Label className="ml-1"> {user?.user_metadata.name}</Label>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
