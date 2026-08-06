import { useRef, useEffect, useState } from 'react'
import { Plus, Check } from '@phosphor-icons/react'
import { marca as config } from '../config.js'
import { decantsDe } from '../lib/presentaciones.js'

// Tarjeta de decant: muestra los tamaños disponibles con su precio y
// permite agregar directamente el que se elija. Sin pasos intermedios.
function TarjetaDecant({ producto, onAgregar, index }) {
  const opciones = decantsDe(producto)
  const [elegido, setElegido] = useState(opciones[0]?.clave)
  const [agregado, setAgregado] = useState(false)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const opcion = opciones.find((o) => o.clave === elegido) || opciones[0]
  if (!opcion) return null

  const agregar = () => {
    onAgregar(producto, opcion)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <article
      ref={ref}
      className={`dec-card reveal reveal-up ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      <div className="dec-media">
        <img src={producto.imagen} alt={`${producto.marca} ${producto.nombre}`} loading="lazy" />
      </div>

      <div className="dec-body">
        <p className="dec-marca">{producto.marca}</p>
        <h3 className="dec-nombre">{producto.nombre}</h3>

        <div className="dec-tamanos" role="radiogroup" aria-label={`Tamaño de decant de ${producto.nombre}`}>
          {opciones.map((o) => (
            <button
              key={o.clave}
              type="button"
              role="radio"
              aria-checked={o.clave === opcion.clave}
              className={`dec-tamano ${o.clave === opcion.clave ? 'dec-tamano-activo' : ''}`}
              onClick={() => setElegido(o.clave)}
            >
              <span className="dec-tamano-ml">{o.detalle}</span>
              <span className="dec-tamano-precio">{config.moneda} {o.precio}</span>
            </button>
          ))}
        </div>

        <button
          className={`btn dec-agregar ${agregado ? 'agregado' : ''}`}
          onClick={agregar}
          aria-label={`Agregar decant de ${opcion.detalle} de ${producto.marca} ${producto.nombre} al carrito`}
        >
          {agregado ? (
            <><Check size={16} weight="bold" /> Añadido</>
          ) : (
            <><Plus size={16} weight="bold" /> Agregar · {config.moneda} {opcion.precio}</>
          )}
        </button>
      </div>
    </article>
  )
}

export default function SeccionDecants({ productos, onAgregar }) {
  const conDecant = productos.filter((p) => !p.agotado && decantsDe(p).length > 0)

  // Si no hay ningún decant cargado, la sección no se muestra.
  if (conDecant.length === 0) return null

  return (
    <section className="decants" id="decants">
      <div className="container">
        <div className="dec-head">
          <h2 className="section-title">Decants</h2>
          <p className="section-sub dec-intro">
            Porciones del perfume original en atomizador de 3 ml y 5 ml.
            Ideales para probar una fragancia antes de comprar el frasco
            completo, o para llevarla contigo.
          </p>
        </div>

        <div className="dec-grid">
          {conDecant.map((p, i) => (
            <TarjetaDecant key={p.id} producto={p} onAgregar={onAgregar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
