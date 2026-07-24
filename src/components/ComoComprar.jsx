import { MagnifyingGlass, ChatCircleText, Truck } from '@phosphor-icons/react'
import { imagenes } from '../data/productos.js'
import Reveal from './Reveal.jsx'

const pasos = [
  {
    icono: MagnifyingGlass,
    titulo: 'Elige tu perfume',
    texto: 'Explora el catálogo y agrega tus fragancias favoritas al carrito.',
  },
  {
    icono: ChatCircleText,
    titulo: 'Confirma por WhatsApp',
    texto: 'Envías el pedido con un toque; te respondemos con stock y formas de pago.',
  },
  {
    icono: Truck,
    titulo: 'Recíbelo en casa',
    texto: 'Coordinamos el envío a todo el Perú o el recojo en tienda.',
  },
]

export default function ComoComprar() {
  return (
    <section className="comprar" id="comprar">
      <div className="container comprar-grid">
        <Reveal className="comprar-media" variant="scale">
          <img src={imagenes.editorial} alt="Selección de perfumes Cool Perfumes" loading="lazy" />
        </Reveal>

        <div className="comprar-copy">
          <Reveal as="h2" className="section-title">Comprar es simple</Reveal>
          <Reveal as="p" className="section-sub comprar-intro" delay={80}>
            Sin registros ni pasarelas complicadas. Tú eliges, nosotros
            coordinamos todo por WhatsApp.
          </Reveal>

          <ol className="pasos">
            {pasos.map((p, i) => (
              <Reveal as="li" className="paso" key={i} delay={120 + i * 110}>
                <span className="paso-num">{String(i + 1).padStart(2, '0')}</span>
                <p.icono size={26} weight="light" className="paso-icono" />
                <div>
                  <h3 className="paso-titulo">{p.titulo}</h3>
                  <p className="paso-texto">{p.texto}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
