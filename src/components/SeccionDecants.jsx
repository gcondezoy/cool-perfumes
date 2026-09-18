import { useState } from 'react'
import { Plus, Check } from '@phosphor-icons/react'
import { marca as config } from '../config.js'
import { decantsDe, tamanosOfrecidos } from '../lib/presentaciones.js'
import { ordenarPor, CAMPO_DECANTS } from '../lib/orden.js'
import { estaAgotado } from '../lib/stock.js'
import { useReveal } from '../lib/useReveal.js'
import { imagenOptimizada, imagenSrcSet } from '../lib/imagenUrl.js'

// Tarjeta de decant: muestra los tamaños disponibles con su precio y
// permite agregar directamente el que se elija. Sin pasos intermedios.
function TarjetaDecant({ producto, onAgregar, index }) {
  const opciones = decantsDe(producto)
  const [elegido, setElegido] = useState(opciones[0]?.clave)
  const [agregado, setAgregado] = useState(false)
  const [ref, visible] = useReveal({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

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
        <img
          src={imagenOptimizada(producto.imagen, 500)}
          srcSet={imagenSrcSet(producto.imagen, [300, 500, 700])}
          sizes="(max-width: 860px) 45vw, 260px"
          alt={`${producto.marca} ${producto.nombre}`}
          loading="lazy"
          decoding="async"
        />
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

// "3 ml, 5 ml y 10 ml" a partir de [3, 5, 10].
function listarMedidas(medidas) {
  const textos = medidas.map((ml) => `${ml} ml`)
  if (textos.length <= 1) return textos.join('')
  return `${textos.slice(0, -1).join(', ')} y ${textos[textos.length - 1]}`
}

export default function SeccionDecants({ productos, onAgregar }) {
  // Incluye los perfumes que se venden solo en decant: esta es la única
  // sección donde aparecen. Va en SU propio orden (el de la pestaña
  // Decants del panel), no en el de La colección.
  const conDecant = ordenarPor(
    productos.filter((p) => !estaAgotado(p) && decantsDe(p).length > 0),
    CAMPO_DECANTS,
  )

  // Si no hay ningún decant cargado, la sección no se muestra.
  if (conDecant.length === 0) return null

  // El texto nombra solo las medidas que de verdad se ofrecen.
  const medidas = listarMedidas(tamanosOfrecidos(conDecant))

  return (
    <section className="decants" id="decants">
      <div className="container">
        <div className="dec-head">
          <h2 className="section-title">Decants</h2>
          <p className="section-sub dec-intro">
            Porciones del perfume original en atomizador de {medidas}.
            Ideales para probar una fragancia antes de decidirte, o para
            llevarla contigo.
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
