// =============================================================
//  CAPA DE DATOS
//  Si Supabase está configurado (.env.local) usa la base de datos real.
//  Si no, funciona en "modo local" guardando en el navegador.
//  La API es la misma en ambos casos, así que la app no cambia.
// =============================================================

import { supabase, supabaseConfigurado, BUCKET_IMAGENES } from '../lib/supabase.js'
import { comprimirImagen, comprimirADataURL } from '../lib/imagenes.js'
import { esSoloDecant, sinPrecio } from '../lib/presentaciones.js'
import {
  CAMPO_COLECCION, COLUMNA_ORDEN, ordenarPor, aplicarOrden, posicionesDe,
} from '../lib/orden.js'
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
    // Stock: null = sin control de stock; 0 = agotado
    stock: fila.stock != null ? Number(fila.stock) : null,
    // Decants: null/vacío = ese perfume no se vende en esa medida
    decant3ml: fila.decant_3ml != null ? Number(fila.decant_3ml) : undefined,
    decant5ml: fila.decant_5ml != null ? Number(fila.decant_5ml) : undefined,
    decant10ml: fila.decant_10ml != null ? Number(fila.decant_10ml) : undefined,
    // true = no se vende en frasco, solo aparece en la sección de decants
    soloDecant: !!fila.solo_decant,
    imagen: fila.imagen || '',
    concentracion: fila.concentracion || '',
    // Orden manual de cada sección (ver lib/orden.js).
    // null = todavía sin ordenar (va primero).
    orden: fila.orden != null ? Number(fila.orden) : null,
    ordenDecant: fila.orden_decant != null ? Number(fila.orden_decant) : null,
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
    // Vacío = sin control de stock (se guarda como null, no como 0)
    stock: p.stock === '' || p.stock === null || p.stock === undefined ? null : Number(p.stock),
    decant_3ml: p.decant3ml ? Number(p.decant3ml) : null,
    decant_5ml: p.decant5ml ? Number(p.decant5ml) : null,
    decant_10ml: p.decant10ml ? Number(p.decant10ml) : null,
    solo_decant: !!p.soloDecant,
    imagen: p.imagen || null,
    concentracion: p.concentracion || null,
    // Nota: las columnas descripcion, notas_salida/corazon/fondo, duracion,
    // estela y ocasion ya no se editan desde el panel. NO se incluyen aquí a
    // propósito: así una edición no borra los datos que ya existan en la BD.
    //
    // "orden" y "orden_decant" tampoco se incluyen a propósito: los escribe
    // solo guardarOrden(). Si fueran por aquí, editar el precio de un
    // perfume lo movería de sitio.
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
  return modoLocal ? ordenarPor(leerLocal(), CAMPO_COLECCION) : []
}

// =============================================================
//  API pública (async en ambos modos)
// =============================================================

export async function listarProductos() {
  // Igual que en Supabase: manda el orden de La colección.
  if (modoLocal) return ordenarPor(leerLocal(), CAMPO_COLECCION)

  // Manda el orden manual. Los que todavía no tienen número (productos
  // recién creados) van primero, y entre ellos el más nuevo arriba.
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('orden', { ascending: true, nullsFirst: true })
    .order('creado_en', { ascending: false })

  if (!error) return (data || []).map(desdeDB)

  // Si la columna "orden" todavía no existe (falta ejecutar
  // supabase/orden.sql), la tienda NO puede quedarse vacía: se reintenta
  // ordenando por fecha, que es como funcionaba antes. El panel sí avisa
  // de que falta el SQL cuando intentas reordenar.
  if (!faltaColumnaOrden(error)) {
    throw new Error(mensajeError('No se pudo cargar el catálogo', error))
  }

  const respaldo = await supabase
    .from('productos')
    .select('*')
    .order('creado_en', { ascending: false })

  if (respaldo.error) {
    throw new Error('No se pudo cargar el catálogo: ' + respaldo.error.message)
  }
  return (respaldo.data || []).map(desdeDB)
}

// Postgres devuelve 42703 ("undefined column") cuando falta la columna.
function faltaColumnaOrden(error) {
  return error?.code === '42703' || /\borden\b/.test(error?.message || '')
}

