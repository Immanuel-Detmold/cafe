import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './globals.css'

// Register service worker for mobile push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${import.meta.env.BASE_URL}sw.js`)
    .catch((error) => console.warn('Service worker registration failed', error))
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
