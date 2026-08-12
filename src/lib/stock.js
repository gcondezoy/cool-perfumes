// =============================================================
//  CONTROL DE STOCK
//  El stock se aplica al FRASCO COMPLETO. Los decants son porciones
//  que se preparan del frasco, así que no descuentan unidades: se
//  rigen por el interruptor "Agotado" del producto.
//
//  Valores del campo "stock":
//    null / vacío -> sin control (se puede pedir sin límite)
//    0            -> agotado
//    1 o más      -> unidades disponibles
// =============================================================

// A partir de esta cantidad se avisa "últimas unidades".
export const UMBRAL_STOCK_BAJO = 3

export function tieneControlDeStock(producto) {
  return producto?.stock !== null && producto?.stock !== undefined
}

// Unidades disponibles. Infinity si el producto no lleva control.
export function unidadesDisponibles(producto) {
  return tieneControlDeStock(producto) ? Number(producto.stock) || 0 : Infinity
}

// Un producto está agotado si lo marcaron a mano o si se quedó sin stock.
export function estaAgotado(producto) {
  if (!producto) return false
  if (producto.agotado) return true
  return tieneControlDeStock(producto) && Number(producto.stock) <= 0
}

// "Quedan pocas": para mostrar el aviso de urgencia.
export function stockBajo(producto) {
  if (estaAgotado(producto)) return false
  const n = unidadesDisponibles(producto)
  return n !== Infinity && n > 0 && n <= UMBRAL_STOCK_BAJO
}

// Cuántas unidades más se pueden agregar, sabiendo las que ya hay en
// el carrito. El límite solo aplica al frasco completo.
export function puedeAgregarMas(producto, presentacion, cantidadEnCarrito = 0) {
  if (estaAgotado(producto)) return false
  const esFrasco = !presentacion || presentacion === 'frasco'
  if (!esFrasco) return true
  return cantidadEnCarrito < unidadesDisponibles(producto)
}
