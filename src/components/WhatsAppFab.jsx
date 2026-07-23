import { useEffect, useState } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { marca } from '../config.js'

// Botón flotante de WhatsApp. Aparece tras un pequeño scroll usando un
// IntersectionObserver sobre un centinela (sin listeners de scroll).
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const centinela = document.getElementById('inicio')
    if (!centinela) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-200px 0px 0px 0px' },
    )
    io.observe(centinela)
    return () => io.disconnect()
  }, [])

  const mensaje = encodeURIComponent(
    '¡Hola Cool Perfumes! 👋 Quisiera hacer una consulta.',
  )
  const url = `https://wa.me/${marca.whatsapp}?text=${mensaje}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-fab ${visible ? 'wa-fab-visible' : ''}`}
      aria-label="Escríbenos por WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  )
}
