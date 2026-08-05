// =============================================================
//  CAPA DE DATOS
//  Si Supabase está configurado (.env.local) usa la base de datos real.
//  Si no, funciona en "modo local" guardando en el navegador.
//  La API es la misma en ambos casos, así que la app no cambia.
// =============================================================

import { supabase, supabaseConfigurado, BUCKET_IMAGENES } from '../lib/supabase.js'
import { productos as semilla } from '../data/productos.js'

const CLAVE = 'coolperfumes_productos_v1'
export const EVENTO = 'coolperfumes:productos'
export const modoLocal = !supabaseConfigurado

// --- Conversión entre la base de datos (snake_case) y la app (camelCase) ---
function desdeDB(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    marca: fila.marca,
    genero: fila.genero,
    familia: fila.familia || '',
    notas: fila.notas || '',
    ml: fila.ml,
    precio: Number(fila.precio),
    precioAntes: fila.precio_antes != null ? Number(fila.precio_antes) : undefined,
    destacado: !!fila.destacado,
    openBox: !!fila.open_box,
    agotado: !!fila.agotado,
    // Decants: null/vacío = ese perfume no se vende en esa medida
    decant5ml: fila.decant_5ml != null ? Number(fila.decant_5ml) : undefined,
    decant10ml: fila.decant_10ml != null ? Number(fila.decant_10ml) : undefined,
    imagen: fila.imagen || '',
    concentracion: fila.concentracion || '',
  }
}

function haciaDB(p) {
  return {
    nombre: p.nombre,
    marca: p.marca,
    genero: p.genero,
    familia: p.familia || null,
    notas: p.notas || null,
    ml: Number(p.ml) || 0,
    precio: Number(p.precio) || 0,
    precio_antes: p.precioAntes ? Number(p.precioAntes) : null,
    destacado: !!p.destacado,
    open_box: !!p.openBox,
    agotado: !!p.agotado,
    decant_5ml: p.decant5ml ? Number(p.decant5ml) : null,
    decant_10ml: p.decant10ml ? Number(p.decant10ml) : null,
    imagen: p.imagen || null,
    concentracion: p.concentracion || null,
    // Nota: las columnas descripcion, notas_salida/corazon/fondo, duracion,
    // estela y ocasion ya no se editan desde el panel. NO se incluyen aquí a
    // propósito: así una edición no borra los datos que ya existan en la BD.
  }
}

// --- Helpers del modo local ---
function leerLocal() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (crudo) {
      const lista = JSON.parse(crudo)
      if (Array.isArray(lista)) return lista
    }
  } catch (e) {
    console.warn('No se pudo leer el catálogo guardado:', e)
  }
  return semilla
}

function escribirLocal(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
  window.dispatchEvent(new CustomEvent(EVENTO))
  return lista
}

function nuevoIdLocal(lista) {
  return lista.length ? Math.max(...lista.map((p) => Number(p.id) || 0)) + 1 : 1
}

// Lectura sincrónica inmediata (para el primer render sin parpadeo).
export function getProductosCache() {
  return modoLocal ? leerLocal() : []
}

// =============================================================
//  API pública (async en ambos modos)
// =============================================================

export async function listarProductos() {
  if (modoLocal) return leerLocal()

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('creado_en', { ascending: false })

  if (error) throw new Error('No se pudo cargar el catálogo: ' + error.message)
  return (data || []).map(desdeDB)
}

export async function crearProducto(producto) {
  if (modoLocal) {
    const lista = leerLocal()
    return escribirLocal([...lista, { ...producto, id: nuevoIdLocal(lista) }])
  }

  const { error } = await supabase.from('productos').insert(haciaDB(producto))
  if (error) throw new Error(mensajeError('No se pudo crear el producto', error))
  return listarProductos()
}

// Traduce errores comunes a algo accionable.
function mensajeError(prefijo, error) {
  const m = error.message || ''
  if (m.includes('decant')) {
    return 'Falta agregar los decants a la base de datos. Ejecuta supabase/decants.sql en Supabase (SQL Editor).'
  }
  if (m.includes('open_box') || m.includes('agotado')) {
    return 'Falta crear columnas nuevas en la base de datos. Ejecuta supabase/columnas-extra.sql en Supabase (SQL Editor).'
  }
  return `${prefijo}: ${error.message}`
}

export async function actualizarProducto(id, producto) {
  if (modoLocal) {
    const lista = leerLocal().map((p) => (p.id === id ? { ...producto, id } : p))
    return escribirLocal(lista)
  }

  const { error } = await supabase.from('productos').update(haciaDB(producto)).eq('id', id)
  if (error) throw new Error(mensajeError('No se pudo actualizar', error))
  return listarProductos()
}

export async function eliminarProducto(id) {
  if (modoLocal) {
    return escribirLocal(leerLocal().filter((p) => p.id !== id))
  }

  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar: ' + error.message)
  return listarProductos()
}

export async function restaurarSemilla() {
  if (!modoLocal) throw new Error('Restaurar solo está disponible en modo local.')
  localStorage.removeItem(CLAVE)
  window.dispatchEvent(new CustomEvent(EVENTO))
  return semilla
}

