// =============================================================
//  PRESENTACIONES DE UN PERFUME
//  Un mismo perfume puede venderse en frasco completo y, si el
//  administrador le puso precio, también en decant de 10 ml y/o 5 ml.
// =============================================================

// Devuelve las presentaciones disponibles de un producto.
// Siempre incluye el frasco; los decants solo si tienen precio.
export function presentacionesDe(producto) {
  if (!producto) return []

  const lista = [
    {
      clave: 'frasco',
      etiqueta: 'Frasco completo',
      detalle: producto.ml ? `${producto.ml} ml` : '',
      ml: producto.ml,
      precio: Number(producto.precio) || 0,
      precioAntes: producto.precioAntes,
    },
  ]

  if (producto.decant10ml) {
    lista.push({
      clave: '10ml',
      etiqueta: 'Decant',
      detalle: '10 ml',
      ml: 10,
      precio: Number(producto.decant10ml),
    })
  }

  if (producto.decant5ml) {
    lista.push({
      clave: '5ml',
      etiqueta: 'Decant',
      detalle: '5 ml',
      ml: 5,
      precio: Number(producto.decant5ml),
    })
  }

  return lista
}

export function tieneDecants(producto) {
  return Boolean(producto?.decant5ml || producto?.decant10ml)
}

// Precio más bajo entre los decants (para el aviso "desde S/ X").
export function precioDesdeDecant(producto) {
  const precios = [producto?.decant5ml, producto?.decant10ml]
    .filter(Boolean)
    .map(Number)
  return precios.length ? Math.min(...precios) : null
}

// Texto que acompaña al producto en el carrito y en el pedido de WhatsApp.
export function etiquetaPresentacion(presentacion) {
  if (!presentacion || presentacion.clave === 'frasco') {
    return presentacion?.detalle || ''
  }
  return `Decant ${presentacion.detalle}`
}

// Identificador de línea del carrito: permite tener el mismo perfume
// en frasco y en decant como dos líneas distintas.
export function idLinea(producto, clavePresentacion) {
  return `${producto.id}::${clavePresentacion || 'frasco'}`
}

// Construye el objeto que se guarda en el carrito.
export function itemDeCarrito(producto, presentacion) {
  const p = presentacion || presentacionesDe(producto)[0]
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
