// =============================================================
//  IMÁGENES A MEDIDA (transformación de Supabase Storage)
//
//  Las fotos del bucket se guardan grandes y en su formato original
//  (muchas son PNG de 500 KB a 2 MB). Supabase puede entregarlas
//  redimensionadas y en WebP con solo cambiar la URL, así que el
//  navegador descarga exactamente el tamaño que va a mostrar.
//
//  Misma foto de ejemplo: 556 KB en PNG original -> 24 KB en WebP
//  de 400 px. El archivo del bucket NO se toca.
//
//  Las URLs que no son de Supabase (dataURL del modo local, fotos de
//  Unsplash de la semilla) se devuelven tal cual.
// =============================================================

const RUTA_ORIGINAL = '/storage/v1/object/public/'
const RUTA_TRANSFORMADA = '/storage/v1/render/image/public/'

const CALIDAD = 75

function esDeSupabase(url) {
  return typeof url === 'string' && url.includes(RUTA_ORIGINAL)
}

// URL de la foto a un ancho concreto (en píxeles).
//
// OJO con "resize=contain": sin él, pedir solo "width" deja el alto
// original y la foto sale APLASTADA (una de 1000x1250 pedida a 400
// vuelve como 400x1250). Con contain vuelve como 400x500, que es lo
// correcto. No quitarlo.
export function imagenOptimizada(url, ancho, calidad = CALIDAD) {
  if (!esDeSupabase(url)) return url
  const base = url.replace(RUTA_ORIGINAL, RUTA_TRANSFORMADA)
  return `${base}?width=${ancho}&resize=contain&quality=${calidad}`
}

// Lista de tamaños para que el navegador elija según la pantalla.
// Devuelve undefined si la foto no se puede transformar: así el <img>
// se queda solo con su "src" y no pasa nada raro.
export function imagenSrcSet(url, anchos, calidad = CALIDAD) {
  if (!esDeSupabase(url)) return undefined
  return anchos.map((a) => `${imagenOptimizada(url, a, calidad)} ${a}w`).join(', ')
}
