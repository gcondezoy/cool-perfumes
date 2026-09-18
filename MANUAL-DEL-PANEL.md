# Manual del panel — Cool Perfumes

Guía para administrar tu tienda. No necesitas saber de programación.

---

## Entrar al panel

1. Abre **coolperfumes.pe/admin** (o la dirección de tu tienda seguida de `/admin`).
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

> No te preocupes por el peso de la foto: el panel la achica y la optimiza
> solo, antes de subirla. Puedes mandar la foto tal como sale del celular.

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

## Anotar si un frasco es Open Box

En el formulario hay un campo **"Estado del frasco"** con dos opciones:

- **Sellado** — el frasco viene cerrado de fábrica
- **Open Box** — caja abierta / tester

> **Es solo para tu control.** El comprador **no ve** este dato en la tienda:
> no aparece ninguna etiqueta en la tarjeta ni en la ficha. Te sirve a ti para
> saber de un vistazo qué frascos son tester, y lo verás también en la lista de
> Productos y en el Dashboard.

## Vender un perfume en decant (3 ml, 5 ml y 10 ml)

La tienda tiene **dos secciones separadas** para que el cliente no se confunda:

- **La colección** → los frascos completos
- **Decants** → las porciones de 3 ml, 5 ml y 10 ml

**No cargas el decant como un producto aparte.** Se activa desde el mismo
perfume: en el formulario, busca la sección **"Decants"** y pon el precio:

- **Decant 3 ml** → por ejemplo `15`
- **Decant 5 ml** → por ejemplo `30`
- **Decant 10 ml** → por ejemplo `50`

**Deja vacío el que no vendas.** Si dejas los tres vacíos, ese perfume solo
aparece en la sección de perfumes.

### Perfumes que vendes SOLO en decant

Si de un perfume no vendes el frasco (solo lo decantas), en el formulario
cambia **"¿Cómo se vende?"** a **"Solo en decant"**.

- Desaparecen los campos de precio del frasco y de stock: no hacen falta.
- Tienes que poner **al menos un precio de decant**. Si no pones ninguno, el
  panel no te deja guardar, porque ese perfume no se vería en ningún lado.
- En la tienda aparece **solo en la sección Decants**, no en La colección.
- En la lista de Productos lo verás con la etiqueta **Solo decant**.

Para dejar de ofrecerlo un tiempo, marca **Agotado**: su tarjeta desaparece
de la sección Decants hasta que lo desmarques.

### Qué ve el cliente
- En la sección **Decants** aparece una tarjeta de ese perfume con los tamaños
  y su precio. Elige el tamaño y lo agrega directo al carrito.
- En la tarjeta del catálogo de perfumes ve un aviso: *"También en decant ·
  desde S/ 30"*.
- Al abrir la ficha del perfume, un aviso lo invita a ir a la sección de
  decants si prefiere probarlo primero.

La sección **Decants** solo aparece cuando al menos un perfume tiene precio de
decant.

### En el pedido
Cuando te llegue el WhatsApp, cada línea dice qué presentación pidió:

```
• 1 × Lattafa Yara (Decant 5 ml) - S/ 30
• 1 × Dior Sauvage (100 ml) - S/ 399
```

Un mismo perfume puede ir en el carrito en frasco y en decant a la vez, como
dos líneas separadas.

> **Nota:** si el frasco completo está en oferta, el descuento **no** se aplica
> al decant (el decant mantiene el precio que pusiste).

---

## Controlar el stock

En el formulario hay un campo **"Stock (unidades del frasco)"**:

| Qué pones | Qué pasa |
|---|---|
| **Vacío** | Sin control: el cliente puede pedir la cantidad que quiera |
| **0** | El perfume se marca como **agotado** automáticamente |
| **1 o más** | El cliente **no podrá pedir más** de esa cantidad |

### Qué ve el cliente
- Si quedan **3 o menos**, aparece un aviso rojo en la tarjeta:
  *"Últimas 2 unidades"* (o *"Última unidad"*). Genera urgencia y ayuda a vender.
- Si intenta agregar más de lo disponible, el botón **+** del carrito se
  bloquea y le avisa *"Es todo el stock disponible"*.
- Al llegar a 0, el perfume **sale del catálogo principal** y se va al bloque
  "Agotados por ahora", igual que si lo marcaras a mano (ver más abajo).

### Cosas importantes
- **El stock no se descuenta solo.** Cuando vendas, tienes que bajar el número
  a mano en el panel. Se hizo así a propósito: como también vendes por otros
  canales (tienda, Instagram), un descuento automático te desordenaría el
  inventario.
- **El stock es del frasco completo.** Los decants no descuentan unidades,
  porque se preparan del frasco. Si un perfume se agota, sus decants también
  dejan de ofrecerse.
- En la tabla de productos verás la columna **Stock**, en naranja cuando queda
  poco y en rojo cuando está en 0.

---

## Marcar un perfume como Agotado

Cuando te quedes sin stock, marca la casilla **"Agotado"** en el formulario.

Ese perfume **desaparece del catálogo principal** y se va a un bloque cerrado
al final, que dice *"Agotados por ahora (5)"*. El visitante solo lo ve si hace
clic ahí. Se hizo así a propósito: si la mitad del catálogo se ve en gris con
la etiqueta "Agotado", la tienda parece vacía y el cliente se va. Con esto,
lo primero que ve es **solo lo que sí puede comprar**.

Dentro de ese bloque el perfume sigue en gris, **no se puede agregar al
carrito**, pero sí se ven sus detalles y hay un botón para **consultar por
WhatsApp** (por si quiere que le avises cuando vuelva a haber).

No hace falta borrarlo: cuando vuelvas a tener stock, solo desmarca la casilla
y vuelve al catálogo principal.

---

## Ordenar tu catálogo

Tú decides qué perfume sale primero. En **Productos** hay dos pestañas, una por
cada sección de la tienda:

| Pestaña | Qué ordena en la tienda |
|---|---|
| **La colección** | Los frascos completos |
| **Decants** | La sección de decants (incluye los perfumes que vendes *solo* en decant) |

**Cada pestaña tiene su propio orden.** Un perfume que vendes en frasco y en
decant aparece en las dos, y puede ir primero en una y último en la otra. Mover
algo en Decants **no** cambia La colección, ni al revés.

En la columna **Orden** tienes tres botones:

- **↑** sube el perfume una posición
- **↓** lo baja una posición
- **⤒** lo manda directo al principio

El número de la izquierda es la posición exacta en que lo ve tu cliente. **Se
guarda solo**, no hay que apretar nada más.

### Cosas a tener en cuenta
- Mientras hay una **búsqueda o un filtro**, las flechas se desactivan: para
  mover un perfume tienes que ver la sección completa. Quita el filtro y listo.
- Un **producto nuevo aparece primero** en su sección hasta que lo acomodes.
- Si buscas un perfume en una pestaña y está en la otra, el panel te avisa y te
  lleva con un clic.
- Si pulsas **Nuevo producto** estando en la pestaña Decants, el formulario ya
  viene marcado como "Solo en decant" (puedes cambiarlo).

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
- **Open Box** — cuántos frascos son tester y cuántos están sellados (dato interno tuyo).

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
