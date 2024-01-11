import { useEffect } from 'react'
import SideBar from './SideBar'

const Header = () => {

  return (
    
    <header className='bg-primary' >
      <div className="flex relative">
        <div className="absolute top-0 left-0">
          <SideBar />
        </div>
        <div className="w-full text-center h-16 flex items-center font-bold">
          <h1 className="text-center w-full text-foreground text-white">Titel der Seite</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
