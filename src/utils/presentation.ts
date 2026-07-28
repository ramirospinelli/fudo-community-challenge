import { ApiError } from '../api/api'

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export function commentCreationErrorMessage(error: unknown): string {
  return error instanceof Error && [
    'Max number of elements reached for this resource!',
    '"Max number of elements reached for this resource!"',
  ].includes(error.message)
    ? 'No se pudo agregar el comentario porque la API de prueba alcanzó su capacidad máxima. Probá nuevamente más tarde.'
    : errorMessage(error)
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
