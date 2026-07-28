import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/api'
import { buildCommentTree } from '../commentTree'
import { Avatar } from '../components/Avatar'
import { CommentForm } from '../components/CommentForm'
import { CommentItem } from '../components/CommentItem'
import { PostForm } from '../components/PostForm'
import type { Comment, CommentInput, Post, PostInput } from '../types'
import { errorMessage, formatDate, isNotFoundError } from '../utils/presentation'
import styles from './Detail.module.css'

export function Detail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post>()
  const [comments, setComments] = useState<Comment[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const currentId = useRef<string | null>(id)
  const reloadController = useRef<AbortController | null>(null)

  async function reloadComments() {
    reloadController.current?.abort()
    const controller = new AbortController()
    reloadController.current = controller
    try {
      const data = await api.comments(id, controller.signal)
      if (currentId.current === id && !controller.signal.aborted) setComments(data)
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) throw reason
    } finally {
      if (reloadController.current === controller) reloadController.current = null
    }
  }

  useEffect(() => {
    currentId.current = id
    const controller = new AbortController()
    Promise.all([api.post(id, controller.signal), api.comments(id, controller.signal)])
      .then(([loadedPost, loadedComments]) => {
        if (currentId.current !== id || controller.signal.aborted) return
        setPost(loadedPost)
        setComments(loadedComments)
        setStatus('ready')
      })
      .catch((reason) => {
        if (currentId.current !== id || controller.signal.aborted) return
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        if (isNotFoundError(reason)) {
          setStatus('not-found')
          return
        }
        setError(errorMessage(reason))
        setStatus('error')
      })
    return () => {
      controller.abort()
      reloadController.current?.abort()
      if (currentId.current === id) currentId.current = null
    }
  }, [id])

  async function addComment(input: CommentInput) {
    setError('')
    await api.createComment(id, input)
    await reloadComments()
  }

  async function updatePost(input: PostInput) {
    if (!post) return
    setError('')
    setPost(await api.updatePost(post, input))
    setEditing(false)
  }

  async function deletePost() {
    if (!post || !confirm(`¿Eliminar “${post.title}”?`)) return
    setError('')
    try {
      await api.deletePost(post.id)
      navigate('/')
    } catch (reason) {
      setError(errorMessage(reason))
    }
  }

  const tree = buildCommentTree(comments)

  return (
    <main id="main-content" className={`container ${styles.detail}`}>
      <Link className={styles.backLink} to="/">← Volver a publicaciones</Link>
      <div aria-live="polite">
        {status === 'loading' && <p className="state">Cargando conversación…</p>}
        {status === 'not-found' && <p className="state">No encontramos esta publicación. <Link to="/">Volver a publicaciones</Link></p>}
        {status === 'error' && <p className="state error" role="alert">{error}</p>}
        {status === 'ready' && error && <p className="state error" role="alert">{error}</p>}
      </div>
      {status === 'ready' && post && <>
        <article className={`surface ${styles.postDetail}`}>
          {editing ? <>
            <h1>Editar publicación</h1>
            <PostForm initial={post} submitLabel="Guardar cambios" onSubmit={updatePost} onCancel={() => setEditing(false)} />
          </> : <>
            <div className="author">
              <Avatar src={post.avatar} name={post.name} />
              <div><strong>{post.name}</strong><time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time></div>
            </div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <div className="card-actions">
              <button className="link-button" onClick={() => setEditing(true)}>Editar publicación</button>
              <button className="link-button danger" onClick={deletePost}>Eliminar publicación</button>
            </div>
          </>}
        </article>
        <section className={styles.conversation} aria-labelledby="conversation-title">
          <div className="section-heading"><h2 id="conversation-title">Conversación</h2><span>{comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}</span></div>
          <div className="panel"><h3>Sumate a la conversación</h3><CommentForm key={id} submitLabel="Comentar" onSubmit={addComment} /></div>
          {tree.length === 0 ? <p className="state">Todavía no hay comentarios. Iniciá la conversación.</p> : <ol className={styles.commentList}>{tree.map((node) => <CommentItem key={node.id} node={node} onChanged={reloadComments} />)}</ol>}
        </section>
      </>}
    </main>
  )
}
