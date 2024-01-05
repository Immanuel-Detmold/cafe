import { Link, createBrowserRouter, useOutlet } from 'react-router-dom'
import { Login } from './pages/Login'
import { Me } from './pages/Me'
import Navbar from './components/Navbar'


const Navigation = () => {
  const outlet = useOutlet()
  return (
    <div>
      <ul>
        <li className="space-x-2">
          <Link to="login">Login</Link>
          <Link to="me">Me</Link>
        </li>
      </ul>

      <Navbar/>

      {outlet}
    </div>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: '',
      element: <Navigation />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'me',
          element: <Me />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
