import { useEffect, useRef } from 'react'
import { X, Plus, WhatsappLogo, Eyedropper } from '@phosphor-icons/react'
import { marca as config, abreviarConcentracion } from '../config.js'
import { presentacionFrasco, precioDesdeDecant } from '../lib/presentaciones.js'

export default function ProductoModal({ producto, onCerrar, onAgregar }) {
  const cerrarRef = useRef(null)
  const modalRef = useRef(null)

  // Cerrar con Escape y bloquear el scroll del fondo.
  useEffect(() => {
    if (!producto) return
    const alPresionar = (e) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionar)
    document.body.style.overflow = 'hidden'
    // Abrir siempre desde arriba (preventScroll evita el salto al enfocar).
    if (modalRef.current) {
      modalRef.current.scrollTop = 0
      const info = modalRef.current.querySelector('.pm-info')
      if (info) info.scrollTop = 0
    }
    cerrarRef.current?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [producto, onCerrar])

  if (!producto) return null

  const { nombre, marca, ml, imagen, concentracion, genero, openBox, agotado } = producto

  // Esta ficha es siempre del frasco completo: los decants tienen su
  // propia sección, para que el cliente no confunda lo que está comprando.
  const presentacion = presentacionFrasco(producto)
  const desdeDecant = precioDesdeDecant(producto)

  const descuento = presentacion.precioAntes
    ? Math.round(((presentacion.precioAntes - presentacion.precio) / presentacion.precioAntes) * 100)
    : null

  const ficha = [
    { etiqueta: 'Marca', valor: marca },
    { etiqueta: 'Concentración', valor: concentracion },
    { etiqueta: 'Contenido', valor: ml ? `${ml} ml` : null },
    { etiqueta: 'Género', valor: genero ? genero.charAt(0).toUpperCase() + genero.slice(1) : null },
  ].filter((d) => d.valor)

  const subtitulo = [
    concentracion && abreviarConcentracion(concentracion),
    ml && `${ml} ml`,
  ].filter(Boolean).join(' · ')

  const irADecants = () => {
    onCerrar()
    setTimeout(() => {
      const el = document.getElementById('decants')
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 70
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 250)
  }

  const pedirPorWhatsApp = () => {
    const mensaje = `¡Hola ${config.nombre}! 👋 Quisiera consultar por el ${marca} ${nombre}${ml ? ` (${ml} ml)` : ''}.`
    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener',
    )
  }

  return (
    <div className="pm-fondo" onClick={onCerrar} role="presentation">
      <div
        ref={modalRef}
        className="pm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${marca} ${nombre}`}
      >
        <button ref={cerrarRef} className="pm-cerrar" onClick={onCerrar} aria-label="Cerrar ficha">
          <X size={22} weight="light" />
        </button>

        <div className="pm-grid">
          {/* Imagen */}
          <div className="pm-media">
            <img src={imagen} alt={`${marca} ${nombre}`} />
            {descuento && <span className="pm-oferta">-{descuento}%</span>}
          </div>

          {/* Información */}
          <div className="pm-info">
            <p className="pm-marca">{marca}</p>
            <h2 className="pm-nombre">{nombre}</h2>
            <div className="pm-sub-fila">
              {subtitulo && <p className="pm-familia">{subtitulo}</p>}
              {openBox && <span className="pm-openbox">Open Box</span>}
              {agotado && <span className="pm-agotado">Agotado</span>}
            </div>

            <div className="pm-precio">
              {presentacion.precioAntes && (
                <span className="pm-precio-antes">{config.moneda} {presentacion.precioAntes}</span>
              )}
              <span className="pm-precio-actual">{config.moneda} {presentacion.precio}</span>
            </div>

            {ficha.length > 0 && (
              <section className="pm-bloque">
                <h3 className="pm-bloque-titulo">Detalles</h3>
                <dl className="pm-ficha">
                  {ficha.map((d) => (
                    <div key={d.etiqueta}>
                      <dt>{d.etiqueta}</dt>
                      <dd>{d.valor}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Puente hacia la sección de decants, sin mezclar la compra */}
            {desdeDecant && !agotado && (
              <button className="pm-aviso-decant" onClick={irADecants}>
                <Eyedropper size={18} weight="light" />
                <span>
                  ¿Prefieres probarlo primero? Este perfume también está en{' '}
                  <strong>decant desde {config.moneda} {desdeDecant}</strong>.
                </span>
              </button>
            )}

            <div className="pm-acciones">
              {agotado ? (
                <button className="btn pm-btn pm-btn-agotado" disabled>
                  Agotado
                </button>
              ) : (
                <button
                  className="btn btn-primary pm-btn"
                  onClick={() => {
                    onAgregar(producto, presentacion)
                    onCerrar()
                  }}
                >
                  <Plus size={17} weight="bold" />
                  Agregar al carrito
                </button>
              )}
              <button className="btn btn-ghost pm-btn" onClick={pedirPorWhatsApp}>
                <WhatsappLogo size={18} weight="fill" />
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
