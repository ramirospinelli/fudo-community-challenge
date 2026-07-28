import { useState, type FormEvent } from 'react'
import type { PostInput } from '../types'
import { errorMessage } from '../utils/presentation'
import { isValidAvatarUrl } from '../utils/validation'
import styles from './Form.module.css'

const emptyPost: PostInput = { name: '', avatar: '', title: '', content: '' }

interface PostFormProps {
  initial?: PostInput
  submitLabel: string
  onSubmit: (input: PostInput) => Promise<void>
  onCancel?: () => void
}

export function PostForm({ initial = emptyPost, submitLabel, onSubmit, onCancel }: PostFormProps) {
  const [input, setInput] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = {
      ...input,
      name: input.name.trim(),
      title: input.title.trim(),
      content: input.content.trim(),
      avatar: input.avatar.trim(),
    }
    if (!clean.name || !clean.title || !clean.content) return setError('Completá los campos obligatorios.')
    if (!isValidAvatarUrl(clean.avatar)) return setError('Ingresá una URL HTTPS válida para el avatar.')
    setSaving(true)
    setError('')
    try {
      await onSubmit(clean)
      setInput(emptyPost)
    } catch (reason) {
      setError(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} aria-busy={saving}>
      <label>
        Nombre
        <input autoFocus value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })} required maxLength={80} />
      </label>
      <label>
        URL del avatar <span className={styles.optional}>(opcional)</span>
        <input type="url" value={input.avatar} onChange={(e) => setInput({ ...input, avatar: e.target.value })} placeholder="https://…" />
      </label>
      <label>
        Título
        <input value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} required minLength={3} maxLength={120} />
      </label>
      <label>
        Contenido
        <textarea value={input.content} onChange={(e) => setInput({ ...input, content: e.target.value })} required minLength={3} maxLength={2000} rows={5} />
      </label>
      {error && <p className={`error ${styles.formError}`} role="alert">{error}</p>}
      <div className={styles.actions}>
        <button className="primary" disabled={saving}>{saving ? 'Guardando…' : submitLabel}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}
