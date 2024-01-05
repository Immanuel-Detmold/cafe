import { Link, createBrowserRouter, useOutlet } from 'react-router-dom'
import { Login } from './pages/Login'
import { Me } from './pages/Me'

const Navigation = () => {
  const outlet = useOutlet()
  return (
    <div>
      <ul>
        <li className="space-x-2">
          <Link to="about">About</Link>
          <Link to="contact">Contact</Link>
          <Link to="login">Login</Link>
          <Link to="me">Me</Link>
        </li>
      </ul>
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
          path: 'about',
          element: <div>About</div>,
        },
        {
          path: 'contact',
          element: <div>Contact</div>,
        },
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
