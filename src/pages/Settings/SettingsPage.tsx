import ChangeCategories from './ChangeCategories'
import PasswordChange from './PasswordChange'
import RegisterNewUser from './RegisterNewUser'

const SettingsPage = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-2 grid w-full place-content-center gap-2">
          <RegisterNewUser />
          <PasswordChange />
          <ChangeCategories />
        </div>
      </div>
    </>
  )
}

export default SettingsPage
