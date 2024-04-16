// import { ScrollArea } from '@radix-ui/react-scroll-area'
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
      <div className="h-100 main-container relative h-screen">
        <Header />

        <ScrollArea className="h-[87%] w-full overflow-auto">
          <div className="container mx-auto">{outlet}</div>
        </ScrollArea>

        <Navbar />
        <Toaster />
      </div>
    </>
  )
}
