import { RouterProvider } from 'react-router-dom'
import './App.css'
import './services/supabase'

import { router } from './router'

function App() {
  return <RouterProvider router={router} />
}

export default App
