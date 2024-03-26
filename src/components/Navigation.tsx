import { useOutlet } from 'react-router-dom'

import Header from './Header'
import Navbar from './Navbar'
import { ScrollArea } from './ui/scroll-area'

export const Navigation = () => {
  const outlet = useOutlet()
  return (
    <>
      <div className="h-100 relative h-screen">
        <Header />

        <ScrollArea className="h-[87%] w-full overflow-hidden">
          <div className="container mx-auto">{outlet}</div>
        </ScrollArea>

        <Navbar />
      </div>
    </>
  )
}
