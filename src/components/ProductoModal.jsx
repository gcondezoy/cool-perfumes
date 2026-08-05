import { useEffect, useRef, useState } from 'react'
import { X, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { marca as config, abreviarConcentracion } from '../config.js'
import { presentacionesDe, etiquetaPresentacion } from '../lib/presentaciones.js'

export default function ProductoModal({ producto, onCerrar, onAgregar }) {
  const cerrarRef = useRef(null)
  const modalRef = useRef(null)
  const [claveSel, setClaveSel] = useState('frasco')

  // Al abrir otro perfume, volver siempre al frasco completo.
  useEffect(() => {
    setClaveSel('frasco')
  }, [producto?.id])

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

  const { nombre, marca, imagen, concentracion, genero, openBox, agotado } = producto

  const opciones = presentacionesDe(producto)
  const presentacion = opciones.find((o) => o.clave === claveSel) || opciones[0]
  const hayVariasPresentaciones = opciones.length > 1

  const descuento = presentacion.precioAntes
    ? Math.round(((presentacion.precioAntes - presentacion.precio) / presentacion.precioAntes) * 100)
    : null

  const ficha = [
    { etiqueta: 'Marca', valor: marca },
    { etiqueta: 'Concentración', valor: concentracion },
    // Si hay selector de presentación, el tamaño ya se ve ahí: no lo repetimos.
    ...(hayVariasPresentaciones
      ? []
      : [{ etiqueta: 'Contenido', valor: producto.ml ? `${producto.ml} ml` : null }]),
    { etiqueta: 'Género', valor: genero ? genero.charAt(0).toUpperCase() + genero.slice(1) : null },
  ].filter((d) => d.valor)

  // El subtítulo identifica al PERFUME (el frasco original), no cambia al
  // elegir un decant: así no se pierde de vista qué producto es.
  const subtitulo = [
    concentracion && abreviarConcentracion(concentracion),
    producto.ml && `${producto.ml} ml`,
  ].filter(Boolean).join(' · ')

  const pedirPorWhatsApp = () => {
    const texto = etiquetaPresentacion(presentacion)
    const mensaje = `¡Hola ${config.nombre}! 👋 Quisiera consultar por el ${marca} ${nombre}${texto ? ` (${texto})` : ''}.`
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
              {/* Aclara a qué presentación corresponde el precio mostrado */}
              {hayVariasPresentaciones && (
                <span className="pm-precio-nota">
                  {presentacion.clave === 'frasco'
                    ? 'Frasco completo'
                    : `Decant ${presentacion.detalle}`}
                </span>
              )}
            </div>

            {/* Selector de presentación (solo si hay decants) */}
            {hayVariasPresentaciones && (
              <section className="pm-bloque">
                <h3 className="pm-bloque-titulo">Elige tu presentación</h3>
                <div className="pm-tallas" role="radiogroup" aria-label="Presentación">
                  {opciones.map((o) => {
                    const activa = o.clave === presentacion.clave
                    return (
                      <button
                        key={o.clave}
                        type="button"
                        role="radio"
                        aria-checked={activa}
                        className={`pm-talla ${activa ? 'pm-talla-activa' : ''}`}
                        onClick={() => setClaveSel(o.clave)}
                      >
                        <span className="pm-talla-tipo">
                          {o.clave === 'frasco' ? 'Frasco' : 'Decant'}
                        </span>
                        <span className="pm-talla-ml">{o.detalle}</span>
                        <span className="pm-talla-precio">
                          {config.moneda} {o.precio}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="pm-talla-nota">
                  Los decants son una porción del perfume original en un
                  atomizador, ideales para probarlo o llevarlo contigo.
                </p>
              </section>
            )}

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
