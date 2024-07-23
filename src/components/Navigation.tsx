// import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useLocation, useOutlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import Header from './Header'
import Navbar from './Navbar'

// import { ScrollArea } from './ui/scroll-area'
export const Navigation = () => {
  const outlet = useOutlet()
  const { pathname } = useLocation()
  const showNavbar =
    pathname.endsWith('new-order') ||
    pathname.endsWith('open') ||
    pathname.endsWith('ready-for-pickup')
  return (
    <>
      <div className="main-container relative flex max-h-screen flex-col">
        <Header />

        <div
          className={`container flex-1 overflow-y-auto ${showNavbar ? 'mb-20' : 'mb-4'}`}
        >
          {outlet}
        </div>

        {/* <div className='border h-32'></div> */}
        {showNavbar && <Navbar />}

        <Toaster />
      </div>
    </>
  )
}
