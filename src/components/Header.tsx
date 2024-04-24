import { useLocation } from 'react-router-dom'

import SideBar from './SideBar'

const Header = () => {
  const location = useLocation()
  return (
    <header className="cafe-color sticky top-0 z-50">
      <div className="relative flex">
        <div className="absolute left-0 top-0">
          <SideBar />
        </div>
        <div className="flex h-14 w-full items-center text-center font-bold">
          <h1 className="w-full text-center text-foreground text-white">
            {location.pathname === '/admin/login'
              ? 'Login'
              : location.pathname === '/admin/me'
                ? 'Me'
                : location.pathname === '/admin/open'
                  ? 'Offen'
                  : location.pathname === '/admin/ready-for-pickup'
                    ? 'Abholbereit'
                    : location.pathname === '/admin/new-order'
                      ? 'Neue Bestellung'
                      : location.pathname === '/admin/all-products'
                        ? 'Alle Produkte'
                        : location.pathname === '/admin/statistic'
                          ? 'Statistik'
                          : location.pathname === '/admin/Login'
                            ? 'Login'
                            : location.pathname === '/admin/closed-orders'
                              ? 'Abgeholt (Heute)'
                              : location.pathname === '/admin/cafe-cards'
                                ? 'Cafe Karten'
                                : location.pathname === '/admin/settings'
                                  ? 'Einstellungen'
                                  : ''}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
