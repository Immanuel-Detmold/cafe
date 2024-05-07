import { createBrowserRouter, redirect } from 'react-router-dom'

import { Navigation } from './components/Navigation'
import AllProducts from './pages/AllProducts/AllProducts'
import CafeCards from './pages/CafeCards/CafeCardsPage'
import ClosedOrdersToday from './pages/ClosedOrdersToday'
import LoginPw from './pages/LoginPw'
import { Me } from './pages/Me'
import NewOrder from './pages/NewOrder/NewOrder'
import Open from './pages/Open/Open'
import ReadyForPickup from './pages/ReadyForPickup/ReadyForPickup'
import ManageUsers from './pages/Settings/ManageUsers'
import SettingsPage from './pages/Settings/SettingsPage'
import UserActions from './pages/Settings/UserActions/page'
import UserInfo from './pages/Settings/UserInfo'
import OrdersPDF from './pages/Statistic/GeneratePDF/OrdersPDF'
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
        { path: 'cafe-cards', element: <CafeCards /> },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: 'settings/manage-users',
          element: <ManageUsers />,
        },
        {
          path: 'settings/manage-users/:userId',
          element: <UserInfo />,
        },
        {
          path: 'settings/user-actions',
          element: <UserActions />,
        },
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
