import { useRef, useEffect, useState } from 'react'

// =============================================================
//  APARICIÓN AL HACER SCROLL
//  Devuelve [ref, visible]. El elemento arranca invisible y se
//  muestra cuando entra en pantalla.
//
//  RED DE SEGURIDAD: como el contenido arranca en opacity 0, si el
//  IntersectionObserver no llegara a dispararse (pestaña en segundo
//  plano al cargar, navegador raro, extensión que lo bloquea) la
//  tienda se vería vacía. Por eso hay un temporizador que muestra
//  todo igual pasado un tiempo. Vale más una animación perdida que
//  un catálogo en blanco.
// =============================================================

const TOPE_SEGURIDAD = 2500 // ms

export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)

    const respaldo = setTimeout(() => setVisible(true), TOPE_SEGURIDAD)

    return () => {
      io.disconnect()
      clearTimeout(respaldo)
    }
  }, [threshold, rootMargin])

  return [ref, visible]
}
