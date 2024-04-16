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
      <div className="main-container relative max-h-screen overflow-x-hidden overflow-y-scroll">
        <Header />

        <div className="container mx-auto mb-20">{outlet}</div>

        <Navbar />
        <Toaster />
      </div>
    </>
  )
}
