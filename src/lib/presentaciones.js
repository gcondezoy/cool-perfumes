// =============================================================
//  PERFUMES Y DECANTS
//  La tienda separa dos secciones para que no haya confusión:
//   - "Perfumes": el frasco completo.
//   - "Decants": porciones de 5 ml y 10 ml del mismo perfume.
//  Un producto se carga una sola vez; si tiene precio de decant,
//  aparece además en la sección de decants.
// =============================================================

// Tamaños de decant que maneja la tienda.
export const TAMANOS_DECANT = [5, 10]

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
  const porTamano = { 5: producto.decant5ml, 10: producto.decant10ml }

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
