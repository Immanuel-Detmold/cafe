// import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useOutlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import Header from './Header'
import HeaderPC from './HeaderPC'
import Navbar from './Navbar'

// import { ScrollArea } from './ui/scroll-area'
export const Navigation = () => {
  const outlet = useOutlet()
  const { pathname } = useLocation()
  const showNavbar =
    pathname.endsWith('new-order') ||
    pathname.endsWith('open') ||
    pathname.endsWith('ready-for-pickup')

  const isBigScreen = useMediaQuery({ query: '(min-width: 800px)' })
  return (
    <>
      <div className="main-container relative flex max-h-screen flex-col">
        {isBigScreen ? <HeaderPC /> : <Header />}
        <div
          className={`container flex-1 overflow-y-auto ${showNavbar && !isBigScreen ? 'mb-20' : 'mb-2'}`}
        >
          {outlet}
        </div>

        {/* <div className='border h-32'></div> */}
        {showNavbar && !isBigScreen && <Navbar />}

        <Toaster />
      </div>
    </>
  )
}
