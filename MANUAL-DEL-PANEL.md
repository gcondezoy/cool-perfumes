# Manual del panel — Cool Perfumes

Guía para administrar tu tienda. No necesitas saber de programación.

---

## Entrar al panel

1. Abre **coolperfumes.com/admin** (o la dirección de tu tienda seguida de `/admin`).
2. Escribe tu **correo** y **contraseña**.
3. Listo. Arriba verás un aviso verde que dice *"Conectado a Supabase"*: eso significa que todo está funcionando.

> **Guarda bien tu contraseña.** Si la pierdes, se puede recuperar desde el panel de Supabase.

---

## Agregar un perfume nuevo

1. En el menú, entra a **Productos**.
2. Botón negro **"+ Nuevo producto"**.
3. Completa los datos:

| Campo | Qué poner | ¿Obligatorio? |
|---|---|---|
| **Marca** | La casa del perfume: Dior, Chanel, Lattafa… | Sí |
| **Nombre del perfume** | Ej: *Sauvage EDP* | Sí |
| **Género** | Mujer, Hombre o Unisex | Sí |
| **Concentración** | Eau de Parfum, Eau de Toilette, etc. | No, pero recomendado |
| **Familia olfativa** | Ej: *Amaderado Aromático* | No |
| **Cantidad (ml)** | El tamaño del frasco: 100 | Sí |
| **Notas principales** | Ej: *Bergamota, vainilla, ámbar* | No |
| **Precio** | Solo el número: 429 | Sí |
| **Precio antes** | Solo si está en oferta (ver abajo) | No |

4. Sube la **foto** (ver siguiente sección).
5. Botón **Guardar**.

El perfume aparece en la tienda **al instante**. No hay que hacer nada más.

---

## Subir la foto del producto

1. Dentro del formulario, busca **"Foto del producto"**.
2. Clic en **"Subir imagen"** y elige la foto de tu computadora o celular.
3. Espera a que diga *"Subiendo…"* y aparezca la vista previa.

**Requisitos:** JPG, PNG o WebP · máximo 5 MB.

### Consejo importante para que se vea profesional
Toma **todas las fotos igual**: mismo fondo (de preferencia blanco o claro), misma distancia y el frasco centrado. Cuando las fotos son parejas, el catálogo se ve como el de una tienda grande. Si cada foto tiene un fondo distinto, se nota improvisado.

Medida recomendada: **vertical**, tipo 800 × 1000 píxeles.

---

## Poner un perfume en oferta

1. Edita el producto (ícono del lápiz ✏️).
2. En **Precio** deja el precio *rebajado* (lo que va a pagar el cliente).
3. En **Precio antes** pon el precio *original*.
4. Guardar.

La tienda calcula sola el porcentaje y muestra la etiqueta roja de descuento.

> Ejemplo: Precio `429` y Precio antes `499` → se muestra **-14%**.

---

## Destacar un perfume

Marca la casilla **"Marcar como destacado"** al final del formulario. Aparecerá con una etiqueta *Destacado* en la tienda. Úsalo con tus productos estrella o los que más quieras vender.

## Marcar un perfume como Open Box

Si un perfume es **caja abierta / tester**, marca la casilla **"Open Box"** en el
formulario. Aparecerá con una etiqueta *Open Box* en su tarjeta y en su ficha,
para que el cliente sepa que es una presentación abierta.

---

## Editar o eliminar

En la lista de **Productos**, al final de cada fila:

- ✏️ **Lápiz** → editar
- 🗑️ **Basurero** → eliminar (te pide confirmación)

> ⚠️ Eliminar **no se puede deshacer**. Si dudas, mejor edítalo.

---

## Entender el Dashboard

Es la pantalla de inicio. Te dice cómo está tu tienda:

- **Productos en catálogo** — cuántos perfumes tienes y de cuántas marcas.
- **Valor del catálogo** — cuánto suman todos tus precios.
- **En oferta** — cuántos tienen descuento.
- **Destacados** — cuántos llevan etiqueta.

### "Qué te falta completar"
Es la sección más útil. Te avisa si hay perfumes **sin foto**, **sin precio** o **sin datos**. Un catálogo completo se ve más profesional y vende más. Si sale el check verde, está todo en orden.

### Los gráficos son botones
Haz clic en cualquier barra (una marca, un género, un rango de precio) y te lleva a la lista de esos productos, ya filtrada. Para quitar el filtro, usa **"Quitar filtro"**.

---

## Pedidos: cobrar y descartar a los que no pagan

Cada vez que alguien presiona **"Pedir por WhatsApp"** en la tienda, el pedido
queda registrado solo en la sección **Pedidos**. No tienes que hacer nada.

### Cómo identificar el pedido
En el mensaje de WhatsApp que te llega viene un **código** al final:

```
Total: S/ 658
Pedido: CP-7K3A     ← búscalo en el panel
```

Ese mismo código aparece en la lista de Pedidos. Así sabes cuál es cuál.

### Qué hacer con cada pedido

| Botón | Cuándo usarlo |
|---|---|
| ✅ **Marcar como pagado** | Cuando ya recibiste el dinero |
| ❌ **Cancelar** | Cuando el cliente pidió pero no concretó |
| ↩️ **Volver a pendiente** | Si te equivocaste |
| 🗑️ **Eliminar** | Para borrarlo definitivamente |

Haz clic en la flecha del pedido para ver el detalle de qué perfumes pidió.

> **Importante:** los pedidos **cancelados no cuentan** en tus estadísticas de
> venta ni en "Lo más pedido". Así los que piden y no pagan no te distorsionan
> los números.

### Los números de venta

- **Vendido (cobrado)** — solo los pedidos que marcaste como pagados. Es tu venta real.
- **Por cobrar** — lo que tienes pendiente. El menú muestra un número rojo con los pendientes.
- **Pedidos (7 días)** — cuántos entraron en la última semana.
- **Ticket promedio** — cuánto gasta en promedio cada cliente que sí paga.
- **Lo más pedido** — qué perfumes te piden más. Úsalo para saber qué reponer.

---

## Copia de seguridad (hazlo de vez en cuando)

En **Productos**, botón **"Exportar JSON"**. Se descarga un archivo con todo tu catálogo.

Guárdalo en tu Drive o correo. Si algún día pasa algo, ese archivo tiene toda tu información. Recomendación: hazlo **una vez al mes** o cada vez que cargues varios productos nuevos.

---

## Preguntas frecuentes

**¿Los cambios se ven al instante?**
Sí. Editas y ya está publicado. No hay que "publicar" ni esperar.

**¿Puedo entrar desde el celular?**
Sí, el panel funciona en el teléfono. El menú lateral se convierte en una barra arriba.

**¿Puedo dar acceso a otra persona?**
Sí, se le crea un usuario. Pídeselo a quien te desarrolló la web.

**Subí una foto y no se ve bien**
Revisa que no pese más de 5 MB y que sea JPG o PNG. Si se ve muy estirada o pequeña, usa una foto vertical con el frasco centrado.

**Me olvidé la contraseña**
Se puede restablecer desde el panel de Supabase. Contacta a quien te desarrolló la web.

---

## Cómo llegan los pedidos

Tu cliente arma su carrito en la tienda y presiona **"Pedir por WhatsApp"**. Te llega un mensaje a tu WhatsApp con el detalle completo:

```
¡Hola Cool Perfumes! 👋 Quisiera hacer este pedido:

• 1 × Dior Sauvage EDP (100 ml) - S/ 429
• 2 × Versace Eros (100 ml) - S/ 658

Total: S/ 1087
```

Desde ahí coordinas el pago y el envío como siempre lo haces.
