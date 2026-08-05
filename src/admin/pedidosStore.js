// =============================================================
//  PEDIDOS
//  Cada vez que un cliente presiona "Pedir por WhatsApp" se guarda el
//  pedido con un código para poder ubicarlo después en la conversación.
//  Sin Supabase configurado se guarda en el navegador.
// =============================================================

import { supabase } from '../lib/supabase.js'
import { modoLocal } from './adminStore.js'

const CLAVE = 'coolperfumes_pedidos_v1'
export const EVENTO_PEDIDOS = 'coolperfumes:pedidos'

export const ESTADOS = {
  pendiente: { etiqueta: 'Pendiente', color: '#a16207' },
  pagado: { etiqueta: 'Pagado', color: '#1a7f43' },
  cancelado: { etiqueta: 'Cancelado', color: '#a13c2a' },
}

// Código corto y legible para identificar el pedido en WhatsApp.
export function generarCodigo() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin caracteres confusos
  let codigo = ''
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  bytes.forEach((b) => { codigo += letras[b % letras.length] })
  return `CP-${codigo}`
}

function leerLocal() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    const lista = crudo ? JSON.parse(crudo) : []
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

function escribirLocal(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
  window.dispatchEvent(new CustomEvent(EVENTO_PEDIDOS))
  return lista
}

function desdeDB(fila) {
  return {
    id: fila.id,
    codigo: fila.codigo,
    items: Array.isArray(fila.items) ? fila.items : [],
    total: Number(fila.total) || 0,
    cantidad: fila.cantidad || 0,
    estado: fila.estado || 'pendiente',
    nota: fila.nota || '',
    creadoEn: fila.creado_en,
  }
}

// --- Se llama desde la tienda al enviar el pedido por WhatsApp ---
export async function registrarPedido({ codigo, carrito, total }) {
  const items = carrito.map((p) => ({
    id: p.id,
    marca: p.marca,
    nombre: p.nombre,
    ml: p.ml,
    precio: p.precio,
    cantidad: p.cantidad,
    // Frasco completo o decant (para que se vea en el panel de pedidos)
    presentacion: p.textoPresentacion || `${p.ml} ml`,
  }))
  const cantidad = carrito.reduce((s, p) => s + p.cantidad, 0)

  if (modoLocal) {
    const lista = leerLocal()
    return escribirLocal([
      { id: Date.now(), codigo, items, total, cantidad, estado: 'pendiente', nota: '', creadoEn: new Date().toISOString() },
      ...lista,
    ])
  }

  const { error } = await supabase
    .from('pedidos')
    .insert({ codigo, items, total, cantidad, estado: 'pendiente' })
  if (error) throw new Error('No se pudo registrar el pedido: ' + error.message)
}

export async function listarPedidos() {
  if (modoLocal) return leerLocal()

  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('creado_en', { ascending: false })

  if (error) throw new Error('No se pudieron cargar los pedidos: ' + error.message)
  return (data || []).map(desdeDB)
}

export async function cambiarEstadoPedido(id, estado) {
  if (modoLocal) {
    return escribirLocal(leerLocal().map((p) => (p.id === id ? { ...p, estado } : p)))
  }
  const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id)
  if (error) throw new Error('No se pudo actualizar el pedido: ' + error.message)
  return listarPedidos()
}

export async function eliminarPedido(id) {
  if (modoLocal) {
    return escribirLocal(leerLocal().filter((p) => p.id !== id))
  }
  const { error } = await supabase.from('pedidos').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar el pedido: ' + error.message)
  return listarPedidos()
}

export function suscribirPedidos(callback) {
  if (modoLocal) {
    const fn = () => callback()
    window.addEventListener(EVENTO_PEDIDOS, fn)
    return () => window.removeEventListener(EVENTO_PEDIDOS, fn)
  }
  const canal = supabase
    .channel('pedidos-cambios')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => callback())
    .subscribe()
  return () => supabase.removeChannel(canal)
}

// =============================================================
//  Métricas de ventas
// =============================================================
const DIA_MS = 24 * 60 * 60 * 1000

export function calcularMetricasPedidos(pedidos, hoyMs) {
  const ahora = hoyMs ?? Date.now()
  const inicioHoy = new Date(ahora)
  inicioHoy.setHours(0, 0, 0, 0)

  const fecha = (p) => new Date(p.creadoEn).getTime()
  const pagados = pedidos.filter((p) => p.estado === 'pagado')
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente')
  const cancelados = pedidos.filter((p) => p.estado === 'cancelado')

  const enUltimosDias = (lista, dias) =>
    lista.filter((p) => fecha(p) >= inicioHoy.getTime() - (dias - 1) * DIA_MS)

  const suma = (lista) => lista.reduce((s, p) => s + (Number(p.total) || 0), 0)

  const vendidoTotal = suma(pagados)
  const porCobrar = suma(pendientes)
  const ticketPromedio = pagados.length ? Math.round(vendidoTotal / pagados.length) : 0

  // Pedidos por día (últimos 7 días), del más antiguo al más reciente
  const porDia = []
  for (let i = 6; i >= 0; i--) {
    const inicio = inicioHoy.getTime() - i * DIA_MS
    const fin = inicio + DIA_MS
    const delDia = pedidos.filter((p) => fecha(p) >= inicio && fecha(p) < fin)
    const d = new Date(inicio)
    porDia.push({
      clave: String(inicio),
      etiqueta: d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }),
      valor: delDia.length,
    })
  }

  const porEstado = [
    { clave: 'pendiente', etiqueta: 'Pendiente', valor: pendientes.length },
    { clave: 'pagado', etiqueta: 'Pagado', valor: pagados.length },
    { clave: 'cancelado', etiqueta: 'Cancelado', valor: cancelados.length },
  ]

  // Productos más pedidos (sin contar pedidos cancelados)
  const conteo = {}
  pedidos
    .filter((p) => p.estado !== 'cancelado')
    .forEach((p) => {
      p.items.forEach((it) => {
        const nombre = `${it.marca} ${it.nombre}`
        conteo[nombre] = (conteo[nombre] || 0) + (it.cantidad || 0)
      })
    })
  const masPedidos = Object.entries(conteo)
    .map(([etiqueta, valor]) => ({ etiqueta, valor, clave: etiqueta }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)

  return {
    total: pedidos.length,
    pendientes: pendientes.length,
    pagados: pagados.length,
    cancelados: cancelados.length,
    vendidoTotal,
    porCobrar,
    ticketPromedio,
    pedidosHoy: enUltimosDias(pedidos, 1).length,
    pedidos7dias: enUltimosDias(pedidos, 7).length,
    vendido30dias: suma(enUltimosDias(pagados, 30)),
    porDia,
    porEstado,
    masPedidos,
  }
}

export function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}
