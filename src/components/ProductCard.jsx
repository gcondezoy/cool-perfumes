import { useState } from 'react'
import { Plus, Check, WhatsappLogo } from '@phosphor-icons/react'
import { marca as config, abreviarConcentracion } from '../config.js'
import { tieneDecants, precioDesdeDecant } from '../lib/presentaciones.js'
import { estaAgotado, stockBajo, unidadesDisponibles } from '../lib/stock.js'
import { useReveal } from '../lib/useReveal.js'

export default function ProductCard({ producto, onAgregar, onAbrirDetalle, index = 0 }) {
  const { nombre, marca, notas, ml, precio, precioAntes, destacado, openBox, concentracion, imagen } =
    producto

  // "Agotado" cubre tanto el interruptor manual como el stock en cero.
  const agotado = estaAgotado(producto)
  const quedanPocas = stockBajo(producto)
  const unidades = unidadesDisponibles(producto)

  // Solo hay descuento si el precio anterior es realmente mayor. Si no,
  // queda en null: un 0 se colaría como texto suelto sobre la foto.
  const descuento =
    precioAntes > precio ? Math.round(((precioAntes - precio) / precioAntes) * 100) : null

  // Meta bajo el nombre: "EDP · 100 ml" (o solo lo que exista).
  const meta = [
    concentracion && abreviarConcentracion(concentracion),
    ml && `${ml} ml`,
  ].filter(Boolean).join(' · ')

  const hayDecant = tieneDecants(producto)
  const precioDecant = precioDesdeDecant(producto)

  const [ref, visible] = useReveal({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
  const [agregado, setAgregado] = useState(false)

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
              {quedanPocas && (
                <span className="card-pocas">
                  {unidades === 1 ? 'Última unidad' : `Últimas ${unidades} unidades`}
                </span>
              )}
            </>
          )}
          <span className="card-ver">Ver detalles</span>
        </div>

        <div className="card-body">
          <p className="card-marca">{marca}</p>
          <h3 className="card-nombre">{nombre}</h3>
          <p className="card-familia">{meta}</p>
          {hayDecant && !agotado && (
            <p className="card-decant">
              También en decant · desde {config.moneda} {precioDecant}
            </p>
          )}
          <p className="card-notas">{notas}</p>
        </div>
      </button>

      <div className="card-footer">
        <div className="precio">
          {precioAntes > precio && !agotado && (
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
