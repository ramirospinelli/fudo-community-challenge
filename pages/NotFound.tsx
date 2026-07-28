import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main id="main-content" className="container state">
      <h1>Página no encontrada</h1>
      <Link className="text-link" to="/">Volver al inicio</Link>
    </main>
  )
}
