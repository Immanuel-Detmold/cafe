import { createBrowserRouter, useOutlet } from 'react-router-dom'
import { Login } from './pages/Login'
import { Me } from './pages/Me'
import Navbar from './components/Navbar'
import Open from './pages/Open'
import ReadyForPickup from './pages/ReadyForPickup'
import NewOrder from './pages/NewOrder'

import Header from './components/Header'
import AllProducts from './pages/AllProducts'

// const [isWhiteMode, setWhiteMode] = useState(window.matchMedia('(prefers-color-scheme: dark)')

const Navigation = () => {
  const outlet = useOutlet()
  return (
    <div>
      <Header />
      <Navbar />
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
        {
          path: 'open',
          element: <Open />,
        },
        {
          path: 'ready-for-pickup',
          element: <ReadyForPickup />,
        },
        {
          path: 'new-order',
          element: <NewOrder />,
        },
        {
          path: 'all-products',
          element: <AllProducts />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
