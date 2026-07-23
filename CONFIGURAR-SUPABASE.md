# Conectar el panel a Supabase

Sigue estos 5 pasos. Toma unos 10 minutos.

Mientras no lo hagas, la web sigue funcionando en **modo local** (los cambios del
panel se guardan solo en tu navegador).

---

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta.
2. **New project**. Ponle un nombre (ej. `cool-perfumes`).
3. Elige una contraseña para la base de datos y guárdala.
4. Región recomendada: **South America (São Paulo)** por cercanía a Perú.

---

## 2. Crear la tabla y el bucket de imágenes

1. En el menú lateral entra a **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/setup.sql`](supabase/setup.sql) de este proyecto.
3. Copia **todo** su contenido, pégalo y presiona **Run**.

Eso crea:
- la tabla `productos`,
- las reglas de seguridad (todos pueden leer, solo tú puedes editar),
- el bucket `productos` para las fotos,
- 8 productos de ejemplo (puedes borrarlos después).

---

## 3. Crear tu usuario de administrador

1. Menú lateral → **Authentication** → **Users** → **Add user** → *Create new user*.
2. Pon tu correo y una contraseña. **Marca la casilla "Auto Confirm User"**
   (si no, el usuario queda sin confirmar y no podrás entrar).
3. Ese correo y contraseña serán tu acceso al panel.

---

## 4. Conectar la web con tus credenciales

1. En Supabase ve a **Settings** (engranaje) → **API**.
2. Copia estos dos valores:
   - **Project URL**
   - **anon public** (la clave larga)
3. En la carpeta del proyecto, crea un archivo llamado **`.env.local`** con:

```
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

4. **Reinicia el servidor** (`Ctrl+C` y de nuevo `npm run dev`). Vite solo lee las
   variables de entorno al arrancar.

> `.env.local` ya está en `.gitignore`, así que no se sube a GitHub.

---

## 5. Probar

1. Entra a `http://localhost:5173/#/admin` (o el puerto que uses).
2. Inicia sesión con el correo y contraseña del paso 3.
3. Arriba debe decir **"Conectado a Supabase"** en verde.
4. Crea un producto y **sube una foto** con el botón *Subir imagen*.
5. Abre la tienda: el producto debe aparecer ahí.

---

## Al publicar en Vercel

Las variables de entorno no se suben con el código. En Vercel:

1. Entra a tu proyecto → **Settings** → **Environment Variables**.
2. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos valores.
3. Vuelve a desplegar (**Redeploy**).

---

## Preguntas frecuentes

**¿Es seguro que la clave "anon" esté en el navegador?**
Sí, está diseñada para eso. La seguridad real la dan las políticas RLS del paso 2:
cualquiera puede *leer* el catálogo (es una tienda pública), pero solo un usuario
autenticado puede crear, editar o borrar.

**¿Puedo darle acceso a otra persona?**
Sí, créale otro usuario en *Authentication → Users*.

**¿Y si quiero volver al modo local?**
Borra o renombra `.env.local` y reinicia el servidor.
