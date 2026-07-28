import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api'
import { Avatar } from '../components/Avatar'
import { PostForm } from '../components/PostForm'
import type { Post, PostInput } from '../types'
import { errorMessage, formatDate } from '../utils/presentation'
import styles from './Home.module.css'

export function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<string>()

  useEffect(() => {
    const controller = new AbortController()
    api.posts(controller.signal)
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setError(errorMessage(reason))
        setStatus('error')
      })
    return () => controller.abort()
  }, [])

  async function createPost(input: PostInput) {
    setError('')
    const post = await api.createPost(input)
    setPosts((current) => [post, ...current])
    setCreating(false)
  }

  async function updatePost(post: Post, input: PostInput) {
    setError('')
    const updated = await api.updatePost(post, input)
    setPosts((current) => current.map((item) => item.id === updated.id ? updated : item))
    setEditing(undefined)
  }

  async function deletePost(post: Post) {
    if (!confirm(`¿Eliminar “${post.title}”? Esta acción no se puede deshacer.`)) return
    setError('')
    try {
      await api.deletePost(post.id)
      setPosts((current) => current.filter(({ id }) => id !== post.id))
    } catch (reason) {
      setError(errorMessage(reason))
    }
  }

  return (
    <main id="main-content" className="container">
      <section className={styles.hero}>
        <div><p className={styles.eyebrow}>COMUNIDAD</p><h1>Ideas que generan conversación.</h1><p>Compartí una publicación y construí la conversación en comunidad.</p></div>
        <button className="primary" disabled={status !== 'ready'} onClick={() => setCreating((value) => !value)}>{creating ? 'Cerrar formulario' : 'Nueva publicación'}</button>
      </section>
      {creating && (
        <section className="panel" aria-labelledby="new-post">
          <h2 id="new-post">Crear publicación</h2>
          <PostForm submitLabel="Publicar" onSubmit={createPost} onCancel={() => setCreating(false)} />
        </section>
      )}
      <section aria-labelledby="posts-title">
        <div className="section-heading"><h2 id="posts-title">Publicaciones</h2>{status === 'ready' && <span>{posts.length} en total</span>}</div>
        <div aria-live="polite">
          {status === 'loading' && <p className="state">Cargando publicaciones…</p>}
          {status === 'error' && <p className="state error" role="alert">{error}</p>}
          {status === 'ready' && posts.length === 0 && <p className="state">Todavía no hay publicaciones. Sé la primera persona en compartir una.</p>}
        </div>
        {status === 'ready' && error && <p className="error" role="alert">{error}</p>}
        <div className={styles.postList}>
          {posts.map((post) => editing === post.id ? (
            <article className="panel" key={post.id}>
              <h3>Editar publicación</h3>
              <PostForm initial={post} submitLabel="Guardar cambios" onSubmit={(input) => updatePost(post, input)} onCancel={() => setEditing(undefined)} />
            </article>
          ) : (
            <article className={`surface ${styles.postCard}`} key={post.id}>
              <div className="author">
                <Avatar src={post.avatar} name={post.name} />
                <div><strong>{post.name}</strong><time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time></div>
              </div>
              <h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
              <p>{post.content}</p>
              <div className="card-actions">
                <Link className="text-link" to={`/post/${post.id}`}>Ver conversación</Link>
                <button className="link-button" onClick={() => setEditing(post.id)}>Editar</button>
                <button className="link-button danger" onClick={() => deletePost(post)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
