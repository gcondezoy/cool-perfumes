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

  // Clave del panel admin (se entra en /#/admin).
  // OJO: esto es solo una puerta simple para uso interno. NO es seguridad
  // real: al ser una web sin backend, la clave viaja en el código. Para
  // protección de verdad hace falta un backend con autenticación (Supabase).
  adminPassword: 'cool2026',
}

// Categorías del filtro. El campo "genero" de cada producto debe
// coincidir con uno de estos "id".
export const categorias = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'mujer', nombre: 'Mujer' },
  { id: 'hombre', nombre: 'Hombre' },
  { id: 'unisex', nombre: 'Unisex' },
]