export async function crearProducto(producto) {
  if (modoLocal) {
    // Al principio de la lista, igual que en Supabase: un producto recién
    // creado aparece primero hasta que se ordene a mano.
    const lista = leerLocal()
    return escribirLocal([{ ...producto, id: nuevoIdLocal(lista) }, ...lista])
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
  if (m.includes('stock')) {
    return 'Falta agregar el control de stock a la base de datos. Ejecuta supabase/stock.sql en Supabase (SQL Editor).'
  }
  if (m.includes('orden')) {
    return 'Falta agregar el orden del catálogo a la base de datos. Ejecuta supabase/orden.sql en Supabase (SQL Editor).'
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

// Guarda el orden de UNA sección de la tienda (ver lib/orden.js).
// Recibe los productos de esa sección YA ordenados como deben quedar y el
// campo de la sección: CAMPO_COLECCION o CAMPO_DECANTS.
//
// Solo se escriben en la base los que de verdad cambiaron de sitio: mover
// un perfume una posición son dos filas, no el catálogo entero. Y solo se
// toca el orden de esa sección: reordenar Decants no mueve La colección.
export async function guardarOrden(seccion, campo = CAMPO_COLECCION) {
  if (modoLocal) return escribirLocal(aplicarOrden(leerLocal(), seccion, campo))

  const columna = COLUMNA_ORDEN[campo]
  const posicion = posicionesDe(seccion)
  const cambiados = seccion.filter((p) => p[campo] !== posicion.get(p.id))
  if (cambiados.length === 0) return null

  const resultados = await Promise.all(
    cambiados.map((p) =>
      supabase.from('productos').update({ [columna]: posicion.get(p.id) }).eq('id', p.id),
    ),
  )

  const fallo = resultados.find((r) => r.error)
  if (fallo) throw new Error(mensajeError('No se pudo guardar el orden', fallo.error))

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
    return await comprimirADataURL(archivo)
  }

  // Se redimensiona y comprime aquí, en el navegador: la tienda carga
  // mucho más rápido y el cliente no tiene que preparar las fotos.
  const { blob, extension, tipo } = await comprimirImagen(archivo)
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(BUCKET_IMAGENES)
    .upload(nombreArchivo, blob, {
      cacheControl: '31536000',
      upsert: false,
      contentType: tipo,
    })

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

  // El nombre del canal tiene que ser único por suscripción: si se repite,
  // Supabase devuelve el canal anterior (que ya hizo subscribe) y agregarle
  // otro listener lanza un error que tumba la tienda entera. Pasa cuando el
  // componente se vuelve a montar antes de que el canal anterior termine de
  // cerrarse.
  const canal = supabase
    .channel(`productos-cambios-${crypto.randomUUID()}`)
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
  // Las cifras de precio son de FRASCO: los perfumes de solo decant no
  // tienen precio de frasco y, si entraran, bajarían el promedio y
  // aparecerían como "el más barato" con S/ 0.
  const frascos = lista.filter((p) => !esSoloDecant(p))
  const soloDecant = total - frascos.length
  const valor = frascos.reduce((s, p) => s + (Number(p.precio) || 0), 0)
  const promedio = frascos.length ? Math.round(valor / frascos.length) : 0
  const enOferta = frascos.filter((p) => p.precioAntes)
  // Open Box ya no se muestra en la tienda: el conteo queda como control
  // interno del panel para saber cuántos frascos son tester.
  const openBox = lista.filter((p) => p.openBox)

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
    valor: frascos.filter((p) => {
      const precio = Number(p.precio) || 0
      return precio >= r.min && precio <= r.max
    }).length,
  }))

  // Salud del catálogo: cosas que conviene completar
  const salud = [
    { clave: 'sinFoto', etiqueta: 'Sin foto', items: lista.filter((p) => !p.imagen) },
    { clave: 'sinPrecio', etiqueta: 'Sin precio', items: lista.filter(sinPrecio) },
    {
      clave: 'sinConcentracion',
      etiqueta: 'Sin concentración',
      items: lista.filter((p) => !p.concentracion),
    },
    { clave: 'sinNotas', etiqueta: 'Sin notas', items: lista.filter((p) => !p.notas) },
  ]

  const precios = frascos.map((p) => Number(p.precio) || 0)
  const masCaro = frascos.length ? frascos.find((p) => Number(p.precio) === Math.max(...precios)) : null
  const masBarato = frascos.length ? frascos.find((p) => Number(p.precio) === Math.min(...precios)) : null

  const recientes = [...lista].slice(0, 5)

  return {
    total, soloDecant, valor, promedio, enOferta: enOferta.length, openBox: openBox.length,
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
