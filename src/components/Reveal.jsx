import { useRef, useEffect, useState } from 'react'

// Anima la aparición de un elemento cuando entra en pantalla (scroll reveal).
// Usa IntersectionObserver (sin listeners de scroll) y respeta prefers-reduced-motion.
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variant = 'up', // 'up' | 'fade' | 'scale'
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

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
