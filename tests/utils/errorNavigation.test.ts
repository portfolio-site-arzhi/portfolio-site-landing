import { describe, expect, it } from 'vitest'
import { resolveErrorHomePath, resolveErrorRetryPath } from '../../app/utils/errorNavigation'

describe('errorNavigation utils', () => {
  it('resolves default locale home path to root', () => {
    expect(resolveErrorHomePath('/')).toBe('/')
    expect(resolveErrorHomePath('/test')).toBe('/')
  })

  it('preserves the english locale root when recovering from error routes', () => {
    expect(resolveErrorHomePath('/en')).toBe('/en')
    expect(resolveErrorHomePath('/en/test')).toBe('/en')
  })

  it('rebuilds retry paths with query strings and hashes', () => {
    expect(resolveErrorRetryPath('/test', '?tab=overview', '#section-1'))
      .toBe('/test?tab=overview#section-1')
  })

  it('normalizes retry paths without a leading slash', () => {
    expect(resolveErrorRetryPath('test')).toBe('/test')
    expect(resolveErrorRetryPath('')).toBe('/')
  })
})
