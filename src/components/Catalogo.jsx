import { MagnifyingGlass, Wind } from '@phosphor-icons/react'
import ProductCard from './ProductCard.jsx'

export default function Catalogo({
  productos,
  categorias,
  filtro,
  onFiltro,
  busqueda,
  onBusqueda,
  onAgregar,
  onAbrirDetalle,
  cargando,
}) {
  // El contador no considera los productos agotados.
  const disponibles = productos.filter((p) => !p.agotado).length

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

        <div className="filtros" role="tablist" aria-label="Filtrar por género">
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

        {cargando && productos.length === 0 ? (
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
      </div>
    </section>
  )
}
