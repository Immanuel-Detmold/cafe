import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './globals.css'

// Register service worker for mobile push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/cafe/sw.js').catch(() => {})
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
