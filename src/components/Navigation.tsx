import { useOutlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import Header from './Header'
import Navbar from './Navbar'

// import { ScrollArea } from './ui/scroll-area'

export const Navigation = () => {
  const outlet = useOutlet()
  return (
    <>
      <div className="h-100 main-container relative">
        <Header />

        <div className="h-full w-full overflow-x-hidden scroll-auto">
          <div className="container mx-auto mb-32">{outlet}</div>

          {/* Make Space for Navbar */}
          {/* <div className='h-32'></div> */}
        </div>

        <Navbar />
        <Toaster />
      </div>
    </>
  )
}
