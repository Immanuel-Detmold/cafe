import { createBrowserRouter } from 'react-router-dom'

import { Navigation } from './components/Navigation'
import AllProducts from './pages/AllProducts/AllProducts'
import ClosedOrdersToday from './pages/ClosedOrdersToday'
import { Me } from './pages/Me'
import NewOrder from './pages/NewOrder/NewOrder'
import Open from './pages/Open/Open'
import ReadyForPickup from './pages/ReadyForPickup/ReadyForPickup'
import LoginPw from './pages/Statistic/LoginPw'
import StatisticPage from './pages/Statistic/StatisticPage'

// const [isWhiteMode, setWhiteMode] = useState(window.matchMedia('(prefers-color-scheme: dark)')

export const router = createBrowserRouter(
  [
    {
      path: 'screen',
      element: <ReadyForPickup />,
    },
    {
      path: 'admin',
      element: <Navigation />,
      children: [
        {
          path: 'login',
          element: <LoginPw />,
        },
        {
          path: 'me',
          element: <Me />,
        },
        {
          path: 'open',
          element: <Open statusList={['waiting', 'processing']} />,
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
        {
          path: 'closed-orders',
          element: <ClosedOrdersToday />,
        },
        {
          path: 'statistic',
          element: <StatisticPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
