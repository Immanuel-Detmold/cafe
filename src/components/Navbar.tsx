import { NavLink } from 'react-router-dom'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { UserGroupIcon } from '@heroicons/react/16/solid'
import { BellAlertIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  return (
    <nav className="flex w-full place-content-around">
      <NavLink to="/new-order" className={({ isActive }) => (isActive ? '' : 'text-gray-400')}>
        <ClipboardDocumentListIcon className="mx-auto w-10 h-10" />
        <div className="text-sm text-center mx-auto">Neu</div>
      </NavLink>

      <NavLink to="/open" className={({ isActive }) => (isActive ? '' : 'text-gray-400')}>
        <UserGroupIcon className="mx-auto w-10 h-10" />
        <div className="text-xs text-center mx-auto">Offen</div>
      </NavLink>

      <NavLink to="/ready-for-pickup" className={({ isActive }) => (isActive ? '' : 'text-gray-400')}>
        <BellAlertIcon className="mx-auto w-10 h-10" />
        <div className="text-xs">Abholbereit</div>
      </NavLink>
    </nav>
  )
}

export default Navbar
