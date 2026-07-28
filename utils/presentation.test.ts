import { describe, expect, it } from 'vitest'
import { ApiError } from '../api/api'
import { commentCreationErrorMessage, isNotFoundError } from './presentation'

describe('commentCreationErrorMessage', () => {
  it('maps the mock API capacity error', () => {
    expect(commentCreationErrorMessage(new Error('Max number of elements reached for this resource!'))).toBe(
      'No se pudo agregar el comentario porque la API de prueba alcanzó su capacidad máxima. Probá nuevamente más tarde.',
    )
  })

  it('maps the quoted mock API capacity error', () => {
    expect(commentCreationErrorMessage(new Error('"Max number of elements reached for this resource!"'))).toBe(
      'No se pudo agregar el comentario porque la API de prueba alcanzó su capacidad máxima. Probá nuevamente más tarde.',
    )
  })

  it('keeps other API errors unchanged', () => {
    expect(commentCreationErrorMessage(new Error('Max number of elements reached for this resource'))).toBe(
      'Max number of elements reached for this resource',
    )
  })
})

describe('isNotFoundError', () => {
  it('identifies only HTTP 404 API errors', () => {
    expect(isNotFoundError(new ApiError('Not found', 404))).toBe(true)
    expect(isNotFoundError(new ApiError('Server error', 500))).toBe(false)
    expect(isNotFoundError(new Error('Not found'))).toBe(false)
  })
})
