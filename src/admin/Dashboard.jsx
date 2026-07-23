import { Package, CurrencyDollar, Tag, Star } from '@phosphor-icons/react'
import { calcularMetricas } from './adminStore.js'
import { marca } from '../config.js'

// Paleta categórica validada (contraste y daltonismo comprobados)
const COLORES_GENERO = ['#a13c2a', '#0369a1', '#a16207']
const COLOR_UNICO = '#3f3a30'

function Barras({ datos, colores, sufijo = '' }) {
  const max = Math.max(...datos.map((d) => d.valor), 1)

  return (
    <ul className="adm-barras">
      {datos.map((d, i) => (
        <li key={d.etiqueta} className="adm-barra-fila">
          <span className="adm-barra-etiqueta">{d.etiqueta}</span>
          <span className="adm-barra-pista">
            <span
              className="adm-barra"
              style={{
                width: `${(d.valor / max) * 100}%`,
                background: colores ? colores[i % colores.length] : COLOR_UNICO,
              }}
              data-tip={`${d.etiqueta}: ${d.valor}${sufijo}`}
            />
          </span>
          <span className="adm-barra-valor">{d.valor}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Dashboard({ productos }) {
  const m = calcularMetricas(productos)

  const kpis = [
    { icono: Package, etiqueta: 'Productos', valor: m.total },
    { icono: CurrencyDollar, etiqueta: 'Valor del catálogo', valor: `${marca.moneda} ${m.valor.toLocaleString('es-PE')}` },
    { icono: Tag, etiqueta: 'En oferta', valor: m.enOferta },
    { icono: Star, etiqueta: 'Destacados', valor: m.destacados },
  ]

  return (
    <div className="adm-seccion">
      <header className="adm-seccion-head">
        <h1 className="adm-titulo">Dashboard</h1>
        <p className="adm-sub">Resumen de tu catálogo</p>
      </header>

      {/* KPIs */}
      <div className="adm-kpis">
        {kpis.map((k) => (
          <article className="adm-kpi" key={k.etiqueta}>
            <k.icono size={20} weight="light" className="adm-kpi-icono" />
            <p className="adm-kpi-valor">{k.valor}</p>
            <p className="adm-kpi-etiqueta">{k.etiqueta}</p>
          </article>
        ))}
      </div>

      {/* Gráficos */}
      <div className="adm-grid-2">
        <section className="adm-card">
          <h2 className="adm-card-titulo">Productos por género</h2>
          <Barras datos={m.porGenero} colores={COLORES_GENERO} />
        </section>

        <section className="adm-card">
          <h2 className="adm-card-titulo">Marcas con más productos</h2>
          {m.porMarca.length ? (
            <Barras datos={m.porMarca} />
          ) : (
            <p className="adm-vacio-texto">Aún no hay productos.</p>
          )}
        </section>
      </div>

      {/* Datos rápidos */}
      <section className="adm-card">
        <h2 className="adm-card-titulo">Precios</h2>
        <div className="adm-datos">
          <div>
            <p className="adm-dato-etiqueta">Precio promedio</p>
            <p className="adm-dato-valor">{marca.moneda} {m.promedio}</p>
          </div>
          <div>
            <p className="adm-dato-etiqueta">Más caro</p>
            <p className="adm-dato-valor">
              {m.masCaro ? `${marca.moneda} ${m.masCaro.precio}` : '—'}
            </p>
            <p className="adm-dato-pie">{m.masCaro ? `${m.masCaro.marca} ${m.masCaro.nombre}` : ''}</p>
          </div>
          <div>
            <p className="adm-dato-etiqueta">Más accesible</p>
            <p className="adm-dato-valor">
              {m.masBarato ? `${marca.moneda} ${m.masBarato.precio}` : '—'}
            </p>
            <p className="adm-dato-pie">{m.masBarato ? `${m.masBarato.marca} ${m.masBarato.nombre}` : ''}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
