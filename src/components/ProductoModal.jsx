import { useEffect, useRef } from 'react'
import { X, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { marca as config, abreviarConcentracion } from '../config.js'

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

  const {
    nombre, marca, ml, precio, precioAntes, imagen, concentracion, genero,
  } = producto

  const descuento = precioAntes
    ? Math.round(((precioAntes - precio) / precioAntes) * 100)
    : null

  const ficha = [
    { etiqueta: 'Marca', valor: marca },
    { etiqueta: 'Concentración', valor: concentracion },
    { etiqueta: 'Contenido', valor: ml ? `${ml} ml` : null },
    { etiqueta: 'Género', valor: genero ? genero.charAt(0).toUpperCase() + genero.slice(1) : null },
  ].filter((d) => d.valor)

  // Subtítulo bajo el nombre: "EDP · 100 ml" (o solo lo que exista).
  const subtitulo = [
    concentracion && abreviarConcentracion(concentracion),
    ml && `${ml} ml`,
  ].filter(Boolean).join(' · ')

  const pedirPorWhatsApp = () => {
    const mensaje = `¡Hola ${config.nombre}! 👋 Quisiera consultar por el ${marca} ${nombre} (${ml} ml).`
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
            {subtitulo && <p className="pm-familia">{subtitulo}</p>}

            <div className="pm-precio">
              {precioAntes && (
                <span className="pm-precio-antes">{config.moneda} {precioAntes}</span>
              )}
              <span className="pm-precio-actual">{config.moneda} {precio}</span>
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

            <div className="pm-acciones">
              <button
                className="btn btn-primary pm-btn"
                onClick={() => {
                  onAgregar(producto)
                  onCerrar()
                }}
              >
                <Plus size={17} weight="bold" />
                Agregar al carrito
              </button>
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
