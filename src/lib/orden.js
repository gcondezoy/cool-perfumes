// =============================================================
//  ORDEN MANUAL DEL CATÁLOGO
//  Cada sección de la tienda tiene su propio orden, independiente:
//
//    'orden'        -> La colección (frascos completos)
//    'ordenDecant'  -> sección Decants
//
//  Un perfume que se vende en frasco Y en decant aparece en las dos
//  secciones, y puede ir primero en una y último en la otra.
//
//  null = todavía sin ordenar: va PRIMERO. Así un producto recién
//  creado se ve arriba de todo hasta que se lo acomode a mano.
// =============================================================

export const CAMPO_COLECCION = 'orden'
export const CAMPO_DECANTS = 'ordenDecant'

// Columna de Supabase que guarda cada orden.
export const COLUMNA_ORDEN = {
  [CAMPO_COLECCION]: 'orden',
  [CAMPO_DECANTS]: 'orden_decant',
}

// Ordena por el campo indicado. Los que no tienen número van primero y,
// en los empates, se respeta el orden en que venía la lista.
export function ordenarPor(lista, campo) {
  return lista
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const x = a.p[campo]
      const y = b.p[campo]
      const xVacio = x === null || x === undefined
      const yVacio = y === null || y === undefined
      if (xVacio !== yVacio) return xVacio ? -1 : 1
      if (!xVacio && x !== y) return x - y
      return a.i - b.i
    })
    .map(({ p }) => p)
}

// Posición que le toca a cada producto de una sección ya ordenada.
// Se numera de 10 en 10 (10, 20, 30…) para dejar hueco entre productos.
export function posicionesDe(seccion) {
  return new Map(seccion.map((p, i) => [p.id, (i + 1) * 10]))
}

// Aplica una sección recién reordenada sobre el catálogo COMPLETO: solo
// cambia el campo de esa sección en sus productos; el resto queda igual.
export function aplicarOrden(todos, seccion, campo) {
  const posicion = posicionesDe(seccion)
  const actualizados = todos.map((p) =>
    posicion.has(p.id) ? { ...p, [campo]: posicion.get(p.id) } : p,
  )
  // La lista general del catálogo va en el orden de La colección.
  return ordenarPor(actualizados, CAMPO_COLECCION)
}
