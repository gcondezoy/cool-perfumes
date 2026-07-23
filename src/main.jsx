import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './index.css'

// Enrutado simple por hash: la tienda en "/" y el panel en "/#/admin".
// Se usa hash para que funcione en cualquier hosting estático sin configurar
// reescrituras de URL.
function Root() {
  const [ruta, setRuta] = useState(window.location.hash)

  useEffect(() => {
    const alCambiar = () => setRuta(window.location.hash)
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  return ruta.startsWith('#/admin') ? <AdminApp /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
