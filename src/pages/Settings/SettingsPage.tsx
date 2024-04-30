import ChangeCategories from './ChangeCategories'
import DesignPage from './DesignPage'
import PasswordChange from './PasswordChange'
import RegisterNewUser from './RegisterNewUser'
import ResetOrderNumber from './ResetOrderNumber'

const SettingsPage = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-2 grid w-full place-content-center gap-2">
          <RegisterNewUser />
          <PasswordChange />
          <ChangeCategories />
          <ResetOrderNumber />
          <DesignPage />
        </div>
      </div>
    </>
  )
}

export default SettingsPage
