import { createBrowserRouter, useOutlet } from 'react-router-dom'

import { ScrollArea } from '@/components/ui/scroll-area'

import Header from './components/Header'
import Navbar from './components/Navbar'
import AllProducts from './pages/AllProducts/AllProducts'
import { Login } from './pages/Login'
import { Me } from './pages/Me'
import NewOrder from './pages/NewOrder'
import Open from './pages/Open'
import ReadyForPickup from './pages/ReadyForPickup'

// const [isWhiteMode, setWhiteMode] = useState(window.matchMedia('(prefers-color-scheme: dark)')

const Navigation = () => {
  const outlet = useOutlet()
  return (
    <>
      <div className="h-100 relative h-screen">
        <Header />

        <ScrollArea className="h-[83%] w-[100%] overflow-hidden">
          <div className="container">{outlet}</div>
        </ScrollArea>

        <Navbar />
      </div>
    </>
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
