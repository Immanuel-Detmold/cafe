import { Label } from '@radix-ui/react-label'
import { ChevronRightIcon, UserRoundIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import ChangeCategories from './ChangeCategories'
import DesignPage from './DesignPage'
import PasswordChange from './PasswordChange'
import RegisterNewUser from './RegisterNewUser'
import ResetOrderNumber from './ResetOrderNumber'

const SettingsPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-2 grid w-full place-content-center gap-2">
          <DesignPage />
          <PasswordChange />
          <RegisterNewUser />
          <ChangeCategories />
          <ResetOrderNumber />

          {/* Manage Users */}
          {/* <Button
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
          </Button> */}
        </div>
      </div>
    </>
  )
}

export default SettingsPage
