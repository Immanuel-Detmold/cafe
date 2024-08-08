import { useUser } from '@/data/useUser'
import { logout } from '@/services/supabase'
import { Bars3Icon } from '@heroicons/react/24/outline'
import {
  ActivityIcon,
  BookCheckIcon,
  CoffeeIcon,
  CoinsIcon,
  CreditCardIcon,
  HelpingHand,
  LineChartIcon,
  LogInIcon,
  LogOutIcon,
  MonitorUpIcon,
  SettingsIcon,
  User2Icon,
  Utensils,
  WarehouseIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const SideBar = () => {
  // States
  const [sheetOpen, setSheetOpen] = useState(false)
  const [userRole, setUserRole] = useState('user')

  // Hooks
  const navigate = useNavigate()
  const { user } = useUser()

  // Use Effect
  useEffect(() => {
    const role = user?.user_metadata?.role as string
    if (role) {
      setUserRole(role)
    }
  }, [user])

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>
        <Bars3Icon className="ml-3 h-14 w-8 text-white" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <div className="relative flex h-full flex-col">
          {/* Top Side */}
          <div
            className="flex max-h-full flex-grow flex-col space-y-2 overflow-y-auto"
            id="scrollbar2"
          >
            <SheetTitle>Info</SheetTitle>

            {/* Service */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('new-order') || location.pathname.includes('open') || location.pathname.includes('ready-for-pickup') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/admin/new-order')
                setSheetOpen(false)
              }}
            >
              <HelpingHand className="mr-1 " />
              <h3 className="">Service</h3>
            </div>

            {/* Alle Produkte */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('all-products') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/admin/all-products')
                setSheetOpen(false)
              }}
            >
              <CoffeeIcon className="mr-1" />
              <h3>Alle Produkte</h3>
            </div>

            {/* Finished (Today) */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('closed-orders') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/admin/closed-orders')
                setSheetOpen(false)
              }}
            >
              <BookCheckIcon className="mr-1" />
              <h3>Abgeschlossen (Heute)</h3>
            </div>

            {/* Statistic */}
            {['admin', 'manager'].includes(userRole) && (
              <div
                className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/statistic') ? 'bg-secondary' : ''} rounded-md`}
                onClick={() => {
                  navigate('/admin/statistic')
                  setSheetOpen(false)
                }}
              >
                <LineChartIcon className="mr-1" />
                <h3>Statistik</h3>
              </div>
            )}

            {/* Expense */}
            {['admin', 'manager'].includes(userRole) && (
              <div
                className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/expense') ? 'bg-secondary' : ''} rounded-md`}
                onClick={() => {
                  navigate('/admin/expense')
                  setSheetOpen(false)
                }}
              >
                <CoinsIcon className="mr-1" />
                <h3>Ausgaben</h3>
              </div>
            )}

            {/* Inventar */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/inventory') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/admin/inventory')
                setSheetOpen(false)
              }}
            >
              <WarehouseIcon className="mr-1" />
              <h3>Inventar</h3>
            </div>

            {/* Login */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname === '/' ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/')
                setSheetOpen(false)
              }}
            >
              <LogInIcon className="mr-1" />
              <h3>Login</h3>
            </div>

            {/* Login */}
            <div>
              <Accordion
                type="single"
                collapsible
                className="ml-3 overflow-x-hidden"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>Weitere Funktionien</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex w-full flex-col space-y-2">
                      {/* Screen */}
                      <div
                        className={`flex cursor-pointer p-2 ${location.pathname.includes('/screen') ? 'bg-secondary' : ''} rounded-md`}
                        onClick={() => {
                          navigate('/screen')
                          setSheetOpen(false)
                        }}
                      >
                        <MonitorUpIcon className="mr-1" />
                        <h3>Abholbereit</h3>
                      </div>

                      {/* Advertisment Page */}
                      <div
                        className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/cafe-cards') ? 'bg-secondary' : ''} rounded-md`}
                        onClick={() => {
                          navigate('/advertisement')
                          setSheetOpen(false)
                        }}
                      >
                        <MonitorUpIcon className="mr-1" />
                        <h3>Werbenzeige</h3>
                      </div>

                      {/* Menu Card */}
                      <div
                        className={`flex cursor-pointer p-2 ${location.pathname.includes('/menu') ? 'bg-secondary' : ''} rounded-md`}
                        onClick={() => {
                          navigate('/menu')
                          setSheetOpen(false)
                        }}
                      >
                        <Utensils className="mr-1" />
                        <h3>Menükarte</h3>
                      </div>

                      {/* Audio */}
                      <div
                        className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/audio') ? 'bg-secondary' : ''} rounded-md`}
                        onClick={() => {
                          navigate('/admin/audio')
                          setSheetOpen(false)
                        }}
                      >
                        <ActivityIcon className="mr-1" />
                        <h3>Audio</h3>
                      </div>

                      {/* Cafe Cards */}
                      <div
                        className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/cafe-cards') ? 'bg-secondary' : ''} rounded-md`}
                        onClick={() => {
                          navigate('/admin/cafe-cards')
                          setSheetOpen(false)
                        }}
                      >
                        <CreditCardIcon className="mr-1" />
                        <h3>Cafe Karten</h3>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-background flex w-full flex-col space-y-1">
            <div className="bg-secondary h-1 w-full rounded-xl"></div>
            {/* Settings */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/settings') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                navigate('/admin/settings')
                setSheetOpen(false)
              }}
            >
              <SettingsIcon className="mr-1" />
              <h3>Einstellungen</h3>
            </div>

            {/* Logout */}
            <div
              className={`flex cursor-pointer p-2 ${location.pathname.includes('/admin/login') ? 'bg-secondary' : ''} rounded-md`}
              onClick={() => {
                logout().catch(() => {})
                navigate('/admin/login')
                setSheetOpen(false)
              }}
            >
              <LogOutIcon className="mr-1" />
              <h3>Logout</h3>
            </div>

            {user?.user_metadata.name && (
              <div className="flex rounded-md p-2">
                <User2Icon className="mr-1" />
                <h3>{user?.user_metadata.name}</h3>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
