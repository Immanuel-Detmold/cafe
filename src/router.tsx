import { createBrowserRouter, redirect } from 'react-router-dom'

import { Navigation } from './components/Navigation'
import AllProducts from './pages/AllProducts/AllProducts'
import ClosedOrdersToday from './pages/ClosedOrdersToday'
import { Me } from './pages/Me'
import NewOrder from './pages/NewOrder/NewOrder'
import Open from './pages/Open/Open'
import ReadyForPickup from './pages/ReadyForPickup/ReadyForPickup'
import OrdersPDF from './pages/Statistic/GeneratePDF/OrdersPDF'
import LoginPw from './pages/Statistic/LoginPw'
import StatisticPage from './pages/Statistic/StatisticPage'
import { getUser } from './services/supabase'

// const [isWhiteMode, setWhiteMode] = useState(window.matchMedia('(prefers-color-scheme: dark)')

export const router = createBrowserRouter(
  [
    {
      path: '/',
      loader: async () => {
        const user = await getUser()
        if (user) {
          return redirect('/admin/new-order')
        } else {
          return redirect('/admin/login')
        }
      },
    },
    {
      path: 'screen',
      element: <ReadyForPickup />,
    },
    {
      path: 'orders-pdf',
      element: <OrdersPDF />,
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
