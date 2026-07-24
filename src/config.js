// =============================================================
//  CONFIGURACIÓN DE LA MARCA
//  Edita aquí los datos del negocio. Es lo único que necesitas
//  tocar para personalizar la tienda (WhatsApp, redes, textos).
// =============================================================

export const marca = {
  nombre: 'Cool Perfumes',
  eslogan: 'Fragancias que se recuerdan',

  // Logo en /public (PNG con fondo transparente).
  logo: '/logo-cool-perfumes.png',

  // Número de WhatsApp en formato internacional SIN "+", espacios ni guiones.
  // Perú = 51. Aquí: 981 814 457 -> 51981814457
  whatsapp: '51981814457',

  // Texto con el que empieza cada pedido enviado por WhatsApp.
  saludoPedido: '¡Hola Cool Perfumes! 👋 Quisiera hacer este pedido:',

  // Redes y contacto (se muestran en el pie de página).
  redes: {
    instagram: 'https://www.instagram.com/coolperfumes.pe/',
    tiktok: 'https://www.tiktok.com/@coolperfumes.pe1',
  },
  contacto: {
    ciudad: 'Lima, Perú',
    instagramHandle: '@coolperfumes.pe',
    tiktokHandle: '@coolperfumes.pe',
    horario: 'Lun a Sáb · 10:00 a 20:00',
  },

  // Moneda usada en los precios.
  moneda: 'S/',

  // El acceso al panel (/admin) se gestiona con Supabase Auth.
  // Los usuarios se crean en: Supabase -> Authentication -> Users.
}

// Categorías del filtro. El campo "genero" de cada producto debe
// coincidir con uno de estos "id".
export const categorias = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'mujer', nombre: 'Mujer' },
  { id: 'hombre', nombre: 'Hombre' },
  { id: 'unisex', nombre: 'Unisex' },
]

// Concentraciones y su abreviatura (se muestra junto al tamaño: "EDP · 100 ml").
// El "valor" es lo que se guarda; el "nombre" es lo que se ve en el formulario.
export const concentraciones = [
  { valor: 'Eau de Parfum', nombre: 'Eau de Parfum (EDP)', abrev: 'EDP' },
  { valor: 'Eau de Toilette', nombre: 'Eau de Toilette (EDT)', abrev: 'EDT' },
  { valor: 'Parfum', nombre: 'Parfum / Extrait', abrev: 'Parfum' },
  { valor: 'Elixir', nombre: 'Elixir', abrev: 'Elixir' },
  { valor: 'Eau de Cologne', nombre: 'Eau de Cologne (EDC)', abrev: 'EDC' },
]

export function abreviarConcentracion(valor) {
  const c = concentraciones.find((x) => x.valor === valor)
  return c ? c.abrev : valor
}