// --- Subida de imágenes ---
export async function subirImagen(archivo) {
  if (!archivo) throw new Error('No se seleccionó ninguna imagen.')

  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen (JPG, PNG o WebP).')
  }
  const MAX = 5 * 1024 * 1024 // 5 MB
  if (archivo.size > MAX) {
    throw new Error('La imagen pesa más de 5 MB. Usa una más liviana.')
  }

  if (modoLocal) {
    // Sin backend: se guarda incrustada en el navegador (solo para probar).
    return await new Promise((resolve, reject) => {
      const lector = new FileReader()
      lector.onload = () => resolve(lector.result)
      lector.onerror = () => reject(new Error('No se pudo leer la imagen.'))
      lector.readAsDataURL(archivo)
    })
  }

  const extension = (archivo.name.split('.').pop() || 'jpg').toLowerCase()
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(BUCKET_IMAGENES)
    .upload(nombreArchivo, archivo, { cacheControl: '3600', upsert: false })

  if (error) throw new Error('No se pudo subir la imagen: ' + error.message)

  const { data } = supabase.storage.from(BUCKET_IMAGENES).getPublicUrl(nombreArchivo)
  return data.publicUrl
}

// --- Suscripción a cambios (modo local: eventos; Supabase: realtime) ---
export function suscribir(callback) {
  if (modoLocal) {
    const enEsta = () => callback()
    const enOtra = (e) => {
      if (e.key === CLAVE) callback()
    }
    window.addEventListener(EVENTO, enEsta)
    window.addEventListener('storage', enOtra)
    return () => {
      window.removeEventListener(EVENTO, enEsta)
      window.removeEventListener('storage', enOtra)
    }
  }

  const canal = supabase
    .channel('productos-cambios')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => callback())
    .subscribe()

  return () => supabase.removeChannel(canal)
}

export function exportarJSON(lista) {
  const contenido = JSON.stringify(lista, null, 2)
  const blob = new Blob([contenido], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'productos-cool-perfumes.json'
  a.click()
  URL.revokeObjectURL(url)
}

// --- Métricas para el dashboard ---
export const RANGOS_PRECIO = [
  { clave: 'bajo', etiqueta: 'Menos de S/ 300', min: 0, max: 299 },
  { clave: 'medio', etiqueta: 'S/ 300 a S/ 500', min: 300, max: 500 },
  { clave: 'alto', etiqueta: 'S/ 501 a S/ 800', min: 501, max: 800 },
  { clave: 'premium', etiqueta: 'Más de S/ 800', min: 801, max: Infinity },
]

export function calcularMetricas(lista) {
  const total = lista.length
  const valor = lista.reduce((s, p) => s + (Number(p.precio) || 0), 0)
  const promedio = total ? Math.round(valor / total) : 0
  const enOferta = lista.filter((p) => p.precioAntes)
  const destacados = lista.filter((p) => p.destacado)

  // Descuento promedio de los productos en oferta
  const descuentoPromedio = enOferta.length
    ? Math.round(
        enOferta.reduce(
          (s, p) => s + ((p.precioAntes - p.precio) / p.precioAntes) * 100,
          0,
        ) / enOferta.length,
      )
    : 0

  const porGenero = ['mujer', 'hombre', 'unisex'].map((g) => ({
    clave: g,
    etiqueta: g.charAt(0).toUpperCase() + g.slice(1),
    valor: lista.filter((p) => p.genero === g).length,
  }))

  const conteoMarcas = {}
  lista.forEach((p) => {
    conteoMarcas[p.marca] = (conteoMarcas[p.marca] || 0) + 1
  })
  const porMarca = Object.entries(conteoMarcas)
    .map(([etiqueta, valor]) => ({ etiqueta, valor, clave: etiqueta }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6)
  const totalMarcas = Object.keys(conteoMarcas).length

  const porRangoPrecio = RANGOS_PRECIO.map((r) => ({
    clave: r.clave,
    etiqueta: r.etiqueta,
    valor: lista.filter((p) => {
      const precio = Number(p.precio) || 0
      return precio >= r.min && precio <= r.max
    }).length,
  }))

  // Salud del catálogo: cosas que conviene completar
  const salud = [
    { clave: 'sinFoto', etiqueta: 'Sin foto', items: lista.filter((p) => !p.imagen) },
    { clave: 'sinPrecio', etiqueta: 'Sin precio', items: lista.filter((p) => !Number(p.precio)) },
    {
      clave: 'sinConcentracion',
      etiqueta: 'Sin concentración',
      items: lista.filter((p) => !p.concentracion),
    },
    { clave: 'sinNotas', etiqueta: 'Sin notas', items: lista.filter((p) => !p.notas) },
  ]

  const precios = lista.map((p) => Number(p.precio) || 0)
  const masCaro = total ? lista.find((p) => Number(p.precio) === Math.max(...precios)) : null
  const masBarato = total ? lista.find((p) => Number(p.precio) === Math.min(...precios)) : null

  const recientes = [...lista].slice(0, 5)

  return {
    total, valor, promedio, enOferta: enOferta.length, destacados: destacados.length,
    descuentoPromedio, porGenero, porMarca, totalMarcas, porRangoPrecio, salud,
    masCaro, masBarato, recientes,
  }
}

// --- Autenticación (solo con Supabase) ---
export async function iniciarSesion(email, password) {
  if (modoLocal) throw new Error('Supabase no está configurado.')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Correo o contraseña incorrectos.')
}

export async function cerrarSesion() {
  if (!modoLocal) await supabase.auth.signOut()
}

export async function sesionActual() {
  if (modoLocal) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}
