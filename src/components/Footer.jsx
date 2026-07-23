import {
  InstagramLogo,
  TiktokLogo,
  WhatsappLogo,
  MapPin,
  Clock,
} from '@phosphor-icons/react'
import { marca } from '../config.js'

export default function Footer() {
  const waLink = `https://wa.me/${marca.whatsapp}`

  return (
    <footer className="site-footer" id="contacto">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={marca.logo} alt={marca.nombre} className="footer-logo" />
          <p className="footer-eslogan">
            Perfumes originales de las mejores casas del mundo, seleccionados
            para ti. Envíos a todo el Perú.
          </p>
          <div className="footer-social">
            <a href={marca.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramLogo size={22} weight="light" />
            </a>
            <a href={marca.redes.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TiktokLogo size={22} weight="light" />
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsappLogo size={22} weight="light" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-titulo">Contacto</h3>
          <ul className="footer-datos">
            <li>
              <MapPin size={17} weight="light" />
              {marca.contacto.ciudad}
            </li>
            <li>
              <Clock size={17} weight="light" />
              {marca.contacto.horario}
            </li>
            <li>
              <InstagramLogo size={17} weight="light" />
              {marca.contacto.instagramHandle}
            </li>
            <li>
              <TiktokLogo size={17} weight="light" />
              {marca.contacto.tiktokHandle}
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-titulo">Pedidos</h3>
          <p className="footer-cta-text">
            Haz tu pedido directo por WhatsApp. Te asesoramos para encontrar tu
            fragancia ideal.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp footer-wa">
            <WhatsappLogo size={19} weight="fill" />
            Escríbenos
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {marca.nombre}
        </span>
        <span>Perfumería · Lima, Perú</span>
      </div>
    </footer>
  )
}
