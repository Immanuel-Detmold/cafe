import SideBar from './SideBar'

const Header = () => {
  return (
    <header className="bg-primary">
      <div className="relative flex">
        <div className="absolute left-0 top-0">
          <SideBar />
        </div>
        <div className="flex h-16 w-full items-center text-center font-bold">
          <h1 className="w-full text-center text-foreground text-white">
            Titel der Seite
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
