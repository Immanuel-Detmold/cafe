import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useOutlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import Header from './Header'
import Navbar from './Navbar'

// import { ScrollArea } from './ui/scroll-area'

export const Navigation = () => {
  const outlet = useOutlet()
  return (
    <>
      <div className="main-container relative overflow-hidden ">
        <Header />

        <ScrollArea className="h-full w-full overflow-x-hidden scroll-auto">
          <div className="container mx-auto mb-32">{outlet}</div>

          {/* Make Space for Navbar */}
          {/* <div className='h-32'></div> */}
        </ScrollArea>

        <Navbar />
        <Toaster />
      </div>
    </>
  )
}
