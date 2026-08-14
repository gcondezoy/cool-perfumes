// =============================================================
//  COMPRESIÓN DE IMÁGENES (en el navegador, antes de subir)
//
//  Las fotos salen del celular con 3000 px de ancho y varios MB, pero
//  en la tienda se ven a ~350 px. Subirlas tal cual hace que el cliente
//  espere y gaste datos sin ninguna ganancia visual.
//
//  Aquí se redimensionan y se convierten a WebP antes de mandarlas a
//  Supabase. Si algo falla, se sube el archivo original: nunca se
//  bloquea al usuario del panel por esto.
// =============================================================

// Lado mayor de la foto final. 1200 px alcanza de sobra para la ficha
// ampliada y para pantallas de alta densidad.
const LADO_MAXIMO = 1200
const CALIDAD = 0.82

// Por debajo de esto no vale la pena recomprimir.
const PESO_MINIMO = 250 * 1024 // 250 KB

function cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

function aBlob(canvas, tipo, calidad) {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, calidad))
}

/**
 * Devuelve { blob, extension, tipo } listos para subir.
 * Si no hace falta (o no se puede) comprimir, devuelve el archivo original.
 */
export async function comprimirImagen(archivo) {
  const extensionOriginal = (archivo.name.split('.').pop() || 'jpg').toLowerCase()
  const original = { blob: archivo, extension: extensionOriginal, tipo: archivo.type }

  // Los GIF pierden la animación al pasar por el canvas: se dejan tal cual.
  if (archivo.type === 'image/gif') return original

  try {
    const img = await cargarImagen(archivo)
    const lado = Math.max(img.naturalWidth, img.naturalHeight)

    // Ya es chica y liviana: no se toca.
    if (lado <= LADO_MAXIMO && archivo.size <= PESO_MINIMO) return original

    const escala = Math.min(1, LADO_MAXIMO / lado)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * escala)
    canvas.height = Math.round(img.naturalHeight * escala)

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // WebP pesa bastante menos y conserva la transparencia.
    let blob = await aBlob(canvas, 'image/webp', CALIDAD)
    let extension = 'webp'
    let tipo = 'image/webp'

    // Navegador sin soporte de WebP: se cae a JPEG.
    if (!blob || blob.type !== 'image/webp') {
      blob = await aBlob(canvas, 'image/jpeg', CALIDAD)
      extension = 'jpg'
      tipo = 'image/jpeg'
    }

    if (!blob) return original
    // Si la "compresión" terminó pesando más, se queda la original.
    if (blob.size >= archivo.size) return original

    return { blob, extension, tipo }
  } catch (e) {
    console.warn('No se pudo comprimir la imagen, se sube la original:', e)
    return original
  }
}

// Igual que arriba, pero devolviendo un dataURL (lo usa el modo local,
// donde la foto se guarda dentro del navegador y el espacio es escaso).
export async function comprimirADataURL(archivo) {
  const { blob } = await comprimirImagen(archivo)
  return await new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(lector.result)
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    lector.readAsDataURL(blob)
  })
}
