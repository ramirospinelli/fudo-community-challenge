import { useState, type FormEvent } from 'react'
import type { CommentInput } from '../types'
import { commentCreationErrorMessage, errorMessage } from '../utils/presentation'
import { isValidAvatarUrl } from '../utils/validation'
import styles from './Form.module.css'

const emptyComment: CommentInput = { name: '', avatar: '', content: '', parentId: null }

interface CommentFormProps {
  initial?: CommentInput
  submitLabel: string
  onSubmit: (input: CommentInput) => Promise<void>
  onCancel?: () => void
  mapCreationCapacityError?: boolean
}

export function CommentForm({ initial = emptyComment, submitLabel, onSubmit, onCancel, mapCreationCapacityError = true }: CommentFormProps) {
  const [input, setInput] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = {
      ...input,
      name: input.name.trim(),
      avatar: input.avatar.trim(),
      content: input.content.trim(),
    }
    if (!clean.name || !clean.content) return setError('Ingresá tu nombre y comentario.')
    if (!isValidAvatarUrl(clean.avatar)) return setError('Ingresá una URL HTTPS válida para el avatar.')
    setSaving(true)
    setError('')
    try {
      await onSubmit(clean)
      setInput(emptyComment)
    } catch (reason) {
      setError(mapCreationCapacityError ? commentCreationErrorMessage(reason) : errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={`${styles.form} ${styles.compact}`} onSubmit={submit} aria-busy={saving}>
      <div className={styles.formRow}>
        <label>
          Nombre
          <input autoFocus value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })} required maxLength={80} />
        </label>
        <label>
          URL del avatar <span className={styles.optional}>(opcional)</span>
          <input type="url" value={input.avatar} onChange={(e) => setInput({ ...input, avatar: e.target.value })} />
        </label>
      </div>
      <label>
        Comentario
        <textarea value={input.content} onChange={(e) => setInput({ ...input, content: e.target.value })} required maxLength={1000} rows={3} />
      </label>
      {error && <p className={`error ${styles.formError}`} role="alert">{error}</p>}
      <div className={styles.actions}>
        <button className="primary" disabled={saving}>{saving ? 'Guardando…' : submitLabel}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}
