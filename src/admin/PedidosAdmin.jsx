import { useState } from 'react'
import { CheckCircle, XCircle, Trash, ArrowCounterClockwise, CaretDown } from '@phosphor-icons/react'
import { ESTADOS, formatearFecha } from './pedidosStore.js'
import { marca } from '../config.js'

const FILTROS = [
  { clave: 'todos', etiqueta: 'Todos' },
  { clave: 'pendiente', etiqueta: 'Pendientes' },
  { clave: 'pagado', etiqueta: 'Pagados' },
  { clave: 'cancelado', etiqueta: 'Cancelados' },
]

export default function PedidosAdmin({ pedidos, onCambiarEstado, onEliminar }) {
  const [filtro, setFiltro] = useState('todos')
  const [abierto, setAbierto] = useState(null)

  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  const eliminar = (p) => {
    if (window.confirm(`¿Eliminar el pedido ${p.codigo}? Esta acción no se puede deshacer.`)) {
      onEliminar(p.id)
    }
  }

  return (
    <div className="adm-seccion">
      <header className="adm-seccion-head">
        <h1 className="adm-titulo">Pedidos</h1>
        <p className="adm-sub">
          Cada vez que alguien pide por WhatsApp queda registrado aquí. Marca como
          pagado cuando recibas el dinero, o cancela si no concretó.
        </p>
      </header>

      <div className="adm-filtros">
        {FILTROS.map((f) => {
          const n = f.clave === 'todos'
            ? pedidos.length
            : pedidos.filter((p) => p.estado === f.clave).length
          return (
            <button
              key={f.clave}
              className={`adm-chip ${filtro === f.clave ? 'adm-chip-activo' : ''}`}
              onClick={() => setFiltro(f.clave)}
            >
              {f.etiqueta} <em>{n}</em>
            </button>
          )
        })}
      </div>

      {lista.length === 0 ? (
        <div className="adm-tabla-wrap">
          <p className="adm-vacio-texto">
            {pedidos.length === 0
              ? 'Todavía no hay pedidos. Aparecerán solos cuando alguien pida desde la tienda.'
              : 'No hay pedidos con ese estado.'}
          </p>
        </div>
      ) : (
        <ul className="ped-lista">
          {lista.map((p) => {
            const est = ESTADOS[p.estado] || ESTADOS.pendiente
            const expandido = abierto === p.id
            return (
              <li key={p.id} className="ped-item">
                <div className="ped-cabecera">
                  <button
                    className="ped-toggle"
                    onClick={() => setAbierto(expandido ? null : p.id)}
                    aria-expanded={expandido}
                  >
                    <CaretDown
                      size={16}
                      weight="bold"
                      className={`ped-caret ${expandido ? 'ped-caret-abierto' : ''}`}
                    />
                    <span className="ped-codigo">{p.codigo}</span>
                    <span className="ped-fecha">{formatearFecha(p.creadoEn)}</span>
                    <span className="ped-cant">
                      {p.cantidad} {p.cantidad === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </button>

                  <span className="ped-total">{marca.moneda} {p.total}</span>

                  <span className="ped-estado" style={{ '--c': est.color }}>
                    {est.etiqueta}
                  </span>

                  <div className="ped-acciones">
                    {p.estado !== 'pagado' && (
                      <button
                        onClick={() => onCambiarEstado(p.id, 'pagado')}
                        title="Marcar como pagado"
                        aria-label={`Marcar ${p.codigo} como pagado`}
                        className="ped-ok"
                      >
                        <CheckCircle size={19} weight="light" />
                      </button>
                    )}
                    {p.estado === 'pendiente' && (
                      <button
                        onClick={() => onCambiarEstado(p.id, 'cancelado')}
                        title="Cancelar (no concretó)"
                        aria-label={`Cancelar ${p.codigo}`}
                      >
                        <XCircle size={19} weight="light" />
                      </button>
                    )}
                    {p.estado !== 'pendiente' && (
                      <button
                        onClick={() => onCambiarEstado(p.id, 'pendiente')}
                        title="Volver a pendiente"
                        aria-label={`Volver ${p.codigo} a pendiente`}
                      >
                        <ArrowCounterClockwise size={17} weight="light" />
                      </button>
                    )}
                    <button
                      onClick={() => eliminar(p)}
                      title="Eliminar pedido"
                      aria-label={`Eliminar ${p.codigo}`}
                      className="adm-borrar"
                    >
                      <Trash size={18} weight="light" />
                    </button>
                  </div>
                </div>

                {expandido && (
                  <ul className="ped-detalle">
                    {p.items.map((it, i) => (
                      <li key={i}>
                        <span className="ped-detalle-cant">{it.cantidad} ×</span>
                        <span className="ped-detalle-nombre">
                          <em>{it.marca}</em> {it.nombre}
                          {it.ml ? ` · ${it.ml} ml` : ''}
                        </span>
                        <span className="ped-detalle-precio">
                          {marca.moneda} {it.precio * it.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
