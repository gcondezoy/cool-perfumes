import { useState, useEffect } from 'react'
import { leerConsentimiento, guardarConsentimiento, suscribirConsentimiento } from '../lib/consentimiento.js'

// Aviso de cookies. Solo aparece si el visitante aún no decidió.
// Los dos botones tienen el mismo peso visual: rechazar debe ser tan
// fácil como aceptar para que el consentimiento sea válido.
export default function BannerCookies() {
  const [decision, setDecision] = useState(leerConsentimiento)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    // Pequeña espera para que el banner no compita con la carga del hero.
    const t = setTimeout(() => setMontado(true), 600)
    const desuscribir = suscribirConsentimiento(setDecision)
    return () => {
      clearTimeout(t)
      desuscribir()
    }
  }, [])

  if (decision !== null) return null

  return (
    <div
      className={`ck-banner ${montado ? 'ck-visible' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
    >
      <div className="ck-texto">
        <p className="ck-titulo">Usamos lo mínimo indispensable</p>
        <p>
          Esta web guarda tu carrito en el navegador para que no lo pierdas. Nos
          gustaría usar además estadísticas anónimas de visitas para mejorar la
          tienda. Tú decides.{' '}
          <a href="/privacidad">Ver política de privacidad</a>.
        </p>
      </div>

      <div className="ck-acciones">
        <button
          className="btn ck-btn ck-btn-rechazar"
          onClick={() => guardarConsentimiento('rechazado')}
        >
          Rechazar
        </button>
        <button
          className="btn ck-btn ck-btn-aceptar"
          onClick={() => guardarConsentimiento('aceptado')}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
