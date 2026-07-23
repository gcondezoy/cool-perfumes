import { useState, useEffect, useCallback } from 'react'
import { ChartBar, Package, SignOut, ArrowSquareOut, Warning, Database } from '@phosphor-icons/react'
import {
  listarProductos,
  getProductosCache,
  suscribir,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarSemilla,
  subirImagen,
  iniciarSesion,
  cerrarSesion,
  sesionActual,
  modoLocal,
} from './adminStore.js'
import { marca } from '../config.js'
import Dashboard from './Dashboard.jsx'
import ProductosAdmin from './ProductosAdmin.jsx'
import './admin.css'

const SESION_LOCAL = 'coolperfumes_admin_ok'

export default function AdminApp() {
  const [autenticado, setAutenticado] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [vista, setVista] = useState('dashboard')
  const [filtroExterno, setFiltroExterno] = useState(null)
  const [productos, setProductos] = useState(getProductosCache)
  const [errorDatos, setErrorDatos] = useState('')

  // ---- Sesión ----
  useEffect(() => {
    let vivo = true
    const revisar = async () => {
      if (modoLocal) {
        if (vivo) setAutenticado(sessionStorage.getItem(SESION_LOCAL) === '1')
      } else {
        const s = await sesionActual()
        if (vivo) setAutenticado(!!s)
      }
      if (vivo) setVerificando(false)
    }
    revisar()
    return () => {
      vivo = false
    }
  }, [])

  // ---- Carga de productos ----
  const cargar = useCallback(async () => {
    try {
      const lista = await listarProductos()
      setProductos(lista)
      setErrorDatos('')
    } catch (e) {
      setErrorDatos(e.message)
    }
  }, [])

  useEffect(() => {
    if (!autenticado) return
    cargar()
    const desuscribir = suscribir(cargar)
    return desuscribir
  }, [autenticado, cargar])

  // ---- Acciones ----
  const conManejo = (fn) => async (...args) => {
    try {
      const resultado = await fn(...args)
      if (Array.isArray(resultado)) setProductos(resultado)
      else await cargar()
      setErrorDatos('')
    } catch (e) {
      setErrorDatos(e.message)
      throw e
    }
  }

  const onCrear = conManejo(crearProducto)
  const onActualizar = conManejo(actualizarProducto)
  const onEliminar = conManejo(eliminarProducto)
  const onRestaurar = conManejo(restaurarSemilla)

  const entrar = async (e) => {
    e.preventDefault()
    setEntrando(true)
    setError('')
    try {
      if (modoLocal) {
        if (clave !== marca.adminPassword) throw new Error('Clave incorrecta')
        sessionStorage.setItem(SESION_LOCAL, '1')
      } else {
        await iniciarSesion(email, clave)
      }
      setAutenticado(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setEntrando(false)
    }
  }

  const salir = async () => {
    if (modoLocal) sessionStorage.removeItem(SESION_LOCAL)
    else await cerrarSesion()
    setAutenticado(false)
    setClave('')
  }

  if (verificando) {
    return <div className="adm-login"><p className="adm-sub">Cargando…</p></div>
  }

  // ---- Pantalla de acceso ----
  if (!autenticado) {
    return (
      <div className="adm-login">
        <form className="adm-login-card" onSubmit={entrar}>
          <img src={marca.logo} alt={marca.nombre} className="adm-login-logo" />
          <h1 className="adm-login-titulo">Panel administrativo</h1>

          {!modoLocal && (
            <label className="adm-campo">
              <span>Correo</span>
              <input
                className="adm-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </label>
          )}

          <label className="adm-campo">
            <span>{modoLocal ? 'Clave de acceso' : 'Contraseña'}</span>
            <input
              className="adm-input"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              autoFocus={modoLocal}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="adm-error">{error}</p>}

          <button type="submit" className="adm-btn adm-btn-primary adm-btn-full" disabled={entrando}>
            {entrando ? 'Entrando…' : 'Entrar'}
          </button>

          <a href="/" className="adm-login-volver">Volver a la tienda</a>
        </form>
      </div>
    )
  }

  // ---- Panel ----
  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <img src={marca.logo} alt={marca.nombre} className="adm-sidebar-logo" />

        <nav className="adm-nav">
          <button
            className={vista === 'dashboard' ? 'activo' : ''}
            onClick={() => { setVista('dashboard'); setFiltroExterno(null) }}
          >
            <ChartBar size={19} weight="light" /> Dashboard
          </button>
          <button
            className={vista === 'productos' ? 'activo' : ''}
            onClick={() => { setVista('productos'); setFiltroExterno(null) }}
          >
            <Package size={19} weight="light" /> Productos
          </button>
        </nav>

        <div className="adm-sidebar-pie">
          <a href="/" className="adm-sidebar-link">
            <ArrowSquareOut size={17} /> Ver tienda
          </a>
          <button className="adm-sidebar-link" onClick={salir}>
            <SignOut size={17} /> Salir
          </button>
        </div>
      </aside>

      <main className="adm-main">
        {modoLocal ? (
          <div className="adm-aviso">
            <Warning size={18} weight="light" />
            <p>
              <strong>Modo local:</strong> los cambios se guardan solo en este
              navegador. Configura Supabase (ver <code>supabase/setup.sql</code>) para
              que sean permanentes y tus clientes los vean.
            </p>
          </div>
        ) : (
          <div className="adm-aviso adm-aviso-ok">
            <Database size={18} weight="light" />
            <p>Conectado a Supabase. Los cambios se guardan en la base de datos.</p>
          </div>
        )}

        {errorDatos && (
          <div className="adm-aviso adm-aviso-error">
            <Warning size={18} weight="light" />
            <p>{errorDatos}</p>
          </div>
        )}

        {vista === 'dashboard' ? (
          <Dashboard
            productos={productos}
            onVerProductos={(filtro) => {
              setFiltroExterno(filtro)
              setVista('productos')
            }}
          />
        ) : (
          <ProductosAdmin
            productos={productos}
            onCrear={onCrear}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
            onRestaurar={onRestaurar}
            onSubirImagen={subirImagen}
            filtroExterno={filtroExterno}
            onLimpiarFiltro={() => setFiltroExterno(null)}
          />
        )}
      </main>
    </div>
  )
}
