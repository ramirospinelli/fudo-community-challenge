import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const config = readFileSync(new URL('./nginx.conf', import.meta.url), 'utf8')

describe('Nginx SPA configuration', () => {
  it('falls back to index.html while missing static assets return 404', () => {
    expect(config).toContain('try_files $uri $uri/ /index.html;')
    expect(config).toContain('location ~* \\.(?:css|js|mjs|map|json|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|eot)$')
    expect(config).toContain('try_files $uri =404;')
  })
})
