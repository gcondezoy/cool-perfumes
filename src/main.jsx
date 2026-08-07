import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import PoliticaPrivacidad from './components/PoliticaPrivacidad.jsx'
import BannerCookies from './components/BannerCookies.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { leerConsentimiento, suscribirConsentimiento } from './lib/consentimiento.js'
import './index.css'

// Enrutado: tienda en "/", panel en "/admin", privacidad en "/privacidad".
// Acepta también "/#/admin" (formato antiguo) para no romper enlaces guardados.
// En producción, vercel.json redirige todas las rutas a index.html.
function rutaActual() {
  const ruta = window.location.pathname.replace(/\/+$/, '')
  const hash = window.location.hash
  if (ruta.endsWith('/admin') || hash.startsWith('#/admin')) return 'admin'
  if (ruta.endsWith('/privacidad') || hash.startsWith('#/privacidad')) return 'privacidad'
  return 'tienda'
}

function Root() {
  const [ruta, setRuta] = useState(rutaActual)
  const [consentimiento, setConsentimiento] = useState(leerConsentimiento)

  useEffect(() => {
    const alCambiar = () => setRuta(rutaActual())
    window.addEventListener('hashchange', alCambiar)
    window.addEventListener('popstate', alCambiar)
    const desuscribir = suscribirConsentimiento(setConsentimiento)
    return () => {
      window.removeEventListener('hashchange', alCambiar)
      window.removeEventListener('popstate', alCambiar)
      desuscribir()
    }
  }, [])

  const pantalla =
    ruta === 'admin' ? <AdminApp />
    : ruta === 'privacidad' ? <PoliticaPrivacidad />
    : <App />

  return (
    <>
      {pantalla}

      {/* El aviso solo se muestra en las páginas públicas. */}
      {ruta !== 'admin' && <BannerCookies />}

      {/* Las estadísticas SOLO se cargan si el visitante las aceptó. */}
      {consentimiento === 'aceptado' && <Analytics />}
    </>
  )
}

// Quita la pantalla de carga cuando la tienda ya está lista.
// Espera a que carguen las tipografías (evita el "salto" de texto), pero
// con un tope: si algo tarda demasiado, igual deja pasar al visitante.
//
// Tiempos de la secuencia (ajustables):
//   0.0s  el logo empieza a aparecer (animación de 1.1s)
//   1.5s  el logo ya se asentó y se mantiene un instante
//   1.5s  comienza la salida: el logo se eleva y se desvanece
//   1.9s  se desvanece el fondo
//   2.6s  se elimina del DOM
async function ocultarPantallaDeCarga() {
  const capa = document.getElementById('carga')
  if (!capa) return

  const MINIMO_VISIBLE = 1500 // deja ver el logo completo, sin apurarlo
  const ANTES_DE_FONDO = 400  // el logo sale primero, luego el fondo
  const DURACION_FONDO = 700  // debe coincidir con la transición del CSS
  const TOPE = 3000           // nunca bloquea la tienda

  try {
    await Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, TOPE)),
    ])
  } catch {
    /* si falla, se oculta igual */
  }

  // performance.now() cuenta desde que se abrió la página.
  const restante = Math.max(0, MINIMO_VISIBLE - performance.now())

  setTimeout(() => {
    capa.classList.add('saliendo')          // el logo se eleva y se va
    setTimeout(() => {
      capa.classList.add('oculto')          // luego se abre el fondo
      // Se elimina del DOM para que no intercepte clics.
      setTimeout(() => capa.remove(), DURACION_FONDO)
    }, ANTES_DE_FONDO)
  }, restante)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>,
)

ocultarPantallaDeCarga()
