import { useEffect } from 'react'
import { marca as config } from '../config.js'
import { estaAgotado } from '../lib/stock.js'

// =============================================================
//  DATOS ESTRUCTURADOS DEL CATÁLOGO (schema.org)
//  El index.html ya declara la tienda (Store). Esto agrega los
//  productos con su precio y disponibilidad, que es lo que hace
//  que Google pueda mostrarlos en los resultados de búsqueda.
//
//  Se inyecta desde React porque el catálogo es dinámico (viene de
//  Supabase): el HTML estático no lo conoce al compilar.
// =============================================================

const ID_SCRIPT = 'ld-catalogo'

export default function DatosEstructurados({ productos }) {
  useEffect(() => {
    if (!productos || productos.length === 0) return

    const datos = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Catálogo de ${config.nombre}`,
      numberOfItems: productos.length,
      itemListElement: productos.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: `${p.marca} ${p.nombre}`.trim(),
          ...(p.marca && { brand: { '@type': 'Brand', name: p.marca } }),
          ...(p.imagen && { image: p.imagen }),
          ...(p.familia && { category: p.familia }),
          ...(p.ml && { size: `${p.ml} ml` }),
          offers: {
            '@type': 'Offer',
            price: Number(p.precio) || 0,
            priceCurrency: 'PEN',
            url: `${config.sitio}/#catalogo`,
            availability: estaAgotado(p)
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: config.nombre },
          },
        },
      })),
    }

    let script = document.getElementById(ID_SCRIPT)
    if (!script) {
      script = document.createElement('script')
      script.id = ID_SCRIPT
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(datos)
  }, [productos])

  return null
}
