import { UserGroupIcon } from '@heroicons/react/16/solid'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { BellAlertIcon } from '@heroicons/react/24/outline'
import { Label } from '@radix-ui/react-label'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-secondary fixed bottom-0 flex w-full place-content-around border-t border-gray-700 border-opacity-15 pb-1 pt-2">
      <NavLink
        to="./new-order"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <ClipboardDocumentListIcon className="mx-auto h-9 w-9" />
        <Label className="mx-auto text-center text-sm">Neu</Label>
      </NavLink>

      <NavLink
        to="./open"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <UserGroupIcon className="mx-auto h-9 w-9" />
        <Label className="mx-auto text-center text-xs">Offen</Label>
      </NavLink>

      <NavLink
        to="./ready-for-pickup"
        className={({ isActive }) => (isActive ? '' : 'text-gray-400')}
      >
        <BellAlertIcon className="mx-auto h-9 w-9" />
        <Label className="text mx-auto text-xs">Abholbereit</Label>
      </NavLink>
    </nav>
  )
}

export default Navbar
