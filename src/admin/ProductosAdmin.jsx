import { useState, useRef, useEffect } from 'react'
import {
  PencilSimple, Trash, Plus, X, DownloadSimple,
  ArrowCounterClockwise, UploadSimple, Spinner, FunnelSimple,
  ArrowUp, ArrowDown, ArrowLineUp,
} from '@phosphor-icons/react'
import { exportarJSON, modoLocal, RANGOS_PRECIO } from './adminStore.js'
import { marca, concentraciones } from '../config.js'
import { imagenOptimizada } from '../lib/imagenUrl.js'
import {
  esSoloDecant, sinPrecio, tieneDecants,
} from '../lib/presentaciones.js'
import { CAMPO_COLECCION, CAMPO_DECANTS, ordenarPor } from '../lib/orden.js'

// Las dos secciones de la tienda, cada una con su pestaña y su orden.
// Un perfume en frasco que también se vende en decant está en las dos.
const SECCIONES = {
  coleccion: {
    nombre: 'La colección',
    campo: CAMPO_COLECCION,
    pertenece: (p) => !esSoloDecant(p),
  },
  decants: {
    nombre: 'Decants',
    campo: CAMPO_DECANTS,
    // Un "solo decant" entra aunque le falte precio: así se ve aquí y se
    // puede corregir, en vez de quedar escondido en ninguna pestaña.
    pertenece: (p) => esSoloDecant(p) || tieneDecants(p),
  },
}

// Precio de una medida de decant para la tabla ("—" si no se vende).
function celdaDecant(valor) {
  return valor ? `${marca.moneda} ${valor}` : '—'
}

const VACIO = {
  nombre: '',
  marca: '',
  genero: 'unisex',
  familia: '',
  notas: '',
  concentracion: '',
  ml: 100,
  precio: 0,
  precioAntes: '',
  stock: '',
  decant3ml: '',
  decant5ml: '',
  decant10ml: '',
  soloDecant: false, // true = no se vende en frasco, solo en decant
  // La columna "destacado" ya no se usa en la tienda; se conserva para no
  // perder lo que hubiera cargado en la base de datos.
  destacado: false,
  openBox: false, // false = Sellado (lo normal en un producto nuevo)
  agotado: false,
  imagen: '',
}

// Aplica el filtro que llega desde el dashboard.
function cumpleFiltro(p, filtro) {
  if (!filtro) return true
  switch (filtro.tipo) {
    case 'genero':
      return p.genero === filtro.valor
    case 'marca':
      return p.marca === filtro.valor
    case 'rango': {
      // Los rangos son de precio de frasco, igual que el gráfico del
      // dashboard: un perfume de solo decant no entra en ninguno.
      if (esSoloDecant(p)) return false
      const r = RANGOS_PRECIO.find((x) => x.clave === filtro.valor)
      if (!r) return true
      const precio = Number(p.precio) || 0
      return precio >= r.min && precio <= r.max
    }
    case 'sinFoto':
      return !p.imagen
    case 'sinPrecio':
      return sinPrecio(p)
    case 'sinConcentracion':
      return !p.concentracion
    case 'sinNotas':
      return !p.notas
    default:
      return true
  }
}

