import { useState } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  src: string
  name: string
}

export function Avatar({ src, name }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState('')

  return src && failedSrc !== src ? (
    <img className={styles.avatar} src={src} alt={`Avatar de ${name}`} onError={() => setFailedSrc(src)} />
  ) : (
    <span className={`${styles.avatar} ${styles.fallback}`} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  )
}
