import { describe, it, expect } from 'vitest'
import type { LocalizedText } from '../../app/models/SiteConfig'
import { sanitizeLocalizedTextOrStringServer } from '../../app/utils/sanitizeHtml'

describe('sanitizeLocalizedTextOrStringServer', () => {
  it('should return nullish values as-is', async () => {
    await expect(sanitizeLocalizedTextOrStringServer(null, async (v) => String(v))).resolves.toBeNull()
    await expect(sanitizeLocalizedTextOrStringServer(undefined, async (v) => String(v))).resolves.toBeUndefined()
  })

  it('should sanitize plain strings', async () => {
    const sanitized = await sanitizeLocalizedTextOrStringServer('<p onclick="x()">Hi</p>', async (v) => `sanitized:${v}`)
    expect(sanitized).toBe('sanitized:<p onclick="x()">Hi</p>')
  })

  it('should sanitize LocalizedText objects (id/en)', async () => {
    const input: LocalizedText = { id: '<p>Halo</p>', en: '<p>Hello</p>' }

    const sanitized = await sanitizeLocalizedTextOrStringServer(input, async (v) => `sanitized:${String(v)}`)

    expect(sanitized).toEqual({
      id: 'sanitized:<p>Halo</p>',
      en: 'sanitized:<p>Hello</p>'
    })
  })

  it('should sanitize missing or non-string locales as empty strings', async () => {
    const input: LocalizedText = { id: null }

    const sanitized = await sanitizeLocalizedTextOrStringServer(input, async (v) => `sanitized:${String(v)}`)

    expect(sanitized).toEqual({
      id: 'sanitized:',
      en: 'sanitized:'
    })
  })
})
