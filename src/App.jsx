import { useState, useMemo, useCallback, useEffect } from 'react'
import { listarProductos, getProductosCache, suscribir } from './admin/adminStore.js'
import { categorias } from './config.js'

const CLAVE_CARRITO = 'coolperfumes_carrito_v1'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Catalogo from './components/Catalogo.jsx'
import ComoComprar from './components/ComoComprar.jsx'
import ProductoModal from './components/ProductoModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'

export default function App() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  // El carrito se guarda en el navegador para que no se pierda al recargar.
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_CARRITO)
      const lista = guardado ? JSON.parse(guardado) : []
      return Array.isArray(lista) ? lista : []
    } catch {
      return []
    }
  })
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [detalle, setDetalle] = useState(null) // producto abierto en la ficha
  // El catálogo viene del store (Supabase o local; el panel admin lo actualiza).
  const [productos, setProductos] = useState(getProductosCache)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true
    const cargar = async () => {
      try {
        const lista = await listarProductos()
        if (vivo) setProductos(lista)
      } catch (e) {
        console.error(e)
      } finally {
        if (vivo) setCargando(false)
      }
    }
    cargar()
    const desuscribir = suscribir(cargar)
    return () => {
      vivo = false
      desuscribir()
    }
  }, [])

  // Sombra del header al hacer scroll (centinela + IntersectionObserver).
  useEffect(() => {
    const centinela = document.getElementById('top-sentinel')
    if (!centinela) return
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(centinela)
    return () => io.disconnect()
  }, [])

  // --- Lógica del carrito ---
  const agregar = useCallback((producto) => {
    // Seguridad: un producto agotado nunca entra al carrito.
    if (producto.agotado) return
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id)
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }, [])

  const cambiarCantidad = useCallback((id, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + delta } : p))
        .filter((p) => p.cantidad > 0),
    )
  }, [])

  const quitar = useCallback((id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const vaciar = useCallback(() => setCarrito([]), [])

  // Guardar el carrito cada vez que cambia.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch (e) {
      console.warn('No se pudo guardar el carrito:', e)
    }
  }, [carrito])

  const totalItems = useMemo(
    () => carrito.reduce((s, p) => s + p.cantidad, 0),
    [carrito],
  )

  // Filtrar desde el menú (Mujer / Hombre) y llevar al catálogo.
  const filtrarDesdeNav = useCallback((genero) => {
    setFiltro(genero)
    const el = document.getElementById('catalogo')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  // --- Filtrado y búsqueda ---
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return productos
      .filter((p) => {
        const coincideGenero = filtro === 'todos' || p.genero === filtro
        const coincideBusqueda =
          !q ||
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          p.familia.toLowerCase().includes(q) ||
          p.notas.toLowerCase().includes(q)
        return coincideGenero && coincideBusqueda
      })
      // Los agotados van al final (el orden del resto se mantiene).
      .sort((a, b) => (a.agotado === b.agotado ? 0 : a.agotado ? 1 : -1))
  }, [filtro, busqueda, productos])

  return (
    <>
      <div id="top-sentinel" aria-hidden="true" />

      <Header
        totalItems={totalItems}
        scrolled={scrolled}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        onFiltrar={filtrarDesdeNav}
      />

      <main>
        <Hero onVerCatalogo={() => filtrarDesdeNav('todos')} />
        <Catalogo
          productos={productosFiltrados}
          categorias={categorias}
          filtro={filtro}
          onFiltro={setFiltro}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          onAgregar={agregar}
          onAbrirDetalle={setDetalle}
          cargando={cargando}
        />
        <ComoComprar />
      </main>

      <Footer />

      <ProductoModal
        producto={detalle}
        onCerrar={() => setDetalle(null)}
        onAgregar={agregar}
      />

      <CartDrawer
        abierto={carritoAbierto}
        carrito={carrito}
        onCerrar={() => setCarritoAbierto(false)}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={quitar}
        onVaciar={vaciar}
      />

      <WhatsAppFab />
    </>
  )
}
