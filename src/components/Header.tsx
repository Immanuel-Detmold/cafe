import { useUser } from '@/data/useUser'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import SideBar from './SideBar'
import { Button } from './ui/button'

const Header = () => {
  const titleMap = {
    '/admin/login': 'Login',
    '/admin/me': 'Me',
    '/admin/open': 'Offen',
    '/admin/ready-for-pickup': 'Abholbereit',
    '/admin/new-order': 'Neue Bestellung',
    '/admin/all-products': 'Alle Produkte',
    '/admin/statistic': 'Statistik',
    '/admin/Login': 'Login',
    '/admin/closed-orders': 'Abgeholt (Heute)',
    '/admin/cafe-cards': 'Cafe Karten',
    '/admin/settings': 'Einstellungen',
    '/admin/settings/user-actions': 'Benutzeraktionen',
    '/admin/create-product': 'Produkt erstellen',
  }
  const [normalScreen, setNormalScreen] = useState(true)

  const { pathname } = useLocation()
  const { user } = useUser()

  const getTitle = (path: string) => {
    if (path.startsWith('/admin/all-products/')) {
      return 'Produkt bearbeiten'
    } else {
      return titleMap[path as keyof typeof titleMap]
    }
  }

  useEffect(() => {
    if (pathname.split('/').pop() === 'login') {
      setNormalScreen(false)
    } else {
      setNormalScreen(true)
    }
  }, [pathname])

  const navigate = useNavigate()
  return (
    <header className="cafe-color sticky top-0 z-20">
      {!user && normalScreen && (
        <div className="absolute right-2 top-2 z-20 cursor-pointer">
          <Button
            variant="link"
            onClick={() => {
              navigate('/admin/login')
            }}
            className="text-amber-600"
          >
            Login
          </Button>
        </div>
      )}

      <div className="relative flex">
        <div className="absolute left-0 top-0">
          <SideBar />
        </div>
        <div className="flex h-14 w-full items-center text-center font-bold">
          <h1 className="w-full text-center text-foreground text-white">
            {getTitle(pathname) || ''}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
