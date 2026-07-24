# Cool Perfumes

Catálogo web y panel administrativo para una tienda de perfumes multimarca en Lima, Perú.
Los clientes arman su carrito y envían el pedido por WhatsApp.

🔗 **En línea:** [cool-perfumes.vercel.app](https://cool-perfumes.vercel.app)

---

## Qué incluye

**Tienda pública**
- Catálogo con filtro por género y buscador (marca, nombre o familia)
- Ficha de producto en ventana emergente
- Carrito que se conserva al recargar la página
- Pedidos por WhatsApp con el detalle armado automáticamente
- Diseño responsive con menú móvil

**Panel administrativo** (`/admin`)
- Acceso con Supabase Auth
- Dashboard con métricas y gráficos interactivos
- Alta, edición y borrado de productos
- Subida de fotos a Supabase Storage
- Exportar el catálogo a JSON como copia de seguridad

---

## Tecnología

| | |
|---|---|
| Framework | React 18 + Vite |
| Backend | Supabase (Postgres, Auth, Storage) |
| Estilos | CSS propio, sin framework |
| Iconos | Phosphor Icons |
| Tipografía | Playfair Display + Jost |
| Hosting | Vercel |

Sin librerías de estado ni de gráficos: los charts del dashboard están hechos con HTML y CSS.

---

## Poner en marcha

```bash
npm install
```

Crea un archivo `.env.local` con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

```bash
npm run dev
```

> Sin esas variables la tienda funciona con el catálogo de ejemplo de
> `src/data/productos.js`, pero el panel queda deshabilitado.

**Configuración completa de Supabase:** [CONFIGURAR-SUPABASE.md](CONFIGURAR-SUPABASE.md)
**Manual para el cliente:** [MANUAL-DEL-PANEL.md](MANUAL-DEL-PANEL.md)

---

## Estructura

```
src/
├── components/     Tienda pública (Hero, Catalogo, ProductoModal, CartDrawer…)
├── admin/          Panel (AdminApp, Dashboard, ProductosAdmin, adminStore)
├── lib/            Cliente de Supabase
├── data/           Catálogo de ejemplo (semilla)
└── config.js       Datos del negocio: WhatsApp, redes, moneda
supabase/
└── setup.sql       Tablas, permisos (RLS) y bucket de imágenes
```

`src/admin/adminStore.js` es la capa de datos: expone la misma API tanto si hay
Supabase configurado como si no (en ese caso guarda en el navegador).

---

## Personalizar

Casi todo el negocio se configura en **`src/config.js`**: nombre, número de
WhatsApp, redes sociales, moneda y logo.

Los colores y tipografías están como variables CSS al inicio de `src/index.css`.

---

## Notas de despliegue

- Las variables de entorno se cargan en **Vercel → Settings → Environment
  Variables** y requieren un nuevo despliegue para aplicarse.
- `vercel.json` reescribe todas las rutas a `index.html` para que `/admin`
  funcione.
- Al cambiar de dominio, actualiza las URLs en `index.html` (canonical y
  Open Graph), `public/robots.txt` y `public/sitemap.xml`.
