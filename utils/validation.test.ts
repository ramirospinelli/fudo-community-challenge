import { describe, expect, it } from 'vitest'
import { isValidAvatarUrl } from './validation'

describe('isValidAvatarUrl', () => {
  it.each(['', 'https://example.com/avatar.png', 'https://cdn.example.com/a?size=48'])('accepts optional or HTTPS avatar URLs: %s', (value) => {
    expect(isValidAvatarUrl(value)).toBe(true)
  })

  it.each(['http://example.com/avatar.png', 'ftp://example.com/avatar.png', 'not a url', 'https://'])('rejects non-HTTPS or malformed avatar URLs: %s', (value) => {
    expect(isValidAvatarUrl(value)).toBe(false)
  })
})
