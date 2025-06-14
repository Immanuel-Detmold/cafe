import RevenueStreamManager from '@/pages/Settings/RevenueStreamManagement/StreamManagement.tsx'
import { createBrowserRouter, redirect } from 'react-router-dom'

import TestComponent from './TestComponent'
import { Navigation } from './components/Navigation'
import AdvertismentPage from './pages/AdvertismentPage'
import AllProducts from './pages/AllProducts/AllProducts'
import CreateProductV2 from './pages/AllProducts/CreateProduct/CreateProductV2'
import AudioPage from './pages/AudioPage/AudioPage'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import LoginPw from './pages/Authentication/LoginPw'
import { Me } from './pages/Authentication/Me'
import UpdatePassword from './pages/Authentication/UpdatePassword'
import CafeCards from './pages/CafeCards/CafeCardsPage'
import ClosedOrdersToday from './pages/ClosedOrdersToday'
import ExpensePage from './pages/ExpensePage/Expense/ExpenseTable'
import NewExpense from './pages/ExpensePage/NewExpense'
import Inventory from './pages/Inventory/Inventory/Inventory'
import NewItem from './pages/Inventory/NewItem'
import MenuCard from './pages/MenuCard/MenuCard'
import NewOrder from './pages/NewOrder/NewOrder'
import Open from './pages/Open/Open'
import ReadyForPickup from './pages/ReadyForPickup/ReadyForPickup'
import AdvertismentSettings from './pages/Settings/AdvertismentSettings'
import ManageUsers from './pages/Settings/ManageUsers/ManageUsers'
import UserInfo from './pages/Settings/ManageUsers/UserInfo'
import NetworkPage from './pages/Settings/NetworkPage/NetworkPage'
import { Organisation } from './pages/Settings/Organisation'
import NewPrinter from './pages/Settings/PrinterPage/NewPrinter'
import PrinterPage from './pages/Settings/PrinterPage/Printer/PrinterPage'
import SettingsPage from './pages/Settings/SettingsPage'
import UserActions from './pages/Settings/UserActions/UserActions'
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
      path: 'menu',
      element: <MenuCard />,
    },
    {
      path: 'advertisement',
      element: <AdvertismentPage />,
    },
    {
      path: 'admin',
      element: <Navigation />,
      children: [
        { path: 'cafe-cards', element: <CafeCards /> },
        { path: 'create-product', element: <CreateProductV2 /> },
        {
          path: 'inventory',
          element: <Inventory />,
        },
        {
          path: 'inventory/:id',
          element: <NewItem />,
        },
        {
          path: 'inventory/new-item',
          element: <NewItem />,
        },
        {
          path: 'all-products/:productId',
          element: <CreateProductV2 />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: 'audio',
          element: <AudioPage />,
        },
        {
          path: 'settings/manage-users',
          element: <ManageUsers />,
        },
        {
          path: 'settings/organisation',
          element: <Organisation />,
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
          path: 'settings/network',
          element: <NetworkPage />,
        },
        {
          path: 'settings/printer',
          element: <PrinterPage />,
        },
        {
          path: 'settings/printer/new-printer',
          element: <NewPrinter />,
        },
        {
          path: 'settings/printer/new-printer/:printerId',
          element: <NewPrinter />,
        },
        {
          path: 'settings/advertisement',
          element: <AdvertismentSettings />,
        },
        {
          path: 'settings/revenue-streams',
          element: <RevenueStreamManager />,
        },
        {
          path: 'login',
          element: <LoginPw />,
        },
        {
          path: 'forgot-pw',
          element: <ForgotPassword />,
        },
        {
          path: 'update-pw',
          element: <UpdatePassword />,
        },
        {
          path: 'me',
          element: <Me />,
        },
        {
          path: 'open',
          element: (
            <Open statusList={['waiting', 'processing']} paymentPage={false} />
          ),
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
          path: 'new-order/edit/:orderId',
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
        {
          path: 'expense',
          element: <ExpensePage />,
        },
        {
          path: 'new-expense',
          element: <NewExpense />,
        },
        {
          path: 'new-expense/:expenseId',
          element: <NewExpense />,
        },
        {
          path: 'test',
          element: <TestComponent />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