export default function ProductosAdmin({
  productos, onCrear, onActualizar, onEliminar, onReordenar, onRestaurar, onSubirImagen,
  filtroExterno, onLimpiarFiltro,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VACIO)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [errorForm, setErrorForm] = useState('')
  const inputArchivo = useRef(null)

  // Si el dashboard pidió buscar un producto concreto, lo ponemos en el buscador.
  useEffect(() => {
    if (filtroExterno?.tipo === 'busqueda') setBusqueda(filtroExterno.valor)
  }, [filtroExterno])

  const filtroTabla = filtroExterno?.tipo === 'busqueda' ? null : filtroExterno

  // Pestaña activa: cada una es idéntica a su sección de la tienda.
  const [pestana, setPestana] = useState('coleccion')
  const seccion = SECCIONES[pestana]
  const otraClave = pestana === 'coleccion' ? 'decants' : 'coleccion'
  const otra = SECCIONES[otraClave]

  // Los productos de esta sección, en el orden en que los ve el comprador.
  const listaSeccion = ordenarPor(productos.filter(seccion.pertenece), seccion.campo)

  const q = busqueda.trim().toLowerCase()
  const coincide = (p) =>
    cumpleFiltro(p, filtroTabla) &&
    (!q ||
      p.nombre.toLowerCase().includes(q) ||
      p.marca.toLowerCase().includes(q) ||
      (p.familia || '').toLowerCase().includes(q))

  const filtrados = listaSeccion.filter(coincide)

  // Si busca algo que vive SOLO en la otra pestaña (p. ej. un perfume de
  // solo decant buscado desde La colección), se le avisa en vez de
  // mostrarle "no hay resultados" sin más.
  const hayBusqueda = Boolean(q || filtroTabla)
  const soloEnLaOtra = hayBusqueda
    ? productos.filter((p) => otra.pertenece(p) && !seccion.pertenece(p) && coincide(p)).length
    : 0

  // Solo se puede reordenar viendo la sección COMPLETA: dentro de una
  // búsqueda o un filtro, "subir una posición" no querría decir nada
  // porque los productos de en medio están escondidos.
  const ordenable = !hayBusqueda

  // Mueve un producto dentro de la sección y guarda solo ese orden.
  const mover = (desde, hasta) => {
    if (!ordenable || hasta < 0 || hasta >= listaSeccion.length || desde === hasta) return
    const nueva = [...listaSeccion]
    const [movido] = nueva.splice(desde, 1)
    nueva.splice(hasta, 0, movido)
    onReordenar?.(nueva, seccion.campo)
  }

  const abrirNuevo = () => {
    // Creado desde la pestaña Decants, lo más probable es que sea un
    // perfume que se vende solo en decant. Queda visible en el formulario
    // ("¿Cómo se vende?") y se puede cambiar.
    setForm({ ...VACIO, soloDecant: pestana === 'decants' })
    setErrorForm('')
    setEditando('nuevo')
  }

  const abrirEditar = (p) => {
    setForm({
      ...VACIO,
      ...p,
      // Los campos opcionales vacíos deben ser '' y no undefined,
      // para que React los trate como campos controlados.
      precioAntes: p.precioAntes || '',
      // El 0 es un valor válido (agotado), por eso no se usa "||".
      stock: p.stock === null || p.stock === undefined ? '' : p.stock,
      decant3ml: p.decant3ml || '',
      decant5ml: p.decant5ml || '',
      decant10ml: p.decant10ml || '',
      soloDecant: !!p.soloDecant,
    })
    setErrorForm('')
    setEditando(p.id)
  }

  const cerrar = () => {
    setEditando(null)
    setForm(VACIO)
    setErrorForm('')
  }

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  // --- Subida de imagen ---
  const alElegirArchivo = async (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    setSubiendo(true)
    setErrorForm('')
    try {
      const url = await onSubirImagen(archivo)
      setForm((f) => ({ ...f, imagen: url }))
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setSubiendo(false)
      if (inputArchivo.current) inputArchivo.current.value = ''
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setErrorForm('')
    const limpio = {
      ...form,
      ml: Number(form.ml) || 0,
      precio: Number(form.precio) || 0,
      precioAntes: form.precioAntes ? Number(form.precioAntes) : undefined,
      // Vacío = sin control de stock. El 0 sí se guarda (agotado).
      stock: form.stock === '' ? null : Number(form.stock),
      // Vacío = ese perfume no se vende en esa medida
      decant3ml: form.decant3ml ? Number(form.decant3ml) : undefined,
      decant5ml: form.decant5ml ? Number(form.decant5ml) : undefined,
      decant10ml: form.decant10ml ? Number(form.decant10ml) : undefined,
    }
    if (!limpio.precioAntes) delete limpio.precioAntes

    // Un perfume de solo decant sin ningún precio de decant no aparecería
    // en ninguna parte de la tienda: se frena antes de guardar.
    if (limpio.soloDecant && !limpio.decant3ml && !limpio.decant5ml && !limpio.decant10ml) {
      setErrorForm(
        'Marcaste "Solo en decant" pero no pusiste ningún precio de decant. ' +
          'Pon al menos uno (3, 5 o 10 ml); si no, este perfume no se vería en la tienda.',
      )
      setGuardando(false)
      return
    }

    try {
      const { id, ...sinId } = limpio
      if (editando === 'nuevo') await onCrear(sinId)
      else await onActualizar(editando, sinId)
      cerrar()
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (p) => {
    if (window.confirm(`¿Eliminar "${p.marca} ${p.nombre}"? Esta acción no se puede deshacer.`)) {
      try {
        await onEliminar(p.id)
      } catch (e) {
        /* el error se muestra arriba */
      }
    }
  }

  const restaurar = async () => {
    if (window.confirm('Esto descarta tus cambios y vuelve al catálogo original. ¿Continuar?')) {
      try {
        await onRestaurar()
      } catch (e) {
        /* mostrado arriba */
      }
    }
  }

  const limpiarTodo = () => {
    setBusqueda('')
    onLimpiarFiltro?.()
  }

  return (
    <div className="adm-seccion">
      <header className="adm-seccion-head adm-head-fila">
        <div>
          <h1 className="adm-titulo">Productos</h1>
          <p className="adm-sub">{productos.length} en el catálogo</p>
        </div>
        <div className="adm-head-acciones">
          <button className="adm-btn adm-btn-ghost" onClick={() => exportarJSON(productos)}>
            <DownloadSimple size={17} /> Exportar JSON
          </button>
          {modoLocal && (
            <button className="adm-btn adm-btn-ghost" onClick={restaurar}>
              <ArrowCounterClockwise size={17} /> Restaurar
            </button>
          )}
          <button className="adm-btn adm-btn-primary" onClick={abrirNuevo}>
            <Plus size={17} weight="bold" /> Nuevo producto
          </button>
        </div>
      </header>

      {/* Una pestaña por sección de la tienda, cada una con su orden */}
      <div className="adm-filtros" role="tablist" aria-label="Sección de la tienda">
        {Object.entries(SECCIONES).map(([clave, s]) => (
          <button
            key={clave}
            role="tab"
            aria-selected={pestana === clave}
            className={`adm-chip ${pestana === clave ? 'adm-chip-activo' : ''}`}
            onClick={() => setPestana(clave)}
          >
            {s.nombre} <em>{productos.filter(s.pertenece).length}</em>
          </button>
        ))}
      </div>

      {/* Filtro activo llegado desde el dashboard */}
      {(filtroExterno || busqueda) && (
        <div className="adm-filtro-activo">
          <FunnelSimple size={17} weight="light" />
          <span>
            Mostrando <strong>{filtrados.length}</strong> de {listaSeccion.length} en {seccion.nombre}
            {filtroExterno && <> · {filtroExterno.etiqueta}</>}
          </span>
          <button onClick={limpiarTodo}>Quitar filtro</button>
        </div>
      )}

      <input
        className="adm-input adm-buscador"
        type="search"
        placeholder={`Buscar en ${seccion.nombre} por nombre, marca o familia…`}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Lo que busca existe, pero solo en la otra pestaña */}
      {soloEnLaOtra > 0 && (
        <button className="adm-aviso-otra" onClick={() => setPestana(otraClave)}>
          {soloEnLaOtra === 1
            ? `Hay 1 resultado más que está solo en ${otra.nombre}.`
            : `Hay ${soloEnLaOtra} resultados más que están solo en ${otra.nombre}.`}{' '}
          <strong>Ver en {otra.nombre} →</strong>
        </button>
      )}

      <p className="adm-ayuda adm-ayuda-orden">
        {ordenable ? (
          pestana === 'coleccion' ? (
            <>
              Este es el orden de La colección (frascos completos), tal como la ven
              tus clientes. Usa las flechas para subir o bajar un perfume,
              y <ArrowLineUp size={13} weight="bold" /> para mandarlo al principio. Se guarda solo.
            </>
          ) : (
            <>
              Este es el orden de la sección Decants. Es <strong>independiente</strong> de
              La colección: un perfume que está en las dos puede ir primero aquí y
              último allá. Usa las flechas o <ArrowLineUp size={13} weight="bold" /> igual. Se guarda solo.
            </>
          )
        ) : (
          <>
            Para cambiar el orden, quita la búsqueda o el filtro: hay que ver la
            sección completa para poder mover un perfume de sitio.
          </>
        )}
      </p>

      <div className="adm-tabla-wrap">
        <table className="adm-tabla">
          <thead>
            {pestana === 'coleccion' ? (
              <tr>
                <th className="adm-th-orden">Orden</th>
                <th></th>
                <th>Marca</th>
                <th>Producto</th>
                <th>Género</th>
                <th>ml</th>
                <th>Precio</th>
                <th>Antes</th>
                <th>Stock</th>
                <th></th>
              </tr>
            ) : (
              <tr>
                <th className="adm-th-orden">Orden</th>
                <th></th>
                <th>Marca</th>
                <th>Producto</th>
                <th>3 ml</th>
                <th>5 ml</th>
                <th>10 ml</th>
                <th></th>
              </tr>
            )}
          </thead>
          <tbody>
            {filtrados.map((p, i) => (
              <tr key={p.id}>
                <td>
                  <div className="adm-orden">
                    <span className="adm-orden-num">{ordenable ? i + 1 : '·'}</span>
                    <div className="adm-orden-btns">
                      <button
                        onClick={() => mover(i, i - 1)}
                        disabled={!ordenable || i === 0}
                        title="Subir una posición"
                        aria-label={`Subir ${p.marca} ${p.nombre} una posición`}
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => mover(i, i + 1)}
                        disabled={!ordenable || i === filtrados.length - 1}
                        title="Bajar una posición"
                        aria-label={`Bajar ${p.marca} ${p.nombre} una posición`}
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => mover(i, 0)}
                        disabled={!ordenable || i === 0}
                        title={`Mandar al principio de ${seccion.nombre}`}
                        aria-label={`Mandar ${p.marca} ${p.nombre} al principio de ${seccion.nombre}`}
                      >
                        <ArrowLineUp size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  {p.imagen ? (
                    <img
                      src={imagenOptimizada(p.imagen, 120)}
                      alt=""
                      className="adm-thumb"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="adm-thumb adm-thumb-vacio" />
                  )}
                </td>
                <td className="adm-td-marca">{p.marca}</td>
                <td>
                  <span className="adm-td-nombre">{p.nombre}</span>
                  {p.soloDecant && <span className="adm-pill adm-pill-decant">Solo decant</span>}
                  {pestana === 'coleccion' && p.openBox && (
                    <span className="adm-pill adm-pill-openbox">Open Box</span>
                  )}
                  {p.agotado && <span className="adm-pill adm-pill-agotado">Agotado</span>}
                </td>

                {pestana === 'coleccion' ? (
                  <>
                    {/* En La colección nunca hay perfumes de solo decant */}
                    <td className="adm-td-suave">{p.genero}</td>
                    <td className="adm-td-suave">{p.ml}</td>
                    <td>{marca.moneda} {p.precio}</td>
                    <td className="adm-td-suave">
                      {p.precioAntes ? `${marca.moneda} ${p.precioAntes}` : '—'}
                    </td>
                    <td>
                      {p.stock === null || p.stock === undefined ? (
                        <span className="adm-td-suave">—</span>
                      ) : (
                        <span className={`adm-stock ${p.stock === 0 ? 'adm-stock-cero' : p.stock <= 3 ? 'adm-stock-bajo' : ''}`}>
                          {p.stock}
                        </span>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    {/* En Decants lo que importa son los precios por medida */}
                    <td className={p.decant3ml ? '' : 'adm-td-suave'}>{celdaDecant(p.decant3ml)}</td>
                    <td className={p.decant5ml ? '' : 'adm-td-suave'}>{celdaDecant(p.decant5ml)}</td>
                    <td className={p.decant10ml ? '' : 'adm-td-suave'}>{celdaDecant(p.decant10ml)}</td>
                  </>
                )}
                <td>
                  <div className="adm-acciones">
                    <button onClick={() => abrirEditar(p)} aria-label={`Editar ${p.nombre}`}>
                      <PencilSimple size={17} />
                    </button>
                    <button onClick={() => eliminar(p)} aria-label={`Eliminar ${p.nombre}`} className="adm-borrar">
                      <Trash size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <p className="adm-vacio-texto">
            {productos.length === 0
              ? 'Aún no hay productos. Crea el primero.'
              : listaSeccion.length === 0
                ? pestana === 'decants'
                  ? 'Todavía no hay decants. Ponle precio de decant a un perfume, o crea uno "Solo en decant".'
                  : 'No hay frascos en La colección.'
                : 'No hay productos que coincidan.'}
          </p>
        )}
      </div>

      {/* Formulario */}
      {editando && (
        <div className="adm-modal-fondo" onClick={cerrar}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h2>{editando === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}</h2>
              <button onClick={cerrar} aria-label="Cerrar"><X size={20} /></button>
            </div>

            <form className="adm-form" onSubmit={enviar}>
              <label className="adm-campo">
                <span>Marca</span>
                <input className="adm-input" value={form.marca} onChange={cambiar('marca')} required placeholder="Dior" />
              </label>

              <label className="adm-campo">
                <span>Nombre del perfume</span>
                <input className="adm-input" value={form.nombre} onChange={cambiar('nombre')} required placeholder="Sauvage EDP" />
              </label>

              <label className="adm-campo">
                <span>Género</span>
                <select className="adm-input" value={form.genero} onChange={cambiar('genero')}>
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="unisex">Unisex</option>
                </select>
              </label>

              <label className="adm-campo">
                <span>Concentración</span>
                <select className="adm-input" value={form.concentracion} onChange={cambiar('concentracion')}>
                  <option value="">Sin especificar</option>
                  {concentraciones.map((c) => (
                    <option key={c.valor} value={c.valor}>{c.nombre}</option>
                  ))}
                </select>
              </label>

              {/* Estado del frasco: ya NO se muestra en la tienda (el cliente
                  pidió quitar las etiquetas). Se mantiene como control interno
                  para que sepa qué frascos son tester, por eso la ayuda avisa
                  que el comprador no lo ve. */}
              <label className="adm-campo">
                <span>Estado del frasco</span>
                <select
                  className="adm-input"
                  value={form.openBox ? 'openbox' : 'sellado'}
                  onChange={(e) => setForm((f) => ({ ...f, openBox: e.target.value === 'openbox' }))}
                >
                  <option value="sellado">Sellado</option>
                  <option value="openbox">Open Box (caja abierta / tester)</option>
                </select>
                <small className="adm-ayuda">
                  Solo para tu control: el comprador no ve este dato en la tienda.
                </small>
              </label>

              <label className="adm-campo">
                <span>Familia olfativa</span>
                <input className="adm-input" value={form.familia} onChange={cambiar('familia')} placeholder="Amaderado Aromático" />
              </label>

              <label className="adm-campo">
                <span>Contenido (ml)</span>
                <input className="adm-input" type="number" min="0" value={form.ml} onChange={cambiar('ml')} />
              </label>

              <label className="adm-campo adm-campo-ancho">
                <span>Notas principales</span>
                <input className="adm-input" value={form.notas} onChange={cambiar('notas')} placeholder="Bergamota, pimienta, ambroxan" />
              </label>

              {/* ---- Cómo se vende ---- */}
              {/* Decide qué campos de precio tienen sentido: un perfume de
                  solo decant no tiene precio de frasco ni stock de frascos. */}
              <label className="adm-campo adm-campo-ancho">
                <span>¿Cómo se vende?</span>
                <select
                  className="adm-input"
                  value={form.soloDecant ? 'decant' : 'frasco'}
                  onChange={(e) => setForm((f) => ({ ...f, soloDecant: e.target.value === 'decant' }))}
                >
                  <option value="frasco">Frasco completo (y en decant si le pones precio abajo)</option>
                  <option value="decant">Solo en decant (no se vende el frasco)</option>
                </select>
                <small className="adm-ayuda">
                  {form.soloDecant
                    ? 'Aparecerá solo en la sección "Decants" de la tienda, no en La colección.'
                    : 'Aparecerá en La colección como frasco completo.'}
                </small>
              </label>

              {!form.soloDecant && (
                <>
                  <label className="adm-campo">
                    <span>Precio ({marca.moneda})</span>
                    <input className="adm-input" type="number" min="0" value={form.precio} onChange={cambiar('precio')} required />
                  </label>

                  <label className="adm-campo">
                    <span>Precio antes (opcional)</span>
                    <input className="adm-input" type="number" min="0" value={form.precioAntes} onChange={cambiar('precioAntes')} placeholder="Para mostrar oferta" />
                  </label>

                  <label className="adm-campo adm-campo-ancho">
                    <span>Stock (unidades del frasco)</span>
                    <input
                      className="adm-input"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={cambiar('stock')}
                      placeholder="Vacío = sin control de stock"
                    />
                    <small className="adm-ayuda">
                      Si pones un número, el cliente no podrá pedir más de esa
                      cantidad. Al llegar a <strong>0</strong> el perfume se marca
                      como agotado solo. Déjalo vacío si no quieres llevar control.
                    </small>
                  </label>
                </>
              )}

              {/* ---- Decants ---- */}
              <div className="adm-separador">
                <span>{form.soloDecant ? 'Decants (pon al menos uno)' : 'Decants (opcional)'}</span>
                <p>
                  {form.soloDecant
                    ? 'Pon el precio de cada medida que vendas. Deja vacía la que no tengas.'
                    : 'Si vendes este perfume en decant, pon el precio. Aparecerá además en la sección "Decants" de la tienda. Déjalo vacío si solo lo vendes en frasco completo.'}
                </p>
              </div>

              <div className="adm-campo-ancho adm-decants-fila">
                {[
                  { campo: 'decant3ml', ml: 3 },
                  { campo: 'decant5ml', ml: 5 },
                  { campo: 'decant10ml', ml: 10 },
                ].map(({ campo, ml }) => (
                  <label className="adm-campo" key={campo}>
                    <span>Decant {ml} ml ({marca.moneda})</span>
                    <input
                      className="adm-input"
                      type="number"
                      min="0"
                      value={form[campo]}
                      onChange={cambiar(campo)}
                      placeholder="Vacío = no"
                    />
                  </label>
                ))}
              </div>

              {/* ---- Imagen del producto ---- */}
              <div className="adm-campo adm-campo-ancho">
                <span>Foto del producto</span>
                <div className="adm-imagen-zona">
                  {form.imagen ? (
                    <img src={imagenOptimizada(form.imagen, 500)} alt="" className="adm-preview" />
                  ) : (
                    <div className="adm-preview adm-preview-vacio">Sin foto</div>
                  )}

                  <div className="adm-imagen-acciones">
                    <input
                      ref={inputArchivo}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={alElegirArchivo}
                      hidden
                      id="subir-foto"
                    />
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost"
                      onClick={() => inputArchivo.current?.click()}
                      disabled={subiendo}
                    >
                      {subiendo ? <Spinner size={17} className="adm-girando" /> : <UploadSimple size={17} />}
                      {subiendo ? 'Subiendo…' : 'Subir imagen'}
                    </button>
                    {form.imagen && (
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost"
                        onClick={() => setForm((f) => ({ ...f, imagen: '' }))}
                      >
                        Quitar
                      </button>
                    )}
                    <p className="adm-ayuda">
                      JPG, PNG o WebP · máx. 5 MB
                      {modoLocal && ' · en modo local la foto solo se guarda en este navegador'}
                    </p>
                  </div>
                </div>
              </div>

              <label className="adm-campo adm-campo-ancho">
                <span>…o pega la URL de una imagen</span>
                <input className="adm-input" value={form.imagen} onChange={cambiar('imagen')} placeholder="https://…" />
              </label>

              <label className="adm-check">
                <input type="checkbox" checked={!!form.agotado} onChange={cambiar('agotado')} />
                <span>Agotado (sin stock: no se puede comprar, solo consultar)</span>
              </label>

              {errorForm && <p className="adm-error adm-campo-ancho">{errorForm}</p>}

              <div className="adm-form-acciones">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={cerrar}>Cancelar</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={guardando || subiendo}>
                  {guardando ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
