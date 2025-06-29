import { useUser } from '@/data/useUser'
import { Label } from '@radix-ui/react-label'
import {
  ChevronRightIcon,
  CircleDollarSign,
  Edit2Icon,
  HistoryIcon,
  NetworkIcon,
  PrinterIcon,
  SettingsIcon,
  UserRoundIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import ChangeCategories from './ChangeCategories'
import ChangeInventoryCategories from './ChangeInventoryCategories'
import DesignPage from './DesignPage'
import PasswordChange from './PasswordChange'
import RegisterNewUser from './RegisterNewUser'
import ResetOrderNumber from './ResetOrderNumber'

const SettingsPage = () => {
  const [userRole, setUserRole] = useState('user')
  const { user } = useUser()
  const navigate = useNavigate()

  // Get Role
  useEffect(() => {
    const role = user?.user_metadata?.role as string
    if (role) {
      setUserRole(role)
    }
  }, [user])

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-2 grid w-full place-content-center gap-2">
          <DesignPage />
          <PasswordChange />
          {userRole === 'admin' || userRole === 'manager' ? (
            <RegisterNewUser />
          ) : null}
          {userRole === 'admin' && <ChangeCategories />}
          {userRole === 'admin' && <ChangeInventoryCategories />}
          {userRole === 'admin' && <ResetOrderNumber />}

          {/* Manage Users */}
          {userRole === 'admin' && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/manage-users')
              }}
            >
              <div className="flex items-center">
                <UserRoundIcon />{' '}
                <Label className="ml-1 cursor-pointer">Manage Users</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* User Logs */}
          {userRole === 'admin' && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/user-actions')
              }}
            >
              <div className="flex items-center">
                <HistoryIcon />{' '}
                <Label className="ml-1 cursor-pointer">Benutzer Aktionen</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* Network */}
          {['admin', 'manager'].includes(userRole) && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/network')
              }}
            >
              <div className="flex items-center">
                <NetworkIcon />{' '}
                <Label className="ml-1 cursor-pointer">Netzwerk</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* Printer */}
          {['admin', 'manager'].includes(userRole) && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/printer')
              }}
            >
              <div className="flex items-center">
                <PrinterIcon />{' '}
                <Label className="ml-1 cursor-pointer">Drucker</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* Advertisement */}
          {['admin', 'manager'].includes(userRole) && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/advertisement')
              }}
            >
              <div className="flex items-center">
                <Edit2Icon />{' '}
                <Label className="ml-1 cursor-pointer">Werbung anpassen</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* RevenueStreams */}
          {['admin', 'manager'].includes(userRole) && (
            <Button
              className="flex justify-between"
              onClick={() => {
                navigate('/admin/settings/revenue-streams')
              }}
            >
              <div className="flex items-center">
                <CircleDollarSign />{' '}
                <Label className="ml-1 cursor-pointer">Umsatzgruppen</Label>
              </div>
              <ChevronRightIcon className="" />
            </Button>
          )}

          {/* Organisation Data */}
          <Button
            className="flex justify-between"
            onClick={() => {
              navigate('/admin/settings/organisation')
            }}
          >
            <div className="flex items-center">
              <SettingsIcon />{' '}
              <Label className="ml-1 cursor-pointer">Organisationsdaten</Label>
            </div>
            <ChevronRightIcon className="" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default SettingsPage
