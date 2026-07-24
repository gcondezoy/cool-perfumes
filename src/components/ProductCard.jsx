import { useRef, useEffect, useState } from 'react'
import { Plus, Check, WhatsappLogo } from '@phosphor-icons/react'
import { marca as config, abreviarConcentracion } from '../config.js'

export default function ProductCard({ producto, onAgregar, onAbrirDetalle, index = 0 }) {
  const { nombre, marca, notas, ml, precio, precioAntes, destacado, openBox, agotado, concentracion, imagen } =
    producto

  const descuento = precioAntes
    ? Math.round(((precioAntes - precio) / precioAntes) * 100)
    : null

  // Meta bajo el nombre: "EDP · 100 ml" (o solo lo que exista).
  const meta = [
    concentracion && abreviarConcentracion(concentracion),
    ml && `${ml} ml`,
  ].filter(Boolean).join(' · ')

  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const handleAgregar = () => {
    onAgregar(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  const consultar = (e) => {
    e.stopPropagation()
    const mensaje = `¡Hola ${config.nombre}! 👋 Quisiera consultar por el ${marca} ${nombre}${ml ? ` (${ml} ml)` : ''}.`
    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener',
    )
  }

  return (
    <article
      ref={ref}
      className={`card reveal reveal-up ${visible ? 'is-visible' : ''} ${agotado ? 'card-agotado' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      {/* Toda la zona de información abre la ficha completa */}
      <button
        className="card-abrir"
        onClick={() => onAbrirDetalle(producto)}
        aria-label={`Ver ficha completa de ${marca} ${nombre}`}
      >
        <div className="card-media">
          <img src={imagen} alt={`${marca} ${nombre}`} loading="lazy" />
          {agotado ? (
            <span className="card-agotado-tag">Agotado</span>
          ) : (
            <>
              {openBox && <span className="badge badge-openbox">Open Box</span>}
              {!openBox && destacado && <span className="badge">Destacado</span>}
              {descuento && <span className="badge badge-oferta">-{descuento}%</span>}
            </>
          )}
          <span className="card-ver">Ver detalles</span>
        </div>

        <div className="card-body">
          <p className="card-marca">{marca}</p>
          <h3 className="card-nombre">{nombre}</h3>
          <p className="card-familia">{meta}</p>
          <p className="card-notas">{notas}</p>
        </div>
      </button>

      <div className="card-footer">
        <div className="precio">
          {precioAntes && !agotado && (
            <span className="precio-antes">
              {config.moneda} {precioAntes}
            </span>
          )}
          <span className="precio-actual">
            {config.moneda} {precio}
          </span>
        </div>

        {agotado ? (
          <button className="btn btn-consultar" onClick={consultar}>
            <WhatsappLogo size={16} weight="fill" />
            Consultar
          </button>
        ) : (
          <button
            className={`btn btn-agregar ${agregado ? 'agregado' : ''}`}
            onClick={handleAgregar}
            aria-label={`Agregar ${marca} ${nombre} al carrito`}
          >
            {agregado ? (
              <>
                <Check size={16} weight="bold" />
                Añadido
              </>
            ) : (
              <>
                <Plus size={16} weight="bold" />
                Agregar
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}
