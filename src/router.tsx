import { createBrowserRouter } from 'react-router-dom'

import { Navigation } from './components/Navigation'
import AllProducts from './pages/AllProducts/AllProducts'
import { Login } from './pages/Login'
import { Me } from './pages/Me'
import NewOrder from './pages/NewOrder'
import Open from './pages/Open'
import ReadyForPickup from './pages/ReadyForPickup'

// const [isWhiteMode, setWhiteMode] = useState(window.matchMedia('(prefers-color-scheme: dark)')

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
