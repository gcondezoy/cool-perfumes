import { ArrowLeft } from '@phosphor-icons/react'
import { marca } from '../config.js'
import { reabrirConsentimiento } from '../lib/consentimiento.js'

export default function PoliticaPrivacidad() {
  const { legal } = marca

  return (
    <div className="legal-pagina">
      <div className="container legal-contenido">
        <a href="/" className="legal-volver">
          <ArrowLeft size={16} weight="bold" /> Volver a la tienda
        </a>

        <h1 className="legal-titulo">Política de Privacidad</h1>
        <p className="legal-fecha">Última actualización: {legal.ultimaActualizacion}</p>

        <p className="legal-intro">
          En {marca.nombre} valoramos tu privacidad. Aquí te explicamos, en
          lenguaje simple, qué datos tuyos manejamos, para qué los usamos y qué
          puedes hacer al respecto. Cumplimos con la Ley N° 29733, Ley de
          Protección de Datos Personales del Perú, y su reglamento.
        </p>

        <section className="legal-seccion">
          <h2>1. Quién es responsable de tus datos</h2>
          <p>
            <strong>{legal.razonSocial}</strong>
            {legal.ruc && <> (RUC {legal.ruc})</>}, con domicilio en{' '}
            {legal.direccion}, es responsable del tratamiento de los datos
            personales que nos facilites.
          </p>
          <p>
            Para cualquier consulta sobre privacidad puedes escribirnos a{' '}
            <a href={`mailto:${legal.correoContacto}`}>{legal.correoContacto}</a>{' '}
            o{' '}
            <a
              href={`https://wa.me/${marca.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              por WhatsApp
            </a>
            .
          </p>
        </section>

        <section className="legal-seccion">
          <h2>2. Qué datos recogemos</h2>

          <h3>Cuando navegas por la web</h3>
          <p>
            Prácticamente ninguno. No te pedimos registrarte ni crear una cuenta.
            Los productos que agregas al carrito se guardan únicamente en tu
            propio navegador (no llegan a nosotros hasta que decides enviarnos el
            pedido).
          </p>

          <h3>Cuando nos haces un pedido</h3>
          <p>
            El pedido se envía por WhatsApp. En esa conversación normalmente nos
            compartes:
          </p>
          <ul>
            <li>Tu nombre</li>
            <li>Tu número de teléfono (visible al escribirnos por WhatsApp)</li>
            <li>
              Tu dirección o punto de referencia, si eliges envío a domicilio
            </li>
            <li>Los productos que deseas comprar</li>
          </ul>
          <p>
            Además, en nuestro sistema queda registrado el detalle del pedido
            (productos, cantidades, total y un código de seguimiento). Ese
            registro <strong>no incluye tu nombre, teléfono ni dirección</strong>
            : esos datos permanecen únicamente en la conversación de WhatsApp.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>3. Para qué usamos tus datos</h2>
          <ul>
            <li>Atender tu consulta y procesar tu pedido.</li>
            <li>Coordinar el pago y la entrega del producto.</li>
            <li>Darte soporte posterior a la compra si lo necesitas.</li>
            <li>
              Llevar un control interno de nuestras ventas (con datos del pedido,
              no personales).
            </li>
          </ul>
          <p>
            No usamos tus datos para enviarte publicidad no solicitada, ni los
            vendemos ni los cedemos a terceros con fines comerciales.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>4. Con quién compartimos información</h2>
          <p>
            Solo con los proveedores tecnológicos necesarios para que la tienda
            funcione:
          </p>
          <ul>
            <li>
              <strong>WhatsApp (Meta):</strong> es el canal por el que nos
              escribes. La conversación se rige por las políticas de privacidad
              de WhatsApp.
            </li>
            <li>
              <strong>Supabase:</strong> almacena el catálogo de productos y el
              registro de pedidos (sin datos personales).
            </li>
            <li>
              <strong>Vercel:</strong> aloja la página web y, si lo autorizas,
              nos brinda estadísticas anónimas de visitas.
            </li>
            <li>
              <strong>Google Fonts:</strong> provee las tipografías de la web.
            </li>
          </ul>
          <p>
            Algunos de estos servicios almacenan información en servidores fuera
            del Perú. Al usar la web y contactarnos, aceptas este flujo
            transfronterizo, necesario para prestarte el servicio.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>5. Cookies y tecnologías similares</h2>
          <p>
            Esta web <strong>no utiliza cookies publicitarias ni de
            seguimiento</strong>. Usamos únicamente:
          </p>
          <ul>
            <li>
              <strong>Almacenamiento esencial:</strong> guarda tu carrito de
              compras en tu navegador. Es imprescindible para que la tienda
              funcione y no requiere consentimiento.
            </li>
            <li>
              <strong>Estadísticas anónimas (opcional):</strong> nos indican
              cuántas personas visitan la web, sin identificarte. Solo se activan
              si las aceptas.
            </li>
          </ul>
          <p>
            Puedes cambiar tu decisión cuando quieras:{' '}
            <button className="legal-boton-enlace" onClick={reabrirConsentimiento}>
              modificar mis preferencias de cookies
            </button>
            .
          </p>
        </section>

        <section className="legal-seccion">
          <h2>6. Cuánto tiempo conservamos tus datos</h2>
          <p>
            Conservamos la información de tus pedidos mientras sea necesaria para
            atenderte y cumplir obligaciones contables o legales. Puedes pedirnos
            que eliminemos tus datos en cualquier momento.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>7. Tus derechos</h2>
          <p>
            La Ley N° 29733 te reconoce los siguientes derechos sobre tus datos
            personales:
          </p>
          <ul>
            <li>
              <strong>Acceso:</strong> saber qué datos tuyos tenemos.
            </li>
            <li>
              <strong>Rectificación:</strong> corregir datos incorrectos o
              desactualizados.
            </li>
            <li>
              <strong>Cancelación:</strong> pedir que eliminemos tus datos.
            </li>
            <li>
              <strong>Oposición:</strong> oponerte a que usemos tus datos para
              una finalidad determinada.
            </li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escríbenos a{' '}
            <a href={`mailto:${legal.correoContacto}`}>{legal.correoContacto}</a>.
            Te responderemos en los plazos que establece la ley. Si consideras
            que no atendimos tu solicitud correctamente, puedes acudir a la
            Autoridad Nacional de Protección de Datos Personales del Ministerio
            de Justicia y Derechos Humanos.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>8. Seguridad</h2>
          <p>
            Aplicamos medidas razonables para proteger la información: el acceso
            a nuestro sistema de gestión está protegido con usuario y contraseña,
            la web usa conexión cifrada (HTTPS) y solo el personal autorizado
            puede consultar los pedidos.
          </p>
        </section>

        <section className="legal-seccion">
          <h2>9. Cambios en esta política</h2>
          <p>
            Si modificamos esta política, actualizaremos la fecha del inicio de
            esta página. Te recomendamos revisarla ocasionalmente.
          </p>
        </section>

        <a href="/" className="btn btn-primary legal-cta">
          Volver a la tienda
        </a>
      </div>
    </div>
  )
}
