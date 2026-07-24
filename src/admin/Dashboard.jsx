import {
  Package, CurrencyDollar, Tag, Star, CheckCircle, WarningCircle, CaretRight,
  Receipt, Clock, TrendUp, ShoppingBag,
} from '@phosphor-icons/react'
import { calcularMetricas } from './adminStore.js'
import { calcularMetricasPedidos, ESTADOS } from './pedidosStore.js'
import { marca } from '../config.js'

// Paleta categórica validada (contraste y daltonismo comprobados)
const COLORES_GENERO = ['#a13c2a', '#0369a1', '#a16207']
const COLOR_UNICO = '#3f3a30'
const COLORES_ESTADO = [ESTADOS.pendiente.color, ESTADOS.pagado.color, ESTADOS.cancelado.color]

function Barras({ datos, colores, total, onClic, sufijo = '' }) {
  const max = Math.max(...datos.map((d) => d.valor), 1)

  return (
    <ul className="adm-barras">
      {datos.map((d, i) => {
        const pct = total ? Math.round((d.valor / total) * 100) : 0
        const Fila = onClic ? 'button' : 'div'
        return (
          <li key={d.clave || d.etiqueta}>
            <Fila
              className={`adm-barra-fila ${onClic ? 'adm-barra-clic' : ''}`}
              onClick={onClic ? () => onClic(d) : undefined}
            >
              <span className="adm-barra-etiqueta">{d.etiqueta}</span>
              <span className="adm-barra-pista">
                <span
                  className="adm-barra"
                  style={{
                    width: `${(d.valor / max) * 100}%`,
                    background: colores ? colores[i % colores.length] : COLOR_UNICO,
                  }}
                />
              </span>
              <span className="adm-barra-valor">
                {d.valor}{sufijo}
                {total > 0 && <em className="adm-barra-pct">{pct}%</em>}
              </span>
            </Fila>
          </li>
        )
      })}
    </ul>
  )
}

