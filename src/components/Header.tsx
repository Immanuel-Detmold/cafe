import { useLocation } from 'react-router-dom'

import SideBar from './SideBar'

const Header = () => {
  const location = useLocation()
  return (
    <header className="bg-primary">
      <div className="relative flex">
        <div className="absolute left-0 top-0">
          <SideBar />
        </div>
        <div className="flex h-16 w-full items-center text-center font-bold">
          <h1 className="w-full text-center text-foreground text-white">
            {location.pathname === '/login'
              ? 'Login'
              : location.pathname === '/me'
                ? 'Me'
                : location.pathname === '/open'
                  ? 'Offen'
                  : location.pathname === '/ready-for-pickup'
                    ? 'Abholbereit'
                    : location.pathname === '/new-order'
                      ? 'Neue Bestellung'
                      : location.pathname === '/all-products'
                        ? 'Alle Produkte'
                        : ''}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
