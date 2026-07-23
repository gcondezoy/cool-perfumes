import { useState, useEffect } from 'react'
import { HandbagSimple, List, X, InstagramLogo, TiktokLogo } from '@phosphor-icons/react'
import { marca } from '../config.js'

export default function Header({ totalItems, scrolled, onAbrirCarrito, onFiltrar }) {
  const [menu, setMenu] = useState(false)

  // Bloquear el scroll del fondo cuando el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  const irACatalogo = (e) => {
    e?.preventDefault()
    setMenu(false)
    const el = document.getElementById('catalogo')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const irA = (id) => (e) => {
    e?.preventDefault()
    setMenu(false)
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const filtrar = (genero) => {
    setMenu(false)
    onFiltrar(genero)
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
        <a href="#inicio" className="logo" aria-label={marca.nombre}>
          <img src={marca.logo} alt={marca.nombre} className="logo-img" />
        </a>

        <nav className="nav" aria-label="Principal">
          <a href="#catalogo" onClick={irACatalogo}>Catálogo</a>
          <button type="button" className="nav-link" onClick={() => onFiltrar('mujer')}>
            Mujer
          </button>
          <button type="button" className="nav-link" onClick={() => onFiltrar('hombre')}>
            Hombre
          </button>
          <a href="#comprar" onClick={irA('comprar')}>Cómo comprar</a>
          <a href="#contacto" onClick={irA('contacto')}>Contacto</a>
        </nav>

        <div className="header-actions">
          <button
            className="cart-btn"
            onClick={onAbrirCarrito}
            aria-label={`Abrir carrito, ${totalItems} productos`}
          >
            <HandbagSimple size={22} weight="light" />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>

          <button
            className="menu-btn"
            onClick={() => setMenu(true)}
            aria-label="Abrir menú"
            aria-expanded={menu}
          >
            <List size={24} weight="light" />
          </button>
        </div>
        </div>
      </header>

      {/* Menú móvil (fuera del header para no quedar atrapado por su backdrop-filter) */}
      <div
        className={`menu-movil ${menu ? 'menu-abierto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menu}
      >
        <div className="menu-top container">
          <span className="menu-titulo">Menú</span>
          <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Cerrar menú">
            <X size={24} weight="light" />
          </button>
        </div>

        <nav className="menu-links container" aria-label="Menú móvil">
          <a href="#catalogo" onClick={irACatalogo}>Catálogo</a>
          <button type="button" onClick={() => filtrar('mujer')}>Mujer</button>
          <button type="button" onClick={() => filtrar('hombre')}>Hombre</button>
          <button type="button" onClick={() => filtrar('unisex')}>Unisex</button>
          <a href="#comprar" onClick={irA('comprar')}>Cómo comprar</a>
          <a href="#contacto" onClick={irA('contacto')}>Contacto</a>
        </nav>

        <div className="menu-social container">
          <a href={marca.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramLogo size={22} weight="light" />
          </a>
          <a href={marca.redes.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <TiktokLogo size={22} weight="light" />
          </a>
        </div>
      </div>
    </>
  )
}
