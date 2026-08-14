import { useState } from 'react'
import { MagnifyingGlass, Wind, CaretDown } from '@phosphor-icons/react'
import ProductCard from './ProductCard.jsx'

export default function Catalogo({
  productos,
  agotados = [],
  categorias,
  filtro,
  onFiltro,
  busqueda,
  onBusqueda,
  onAgregar,
  onAbrirDetalle,
  cargando,
}) {
  // "productos" ya viene sin agotados: los agotados llegan aparte y se
  // muestran solo si el visitante los pide.
  const disponibles = productos.length
  const [verAgotados, setVerAgotados] = useState(false)

  return (
    <section className="catalogo" id="catalogo">
      <div className="container">
        <div className="catalogo-head">
          <div>
            <h2 className="section-title">La colección</h2>
            <p className="section-sub">
              {disponibles}{' '}
              {disponibles === 1 ? 'fragancia disponible' : 'fragancias disponibles'}
            </p>
          </div>

          <label className="search" aria-label="Buscar fragancias">
            <MagnifyingGlass size={18} weight="light" />
            <input
              type="search"
              placeholder="Buscar por marca, nombre o nota…"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </label>
        </div>

        <div className="filtros" role="tablist" aria-label="Filtrar productos">
          {categorias.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filtro === c.id}
              className={`chip ${filtro === c.id ? 'chip-activo' : ''}`}
              onClick={() => onFiltro(c.id)}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        {cargando && productos.length === 0 && agotados.length === 0 ? (
          <div className="grid-productos">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="card-esqueleto" key={i}>
                <div className="esq-media" />
                <div className="esq-linea esq-corta" />
                <div className="esq-linea" />
                <div className="esq-linea esq-larga" />
              </div>
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="grid-productos">
            {productos.map((p, i) => (
              <ProductCard
                key={`${filtro}-${p.id}`}
                producto={p}
                onAgregar={onAgregar}
                onAbrirDetalle={onAbrirDetalle}
                index={i}
              />
            ))}
          </div>
        ) : agotados.length > 0 ? (
          <div className="vacio">
            <Wind size={40} weight="light" />
            <p>Por ahora no hay stock de lo que buscas, pero puedes verlo abajo y consultarnos.</p>
          </div>
        ) : (
          <div className="vacio">
            <Wind size={40} weight="light" />
            <p>No encontramos fragancias con esos criterios.</p>
            <button
              className="btn btn-ghost"
              onClick={() => {
                onFiltro('todos')
                onBusqueda('')
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Agotados: fuera de la grilla principal, plegados por defecto */}
        {agotados.length > 0 && (
          <div className="agotados">
            <button
              className={`agotados-toggle ${verAgotados ? 'abierto' : ''}`}
              onClick={() => setVerAgotados((v) => !v)}
              aria-expanded={verAgotados}
              aria-controls="lista-agotados"
            >
              <span>
                Agotados por ahora
                <span className="agotados-conteo">{agotados.length}</span>
              </span>
              <CaretDown size={16} weight="bold" />
            </button>

            <p className="agotados-nota">
              Vuelven al stock seguido. Escríbenos y te avisamos cuando llegue el tuyo.
            </p>

            {verAgotados && (
              <div className="grid-productos" id="lista-agotados">
                {agotados.map((p, i) => (
                  <ProductCard
                    key={`agotado-${filtro}-${p.id}`}
                    producto={p}
                    onAgregar={onAgregar}
                    onAbrirDetalle={onAbrirDetalle}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
