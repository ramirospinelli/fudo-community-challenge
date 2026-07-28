import { Link, Route, Routes } from 'react-router-dom'
import { Detail } from './pages/Detail'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import styles from './App.module.css'

export function App() {
  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} to="/" aria-label="Fudo Community, inicio"><span>F</span>Fudo Community</Link>
          <nav className={styles.navigation} aria-label="Navegación principal"><Link to="/">Publicaciones</Link></nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Detail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className={styles.footer}><div className={`container ${styles.footerInner}`}>Challenge Front-end · React + TypeScript</div></footer>
    </>
  )
}
