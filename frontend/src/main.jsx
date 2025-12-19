import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles.css'

// Leaflet will be loaded from the CDN (configured in index.html). Configure default marker icons
// to use the CDN-hosted images when Leaflet is available.
const setupLeafletIcons = () => {
  const L = window.L
  if (!L || !L.Icon) return
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLeafletIcons)
} else {
  setupLeafletIcons()
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
