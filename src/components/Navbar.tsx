import { UserGroupIcon } from '@heroicons/react/16/solid'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { BellAlertIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="absolute inset-x-0 bottom-0 flex w-full place-content-around border-t border-gray-700 border-opacity-15 bg-secondary pb-1 pt-2">
      <NavLink
        to="/new-order"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <ClipboardDocumentListIcon className="mx-auto h-7 w-7" />
        <div className="mx-auto text-center text-sm">Neu</div>
      </NavLink>

      <NavLink
        to="/open"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <UserGroupIcon className="mx-auto h-7 w-7" />
        <div className="mx-auto text-center text-xs">Offen</div>
      </NavLink>

      <NavLink
        to="/ready-for-pickup"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <BellAlertIcon className="mx-auto h-7 w-7" />
        <div className="text-xs">Abholbereit</div>
      </NavLink>
    </nav>
  )
}

export default Navbar
