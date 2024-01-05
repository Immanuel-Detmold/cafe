import SideBar from './SideBar'

const Header = () => {
  return (
    <header>
      <div className="flex">
        <div className="absolute top-0 left-0">
          <SideBar />
        </div>
        <div className="w-full text-center h-10 flex items-center font-bold">
          <h1 className="text-center w-full">Titel der Seite</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
