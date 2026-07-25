// =============================================================
//  CONSENTIMIENTO DE COOKIES / ANALÍTICA
//  Guarda la decisión del visitante y permite que el resto de la app
//  sepa si puede cargar herramientas no esenciales (estadísticas).
//
//  IMPORTANTE: mientras no haya una decisión, se asume RECHAZADO.
//  Nunca se carga nada no esencial "por defecto".
// =============================================================

const CLAVE = 'coolperfumes_consentimiento_v1'
export const EVENTO_CONSENTIMIENTO = 'coolperfumes:consentimiento'

// 'aceptado' | 'rechazado' | null (sin decidir)
export function leerConsentimiento() {
  try {
    const valor = localStorage.getItem(CLAVE)
    return valor === 'aceptado' || valor === 'rechazado' ? valor : null
  } catch {
    return null
  }
}

export function guardarConsentimiento(valor) {
  try {
    localStorage.setItem(CLAVE, valor)
  } catch (e) {
    console.warn('No se pudo guardar la preferencia de cookies:', e)
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO))
}

// Permite al visitante cambiar de opinión (enlace en el pie de página).
export function reabrirConsentimiento() {
  try {
    localStorage.removeItem(CLAVE)
  } catch (e) {
    console.warn('No se pudo restablecer la preferencia:', e)
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO))
}

export function suscribirConsentimiento(callback) {
  const fn = () => callback(leerConsentimiento())
  window.addEventListener(EVENTO_CONSENTIMIENTO, fn)
  return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, fn)
}
