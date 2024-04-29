// import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useOutlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import Header from './Header'
import Navbar from './Navbar'

// import { ScrollArea } from './ui/scroll-area'
export const Navigation = () => {
  const outlet = useOutlet()
  return (
    <>
      <div className="main-container relative flex max-h-screen flex-col">
        <Header />

        <div className="container mb-20 flex-1 overflow-y-auto">{outlet}</div>

        {/* <div className='border h-32'></div> */}
        <Navbar />
        <Toaster />
      </div>
    </>
  )
}
