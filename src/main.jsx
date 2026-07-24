import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Enrutado: la tienda en "/" y el panel en "/admin".
// Acepta también "/#/admin" (formato antiguo) para no romper enlaces guardados.
// En producción, vercel.json redirige todas las rutas a index.html.
function esRutaAdmin() {
  return (
    window.location.pathname.replace(/\/+$/, '').endsWith('/admin') ||
    window.location.hash.startsWith('#/admin')
  )
}

function Root() {
  const [admin, setAdmin] = useState(esRutaAdmin)

  useEffect(() => {
    const alCambiar = () => setAdmin(esRutaAdmin())
    window.addEventListener('hashchange', alCambiar)
    window.addEventListener('popstate', alCambiar)
    return () => {
      window.removeEventListener('hashchange', alCambiar)
      window.removeEventListener('popstate', alCambiar)
    }
  }, [])

  return admin ? <AdminApp /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
      {/* Estadísticas de visitas (se activan al desplegar en Vercel) */}
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>,
)
