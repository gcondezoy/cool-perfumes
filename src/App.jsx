import { useState, useMemo, useCallback, useEffect } from 'react'
import { listarProductos, getProductosCache, suscribir } from './admin/adminStore.js'
import { itemDeCarrito, esSoloDecant } from './lib/presentaciones.js'
import { estaAgotado, unidadesDisponibles } from './lib/stock.js'
import { categorias } from './config.js'

const CLAVE_CARRITO = 'coolperfumes_carrito_v1'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Catalogo from './components/Catalogo.jsx'
import SeccionDecants from './components/SeccionDecants.jsx'
import ComoComprar from './components/ComoComprar.jsx'
import ProductoModal from './components/ProductoModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import DatosEstructurados from './components/DatosEstructurados.jsx'

export default function App() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  // El carrito se guarda en el navegador para que no se pierda al recargar.
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_CARRITO)
      const lista = guardado ? JSON.parse(guardado) : []
      if (!Array.isArray(lista)) return []
      // Compatibilidad con carritos guardados antes de existir los decants.
      return lista.map((p) => ({
        ...p,
        presentacion: p.presentacion || 'frasco',
        lineaId: p.lineaId || `${p.id}::frasco`,
      }))
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
  // Un mismo perfume puede estar en el carrito en frasco y en decant:
  // por eso cada línea se identifica con "lineaId", no solo con el id.
  const agregar = useCallback((producto, presentacion) => {
    // Seguridad: un producto agotado nunca entra al carrito.
    if (estaAgotado(producto)) return
    const item = itemDeCarrito(producto, presentacion)
    // Un perfume de solo decant nunca entra al carrito como frasco.
    if (esSoloDecant(producto) && item.presentacion === 'frasco') return
    // El stock limita solo el frasco completo (los decants se preparan).
    const tope = item.presentacion === 'frasco' ? unidadesDisponibles(producto) : Infinity

    setCarrito((prev) => {
      const existe = prev.find((p) => p.lineaId === item.lineaId)
      if (existe) {
        if (existe.cantidad >= tope) return prev   // ya llegó al máximo
        return prev.map((p) =>
          p.lineaId === item.lineaId ? { ...p, cantidad: p.cantidad + 1 } : p,
        )
      }
      if (tope < 1) return prev
      return [...prev, { ...item, cantidad: 1, stock: producto.stock }]
    })
    setCarritoAbierto(true)
  }, [])

  const cambiarCantidad = useCallback((lineaId, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) => {
          if (p.lineaId !== lineaId) return p
          const tope =
            p.presentacion === 'frasco' ? unidadesDisponibles(p) : Infinity
          const nueva = Math.min(p.cantidad + delta, tope)
          return { ...p, cantidad: nueva }
        })
        .filter((p) => p.cantidad > 0),
    )
  }, [])

  const quitar = useCallback((lineaId) => {
    setCarrito((prev) => prev.filter((p) => p.lineaId !== lineaId))
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
  // "La colección" es de frascos: los perfumes que se venden solo en
  // decant quedan fuera y aparecen únicamente en la sección de decants.
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const texto = (v) => (v || '').toString().toLowerCase()
    return productos.filter((p) => {
      if (esSoloDecant(p)) return false
      const coincideGenero = filtro === 'todos' || p.genero === filtro
      const coincideBusqueda =
        !q ||
        texto(p.nombre).includes(q) ||
        texto(p.marca).includes(q) ||
        texto(p.familia).includes(q) ||
        texto(p.notas).includes(q)
      return coincideGenero && coincideBusqueda
    })
  }, [filtro, busqueda, productos])

  // Los agotados NO se mezclan con el catálogo: van a un bloque aparte que
  // el visitante abre si quiere. Así la tienda se ve por lo que sí se vende.
  const disponibles = useMemo(
    () => productosFiltrados.filter((p) => !estaAgotado(p)),
    [productosFiltrados],
  )
  const agotados = useMemo(
    () => productosFiltrados.filter((p) => estaAgotado(p)),
    [productosFiltrados],
  )

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
          productos={disponibles}
          agotados={agotados}
          categorias={categorias}
          filtro={filtro}
          onFiltro={setFiltro}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          onAgregar={agregar}
          onAbrirDetalle={setDetalle}
          cargando={cargando}
        />
        <SeccionDecants productos={productos} onAgregar={agregar} />
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

      {/* Le dice a Google qué vendes, a qué precio y si hay stock */}
      <DatosEstructurados productos={productos} />
    </>
  )
}
