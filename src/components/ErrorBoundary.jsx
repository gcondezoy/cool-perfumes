import { Component } from 'react'

// Evita la "pantalla en blanco": si algo falla, el visitante ve un mensaje
// claro y puede reintentar o escribir por WhatsApp.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Error en la aplicación:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="err-pantalla">
        <div className="err-caja">
          <img src="/logo-cool-perfumes.png" alt="Cool Perfumes" className="err-logo" />
          <h1 className="err-titulo">Algo salió mal</h1>
          <p className="err-texto">
            No pudimos cargar la página. Vuelve a intentarlo; si sigue fallando,
            escríbenos y te atendemos por WhatsApp.
          </p>
          <div className="err-acciones">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reintentar
            </button>
            <a
              className="btn btn-ghost"
              href="https://wa.me/51981814457"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos
            </a>
          </div>
        </div>
      </div>
    )
  }
}
