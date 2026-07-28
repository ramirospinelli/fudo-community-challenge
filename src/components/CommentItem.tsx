import { useState } from 'react'
import { api } from '../api/api'
import type { CommentInput, CommentNode } from '../types'
import { errorMessage, formatDate } from '../utils/presentation'
import { Avatar } from './Avatar'
import { CommentForm } from './CommentForm'
import styles from './CommentItem.module.css'

interface CommentItemProps {
  node: CommentNode
  onChanged: () => Promise<void>
}

export function CommentItem({ node, onChanged }: CommentItemProps) {
  const [replying, setReplying] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  async function reply(input: CommentInput) {
    setError('')
    await api.createComment(node.postId, { ...input, parentId: node.id })
    await onChanged()
    setReplying(false)
  }

  async function edit(input: CommentInput) {
    setError('')
    await api.updateComment(node, { ...input, parentId: node.parentId })
    await onChanged()
    setEditing(false)
  }

  async function remove() {
    if (!confirm('¿Eliminar este comentario?')) return
    setError('')
    try {
      await api.deleteComment(node)
      await onChanged()
    } catch (reason) {
      setError(errorMessage(reason))
    }
  }

  return (
    <li className={styles.commentItem}>
      <article className={`surface ${styles.commentCard}`}>
        <div className="author">
          <Avatar src={node.avatar} name={node.name} />
          <div><strong>{node.name}</strong><time dateTime={node.createdAt}>{formatDate(node.createdAt)}</time></div>
        </div>
        {editing ? <CommentForm initial={node} submitLabel="Guardar" onSubmit={edit} onCancel={() => setEditing(false)} mapCreationCapacityError={false} /> : <p>{node.content}</p>}
        <div className="card-actions">
          <button className="link-button" onClick={() => setReplying((value) => !value)}>Responder</button>
          <button className="link-button" onClick={() => setEditing(true)}>Editar</button>
          <button className="link-button danger" onClick={remove}>Eliminar</button>
          {node.replyCount > 0 && <span className={styles.replyCount}>{node.replyCount} {node.replyCount === 1 ? 'respuesta' : 'respuestas'}</span>}
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {replying && <CommentForm submitLabel="Publicar respuesta" onSubmit={reply} onCancel={() => setReplying(false)} />}
      </article>
      {node.children.length > 0 && (
        <ol className={styles.commentChildren}>
          {node.children.map((child) => <CommentItem key={child.id} node={child} onChanged={onChanged} />)}
        </ol>
      )}
    </li>
  )
}
