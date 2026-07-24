import { ArrowRight } from '@phosphor-icons/react'
import { imagenes } from '../data/productos.js'

export default function Hero({ onVerCatalogo }) {
  const verCatalogo = (e) => {
    e.preventDefault()
    onVerCatalogo?.()
  }

  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow anim-in" style={{ '--d': '0.05s' }}>
            Tienda de perfumes · Lima, Perú
          </p>
          <h1 className="hero-title anim-in" style={{ '--d': '0.15s' }}>
            Tu fragancia<br />
            favorita, <em>original</em><br />
            y al mejor precio.
          </h1>
          <p className="hero-text anim-in" style={{ '--d': '0.28s' }}>
            Perfumes árabes, diseñador y nicho. Elige el tuyo y haz tu
            pedido por WhatsApp en un minuto.
          </p>
          <div className="hero-actions anim-in" style={{ '--d': '0.4s' }}>
            <a href="#catalogo" className="btn btn-primary" onClick={verCatalogo}>
              Ver catálogo
              <ArrowRight size={17} weight="bold" />
            </a>
            <a href="#comprar" className="btn btn-ghost">
              Cómo comprar
            </a>
          </div>
        </div>

        <div className="hero-media anim-media">
          {/* Reemplaza por tu propia fotografía de campaña (vertical). */}
          <img src={imagenes.hero} alt="Frasco de perfume de autor" loading="eager" />
        </div>
      </div>
    </section>
  )
}
