import { useLocation } from 'react-router-dom'

import SideBar from './SideBar'

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
  }

  const { pathname } = useLocation()

  return (
    <header className="cafe-color sticky top-0 z-50">
      <div className="relative flex">
        <div className="absolute left-0 top-0">
          <SideBar />
        </div>
        <div className="flex h-14 w-full items-center text-center font-bold">
          <h1 className="w-full text-center text-foreground text-white">
            {titleMap[pathname as keyof typeof titleMap] || ''}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
