import { useState, useRef } from 'react'
import {
  PencilSimple, Trash, Plus, X, DownloadSimple,
  ArrowCounterClockwise, UploadSimple, Spinner,
} from '@phosphor-icons/react'
import { exportarJSON, modoLocal } from './adminStore.js'
import { marca } from '../config.js'

const VACIO = {
  nombre: '',
  marca: '',
  genero: 'unisex',
  familia: '',
  notas: '',
  ml: 100,
  precio: 0,
  precioAntes: '',
  destacado: false,
  imagen: '',
  // Ficha completa (se muestra al hacer clic en el producto)
  descripcion: '',
  concentracion: '',
  notasSalida: '',
  notasCorazon: '',
  notasFondo: '',
  duracion: '',
  estela: '',
  ocasion: '',
}

export default function ProductosAdmin({
  productos, onCrear, onActualizar, onEliminar, onRestaurar, onSubirImagen,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VACIO)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [errorForm, setErrorForm] = useState('')
  const inputArchivo = useRef(null)

  const filtrados = productos.filter((p) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.marca.toLowerCase().includes(q) ||
      (p.familia || '').toLowerCase().includes(q)
    )
  })

  const abrirNuevo = () => {
    setForm(VACIO)
    setErrorForm('')
    setEditando('nuevo')
  }

  const abrirEditar = (p) => {
    setForm({ ...VACIO, ...p, precioAntes: p.precioAntes || '' })
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
    }
    if (!limpio.precioAntes) delete limpio.precioAntes

    try {
      if (editando === 'nuevo') {
        const { id, ...sinId } = limpio
        await onCrear(sinId)
      } else {
        const { id, ...sinId } = limpio
        await onActualizar(editando, sinId)
      }
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

      <input
        className="adm-input adm-buscador"
        type="search"
        placeholder="Buscar por nombre, marca o familia…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="adm-tabla-wrap">
        <table className="adm-tabla">
          <thead>
            <tr>
              <th></th>
              <th>Marca</th>
              <th>Producto</th>
              <th>Género</th>
              <th>ml</th>
              <th>Precio</th>
              <th>Antes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imagen ? (
                    <img src={p.imagen} alt="" className="adm-thumb" />
                  ) : (
                    <span className="adm-thumb adm-thumb-vacio" />
                  )}
                </td>
                <td className="adm-td-marca">{p.marca}</td>
                <td>
                  <span className="adm-td-nombre">{p.nombre}</span>
                  {p.destacado && <span className="adm-pill">Destacado</span>}
                </td>
                <td className="adm-td-suave">{p.genero}</td>
                <td className="adm-td-suave">{p.ml}</td>
                <td>{marca.moneda} {p.precio}</td>
                <td className="adm-td-suave">{p.precioAntes ? `${marca.moneda} ${p.precioAntes}` : '—'}</td>
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
            {productos.length === 0 ? 'Aún no hay productos. Crea el primero.' : 'No hay productos que coincidan.'}
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
                <span>Familia olfativa</span>
                <input className="adm-input" value={form.familia} onChange={cambiar('familia')} placeholder="Amaderado Aromático" />
              </label>

              <label className="adm-campo adm-campo-ancho">
                <span>Notas principales</span>
                <input className="adm-input" value={form.notas} onChange={cambiar('notas')} placeholder="Bergamota, pimienta, ambroxan" />
              </label>

              <label className="adm-campo">
                <span>Tamaño (ml)</span>
                <input className="adm-input" type="number" min="0" value={form.ml} onChange={cambiar('ml')} />
              </label>

              <label className="adm-campo">
                <span>Precio ({marca.moneda})</span>
                <input className="adm-input" type="number" min="0" value={form.precio} onChange={cambiar('precio')} required />
              </label>

              <label className="adm-campo">
                <span>Precio antes (opcional)</span>
                <input className="adm-input" type="number" min="0" value={form.precioAntes} onChange={cambiar('precioAntes')} placeholder="Para mostrar oferta" />
              </label>

              {/* ---- Imagen del producto ---- */}
              <div className="adm-campo adm-campo-ancho">
                <span>Foto del producto</span>
                <div className="adm-imagen-zona">
                  {form.imagen ? (
                    <img src={form.imagen} alt="" className="adm-preview" />
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
                <input type="checkbox" checked={!!form.destacado} onChange={cambiar('destacado')} />
                <span>Marcar como destacado</span>
              </label>

              {/* ---- Ficha completa (ventana de detalles) ---- */}
              <div className="adm-separador">
                <span>Ficha completa</span>
                <p>Esto es lo que ve el cliente al hacer clic en el perfume.</p>
              </div>

              <label className="adm-campo adm-campo-ancho">
                <span>Descripción</span>
                <textarea
                  className="adm-input adm-textarea"
                  rows="4"
                  value={form.descripcion}
                  onChange={cambiar('descripcion')}
                  placeholder="Describe cómo huele, para quién es y en qué ocasiones usarlo…"
                />
              </label>

              <label className="adm-campo">
                <span>Concentración</span>
                <select className="adm-input" value={form.concentracion} onChange={cambiar('concentracion')}>
                  <option value="">Sin especificar</option>
                  <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                  <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                  <option value="Parfum">Parfum / Extrait</option>
                  <option value="Eau de Cologne">Eau de Cologne (EDC)</option>
                </select>
              </label>

              <label className="adm-campo">
                <span>Duración</span>
                <input className="adm-input" value={form.duracion} onChange={cambiar('duracion')} placeholder="8 a 10 horas" />
              </label>

              <label className="adm-campo">
                <span>Estela (proyección)</span>
                <input className="adm-input" value={form.estela} onChange={cambiar('estela')} placeholder="Intensa" />
              </label>

              <label className="adm-campo">
                <span>Ocasión</span>
                <input className="adm-input" value={form.ocasion} onChange={cambiar('ocasion')} placeholder="Noche y eventos" />
              </label>

              <label className="adm-campo adm-campo-ancho">
                <span>Notas de salida</span>
                <input className="adm-input" value={form.notasSalida} onChange={cambiar('notasSalida')} placeholder="Bergamota de Calabria, mandarina" />
              </label>

              <label className="adm-campo adm-campo-ancho">
                <span>Notas de corazón</span>
                <input className="adm-input" value={form.notasCorazon} onChange={cambiar('notasCorazon')} placeholder="Pimienta de Sichuan, lavanda" />
              </label>

              <label className="adm-campo adm-campo-ancho">
                <span>Notas de fondo</span>
                <input className="adm-input" value={form.notasFondo} onChange={cambiar('notasFondo')} placeholder="Ambroxan, vainilla, haba tonka" />
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