export default function Dashboard({ productos, pedidos, onVerProductos, onVerPedidos }) {
  const m = calcularMetricas(productos)
  const v = calcularMetricasPedidos(pedidos)

  const kpisVentas = [
    {
      icono: CurrencyDollar,
      etiqueta: 'Vendido (cobrado)',
      valor: `${marca.moneda} ${v.vendidoTotal.toLocaleString('es-PE')}`,
      pie: `${v.pagados} ${v.pagados === 1 ? 'pedido pagado' : 'pedidos pagados'}`,
    },
    {
      icono: Clock,
      etiqueta: 'Por cobrar',
      valor: `${marca.moneda} ${v.porCobrar.toLocaleString('es-PE')}`,
      pie: `${v.pendientes} ${v.pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'}`,
    },
    {
      icono: Receipt,
      etiqueta: 'Pedidos (7 días)',
      valor: v.pedidos7dias,
      pie: `${v.pedidosHoy} ${v.pedidosHoy === 1 ? 'pedido hoy' : 'pedidos hoy'}`,
    },
    {
      icono: TrendUp,
      etiqueta: 'Ticket promedio',
      valor: `${marca.moneda} ${v.ticketPromedio.toLocaleString('es-PE')}`,
      pie: 'Promedio por pedido pagado',
    },
  ]

  const kpisCatalogo = [
    {
      icono: Package,
      etiqueta: 'Productos en catálogo',
      valor: m.total,
      pie: `${m.totalMarcas} ${m.totalMarcas === 1 ? 'marca' : 'marcas'} distintas`,
    },
    {
      icono: CurrencyDollar,
      etiqueta: 'Valor del catálogo',
      valor: `${marca.moneda} ${m.valor.toLocaleString('es-PE')}`,
      pie: `Precio promedio: ${marca.moneda} ${m.promedio}`,
    },
    {
      icono: Tag,
      etiqueta: 'En oferta',
      valor: m.enOferta,
      pie: m.enOferta ? `Descuento promedio: ${m.descuentoPromedio}%` : 'Ninguno con descuento',
    },
    {
      icono: Star,
      etiqueta: 'Destacados',
      valor: m.destacados,
      pie: 'Aparecen con etiqueta en la tienda',
    },
  ]

  const pendientes = m.salud.filter((s) => s.items.length > 0)

  return (
    <div className="adm-seccion">
      <header className="adm-seccion-head">
        <h1 className="adm-titulo">Resumen de tu tienda</h1>
        <p className="adm-sub">Ventas y catálogo de un vistazo. Haz clic en cualquier dato para ver el detalle.</p>
      </header>

      {/* ================= VENTAS ================= */}
      <div className="adm-kpis">
        {kpisVentas.map((k) => (
          <article className="adm-kpi" key={k.etiqueta}>
            <k.icono size={20} weight="light" className="adm-kpi-icono" />
            <p className="adm-kpi-valor">{k.valor}</p>
            <p className="adm-kpi-etiqueta">{k.etiqueta}</p>
            <p className="adm-kpi-pie">{k.pie}</p>
          </article>
        ))}
      </div>

      {v.pendientes > 0 && (
        <section className="adm-card adm-salud">
          <ul className="adm-pendientes">
            <li>
              <button className="adm-pendiente" onClick={() => onVerPedidos('pendiente')}>
                <WarningCircle size={19} weight="light" />
                <span className="adm-pendiente-txt">
                  Tienes <strong>{v.pendientes}</strong>{' '}
                  {v.pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'} por{' '}
                  <strong>{marca.moneda} {v.porCobrar.toLocaleString('es-PE')}</strong>.{' '}
                  {v.pendientes === 1
                    ? 'Márcalo como pagado o cancélalo si no concretó.'
                    : 'Márcalos como pagados o cancélalos si no concretaron.'}
                </span>
                <span className="adm-pendiente-cta">Revisar <CaretRight size={13} weight="bold" /></span>
              </button>
            </li>
          </ul>
        </section>
      )}

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Pedidos de los últimos 7 días</h2>
            <p className="adm-card-ayuda">Cuántos pedidos entraron cada día.</p>
          </div>
          <Barras datos={v.porDia} />
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Estado de los pedidos</h2>
            <p className="adm-card-ayuda">Cuántos cobraste y cuántos quedaron sin concretar.</p>
          </div>
          {v.total ? (
            <Barras
              datos={v.porEstado}
              colores={COLORES_ESTADO}
              total={v.total}
              onClic={(d) => onVerPedidos(d.clave)}
            />
          ) : (
            <p className="adm-vacio-texto">Aún no hay pedidos.</p>
          )}
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2 className="adm-card-titulo">Lo más pedido</h2>
          <p className="adm-card-ayuda">
            Los perfumes que más te piden (sin contar pedidos cancelados). Útil para saber qué reponer.
          </p>
        </div>
        {v.masPedidos.length ? (
          <Barras datos={v.masPedidos} sufijo=" u." />
        ) : (
          <p className="adm-vacio-texto">Aún no hay pedidos que analizar.</p>
        )}
      </section>

      {/* ================= CATÁLOGO ================= */}
      <h2 className="adm-separador-seccion">Tu catálogo</h2>

      <div className="adm-kpis">
        {kpisCatalogo.map((k) => (
          <article className="adm-kpi" key={k.etiqueta}>
            <k.icono size={20} weight="light" className="adm-kpi-icono" />
            <p className="adm-kpi-valor">{k.valor}</p>
            <p className="adm-kpi-etiqueta">{k.etiqueta}</p>
            <p className="adm-kpi-pie">{k.pie}</p>
          </article>
        ))}
      </div>

      <section className="adm-card adm-salud">
        <div className="adm-card-head">
          <h2 className="adm-card-titulo">Qué te falta completar</h2>
          <p className="adm-card-ayuda">Un catálogo completo se ve más profesional y vende mejor.</p>
        </div>

        {pendientes.length === 0 ? (
          <p className="adm-todo-ok">
            <CheckCircle size={22} weight="fill" />
            {m.total === 0
              ? 'Aún no hay productos cargados.'
              : 'Todo completo. Tu catálogo no tiene datos pendientes.'}
          </p>
        ) : (
          <ul className="adm-pendientes">
            {pendientes.map((s) => (
              <li key={s.clave}>
                <button
                  className="adm-pendiente"
                  onClick={() => onVerProductos({ tipo: s.clave, etiqueta: s.etiqueta })}
                >
                  <WarningCircle size={19} weight="light" />
                  <span className="adm-pendiente-txt">
                    <strong>{s.items.length}</strong>{' '}
                    {s.items.length === 1 ? 'producto' : 'productos'} {s.etiqueta.toLowerCase()}
                  </span>
                  <span className="adm-pendiente-cta">Revisar <CaretRight size={13} weight="bold" /></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Para quién son tus perfumes</h2>
            <p className="adm-card-ayuda">Cuántos productos tienes por género.</p>
          </div>
          <Barras
            datos={m.porGenero}
            colores={COLORES_GENERO}
            total={m.total}
            onClic={(d) => onVerProductos({ tipo: 'genero', valor: d.clave, etiqueta: d.etiqueta })}
          />
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Marcas con más productos</h2>
            <p className="adm-card-ayuda">Tus 6 marcas principales.</p>
          </div>
          {m.porMarca.length ? (
            <Barras
              datos={m.porMarca}
              total={m.total}
              onClic={(d) => onVerProductos({ tipo: 'marca', valor: d.clave, etiqueta: d.etiqueta })}
            />
          ) : (
            <p className="adm-vacio-texto">Aún no hay productos.</p>
          )}
        </section>
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Cómo están tus precios</h2>
            <p className="adm-card-ayuda">Cuántos productos hay en cada rango.</p>
          </div>
          <Barras
            datos={m.porRangoPrecio}
            total={m.total}
            onClic={(d) => onVerProductos({ tipo: 'rango', valor: d.clave, etiqueta: d.etiqueta })}
          />
          <div className="adm-extremos">
            <div>
              <p className="adm-dato-etiqueta">Más caro</p>
              <p className="adm-dato-valor">{m.masCaro ? `${marca.moneda} ${m.masCaro.precio}` : '—'}</p>
              <p className="adm-dato-pie">{m.masCaro ? `${m.masCaro.marca} ${m.masCaro.nombre}` : ''}</p>
            </div>
            <div>
              <p className="adm-dato-etiqueta">Más accesible</p>
              <p className="adm-dato-valor">{m.masBarato ? `${marca.moneda} ${m.masBarato.precio}` : '—'}</p>
              <p className="adm-dato-pie">{m.masBarato ? `${m.masBarato.marca} ${m.masBarato.nombre}` : ''}</p>
            </div>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-card-titulo">Últimos agregados</h2>
            <p className="adm-card-ayuda">Los productos más recientes de tu catálogo.</p>
          </div>
          {m.recientes.length ? (
            <ul className="adm-recientes">
              {m.recientes.map((p) => (
                <li key={p.id}>
                  <button
                    className="adm-reciente"
                    onClick={() => onVerProductos({ tipo: 'busqueda', valor: p.nombre, etiqueta: p.nombre })}
                  >
                    {p.imagen ? (
                      <img src={p.imagen} alt="" className="adm-thumb" />
                    ) : (
                      <span className="adm-thumb adm-thumb-vacio" />
                    )}
                    <span className="adm-reciente-info">
                      <span className="adm-reciente-marca">{p.marca}</span>
                      <span className="adm-reciente-nombre">{p.nombre}</span>
                    </span>
                    <span className="adm-reciente-precio">{marca.moneda} {p.precio}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="adm-vacio-texto">
              <ShoppingBag size={20} weight="light" /> Aún no hay productos.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
