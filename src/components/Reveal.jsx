import { useReveal } from '../lib/useReveal.js'

// Anima la aparición de un elemento cuando entra en pantalla (scroll reveal).
// La lógica vive en useReveal: IntersectionObserver, respeto por
// prefers-reduced-motion y red de seguridad para que nunca quede invisible.
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variant = 'up', // 'up' | 'fade' | 'scale'
  className = '',
  ...rest
}) {
  const [ref, visible] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
