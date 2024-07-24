import { TitleMap } from '@/data/data'
import { useUser } from '@/data/useUser'
import { UserGroupIcon } from '@heroicons/react/16/solid'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { BellAlertIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import SideBar from './SideBar'
import { Button } from './ui/button'

const Header = () => {
  const titleMap = TitleMap
  const [normalScreen, setNormalScreen] = useState(true)

  const { pathname } = useLocation()
  const { user } = useUser()

  const getTitle = (path: string) => {
    if (path.startsWith('/admin/all-products/')) {
      return 'Produkt bearbeiten'
    } else if (
      path.startsWith('/admin/inventory/') &&
      !path.endsWith('new-item')
    ) {
      return 'Item bearbeiten'
    } else {
      return titleMap[path as keyof typeof titleMap]
    }
  }

  const isPathInLocation = (path: string) => location.pathname.includes(path)

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

        <div className="container flex h-14 items-center justify-between font-bold">
          <h1 className="ml-8 text-left text-foreground text-white 2xl:ml-0">
            {getTitle(pathname) || ''}
          </h1>
          <div className="flex space-x-2">
            <Button
              variant={'outline'}
              onClick={() => {
                navigate('/admin/new-order')
              }}
              className={`${isPathInLocation('/admin/new-order') ? '' : 'text-gray-400'}`}
            >
              <ClipboardDocumentListIcon className="mx-auto mr-1 h-6 w-6" />
              Neu
            </Button>
            <Button
              variant={'outline'}
              onClick={() => {
                navigate('/admin/open')
              }}
              className={`${isPathInLocation('/admin/open') ? '' : 'text-gray-400'}`}
            >
              <UserGroupIcon className="mx-auto mr-1 h-6 w-6" />
              Offen
            </Button>
            <Button
              variant={'outline'}
              onClick={() => {
                navigate('/admin/ready-for-pickup')
              }}
              className={`${isPathInLocation('/admin/ready-for-pickup') ? '' : 'text-gray-400'}`}
            >
              <BellAlertIcon className="mx-auto mr-1 h-6 w-6" />
              Abholbereit
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
