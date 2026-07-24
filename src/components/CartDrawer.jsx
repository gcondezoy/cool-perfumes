import { X, Minus, Plus, Trash, WhatsappLogo } from '@phosphor-icons/react'
import { marca } from '../config.js'
import { generarCodigo, registrarPedido } from '../admin/pedidosStore.js'

export default function CartDrawer({
  abierto,
  carrito,
  onCerrar,
  onCambiarCantidad,
  onQuitar,
  onVaciar,
}) {
  const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0)

  // Arma el mensaje de WhatsApp y deja registrado el pedido en el panel.
  const enviarWhatsApp = () => {
    if (carrito.length === 0) return

    // El código permite ubicar este pedido en el panel al recibir el WhatsApp.
    const codigo = generarCodigo()

    const lineas = carrito.map(
      (p) =>
        `• ${p.cantidad} × ${p.marca} ${p.nombre} (${p.ml} ml) - ${marca.moneda} ${
          p.precio * p.cantidad
        }`,
    )

    const mensaje = [
      marca.saludoPedido,
      '',
      ...lineas,
      '',
      `Total: ${marca.moneda} ${total}`,
      `Pedido: ${codigo}`,
    ].join('\n')

    const url = `https://wa.me/${marca.whatsapp}?text=${encodeURIComponent(mensaje)}`

    // Se abre WhatsApp de inmediato (si esperáramos, el navegador podría
    // bloquear la ventana emergente). El registro se guarda en segundo plano.
    window.open(url, '_blank', 'noopener')

    registrarPedido({ codigo, carrito, total }).catch((e) =>
      console.warn('El pedido no se pudo registrar:', e.message),
    )
  }

  return (
    <>
      <div
        className={`overlay ${abierto ? 'overlay-visible' : ''}`}
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside
        className={`drawer ${abierto ? 'drawer-abierto' : ''}`}
        aria-label="Carrito de compras"
        aria-hidden={!abierto}
      >
        <div className="drawer-head">
          <h2>Tu pedido</h2>
          <button className="icon-btn" onClick={onCerrar} aria-label="Cerrar carrito">
            <X size={22} weight="light" />
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="drawer-vacio">
            <p>Tu carrito está vacío.</p>
            <button className="btn btn-ghost" onClick={onCerrar}>
              Explorar fragancias
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {carrito.map((p) => (
                <li key={p.id} className="drawer-item">
                  <img src={p.imagen} alt="" className="drawer-thumb" />
                  <div className="drawer-item-info">
                    <p className="drawer-item-marca">{p.marca}</p>
                    <p className="drawer-item-nombre">{p.nombre}</p>
                    <p className="drawer-item-meta">
                      {p.ml} ml · {marca.moneda} {p.precio}
                    </p>
                    <div className="stepper">
                      <button
                        onClick={() => onCambiarCantidad(p.id, -1)}
                        aria-label="Quitar una unidad"
                      >
                        <Minus size={14} weight="bold" />
                      </button>
                      <span>{p.cantidad}</span>
                      <button
                        onClick={() => onCambiarCantidad(p.id, 1)}
                        aria-label="Agregar una unidad"
                      >
                        <Plus size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="drawer-item-lado">
                    <span className="drawer-item-precio">
                      {marca.moneda} {p.precio * p.cantidad}
                    </span>
                    <button
                      className="icon-btn icon-btn-sm"
                      onClick={() => onQuitar(p.id)}
                      aria-label={`Eliminar ${p.nombre}`}
                    >
                      <Trash size={16} weight="light" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="drawer-total">
                <span>Total</span>
                <strong>
                  {marca.moneda} {total}
                </strong>
              </div>
              <button className="btn btn-whatsapp" onClick={enviarWhatsApp}>
                <WhatsappLogo size={20} weight="fill" />
                Pedir por WhatsApp
              </button>
              <button className="btn-vaciar" onClick={onVaciar}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
