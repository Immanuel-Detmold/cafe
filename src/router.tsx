import { createHashRouter } from 'react-router-dom'
import { Login } from './pages/Login'

const path = window.location.pathname

export const router = createHashRouter([
  {
    path,
    element: <div>Home</div>,
  },
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
])
