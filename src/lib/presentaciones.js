// =============================================================
//  PERFUMES Y DECANTS
//  La tienda separa dos secciones para que no haya confusión:
//   - "La colección": el frasco completo.
//   - "Decants": porciones de 3, 5 y 10 ml del mismo perfume.
//  Un producto se carga una sola vez; si tiene precio de decant,
//  aparece además en la sección de decants.
//
//  SOLO DECANT: algunos perfumes no se venden en frasco. Esos llevan
//  "soloDecant" y aparecen únicamente en la sección de decants; su
//  precio de frasco y su stock no se usan para nada.
// =============================================================

// Tamaños de decant que maneja la tienda (en ml, de menor a mayor).
export const TAMANOS_DECANT = [3, 5, 10]

// ¿Este perfume se vende solo en decant (sin frasco completo)?
export function esSoloDecant(producto) {
  return !!producto?.soloDecant
}

// Presentación del frasco completo (sección "Perfumes").
export function presentacionFrasco(producto) {
  return {
    clave: 'frasco',
    etiqueta: 'Frasco completo',
    detalle: producto?.ml ? `${producto.ml} ml` : '',
    ml: producto?.ml,
    precio: Number(producto?.precio) || 0,
    precioAntes: producto?.precioAntes,
  }
}

// Decants disponibles de un perfume (solo los que tienen precio).
export function decantsDe(producto) {
  if (!producto) return []
  const porTamano = {
    3: producto.decant3ml,
    5: producto.decant5ml,
    10: producto.decant10ml,
  }

  return TAMANOS_DECANT.filter((ml) => porTamano[ml]).map((ml) => ({
    clave: `${ml}ml`,
    etiqueta: 'Decant',
    detalle: `${ml} ml`,
    ml,
    precio: Number(porTamano[ml]),
  }))
}

export function tieneDecants(producto) {
  return decantsDe(producto).length > 0
}

// Precio más bajo entre los decants (para el "desde S/ X").
export function precioDesdeDecant(producto) {
  const precios = decantsDe(producto).map((d) => d.precio)
  return precios.length ? Math.min(...precios) : null
}

// ¿Le falta precio para poder venderse? Un perfume de solo decant no
// necesita precio de frasco, pero sí al menos un precio de decant.
export function sinPrecio(producto) {
  return esSoloDecant(producto) ? !tieneDecants(producto) : !Number(producto?.precio)
}

// Tamaños que de verdad se ofrecen entre todos los perfumes, para que
// los textos de la tienda nunca prometan una medida que no hay.
export function tamanosOfrecidos(productos) {
  const usados = new Set()
  productos.forEach((p) => decantsDe(p).forEach((d) => usados.add(d.ml)))
  return TAMANOS_DECANT.filter((ml) => usados.has(ml))
}

// Texto que acompaña al producto en el carrito y en el pedido.
export function etiquetaPresentacion(presentacion) {
  if (!presentacion) return ''
  return presentacion.clave === 'frasco'
    ? presentacion.detalle
    : `Decant ${presentacion.detalle}`
}

// Identificador de línea del carrito: permite tener el mismo perfume
// en frasco y en decant como líneas distintas.
export function idLinea(producto, clavePresentacion) {
  return `${producto.id}::${clavePresentacion || 'frasco'}`
}

// Construye el objeto que se guarda en el carrito.
export function itemDeCarrito(producto, presentacion) {
  const p = presentacion || presentacionFrasco(producto)
  return {
    ...producto,
    // El precio y los ml pasan a ser los de la presentación elegida,
    // así el carrito y el mensaje de WhatsApp funcionan sin cambios.
    precio: p.precio,
    precioAntes: p.clave === 'frasco' ? producto.precioAntes : undefined,
    ml: p.ml,
    presentacion: p.clave,
    textoPresentacion: etiquetaPresentacion(p),
    lineaId: idLinea(producto, p.clave),
  }
}
