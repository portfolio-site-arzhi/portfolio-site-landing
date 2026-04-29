import { describe, it, expect } from 'vitest'
import { buildSocialLinks, pickLocalizedText, resolveThemeColors } from '../../app/utils/siteConfig'

describe('siteConfig utils', () => {
  it('pickLocalizedText should pick direct locale value', () => {
    const value = { id: 'Halo', en: 'Hello' }
    expect(pickLocalizedText(value, 'en')).toBe('Hello')
    expect(pickLocalizedText(value, 'id')).toBe('Halo')
  })

  it('pickLocalizedText should fallback to id then en', () => {
    const value = { id: 'Halo' }
    expect(pickLocalizedText(value, 'en')).toBe('Halo')

    const value2 = { en: 'Hello' }
    expect(pickLocalizedText(value2, 'id')).toBe('Hello')
  })

  it('pickLocalizedText should return undefined for empty values', () => {
    expect(pickLocalizedText(null, 'id')).toBeUndefined()
    expect(pickLocalizedText(undefined, 'id')).toBeUndefined()
    expect(pickLocalizedText({ id: null, en: null }, 'id')).toBeUndefined()
  })

  it('buildSocialLinks should merge footer and about email over fallback', () => {
    const fallback = [
      { platform: 'GitHub', url: 'https://github.com/fallback', icon: 'mdi-github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/fallback', icon: 'mdi-linkedin' },
      { platform: 'Email', url: 'mailto:fallback@example.com', icon: 'mdi-email' }
    ]

    const socials = buildSocialLinks({
      footer: {
        github: 'https://github.com/new',
        linkedin: 'https://linkedin.com/in/new',
        instagram: 'https://instagram.com/new'
      },
      about: { email: 'new@example.com' },
      fallback
    })

    expect(socials).toEqual([
      { platform: 'GitHub', url: 'https://github.com/new', icon: 'mdi-github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/new', icon: 'mdi-linkedin' },
      { platform: 'Email', url: 'mailto:new@example.com', icon: 'mdi-email' },
      { platform: 'Instagram', url: 'https://instagram.com/new', icon: 'mdi-instagram' }
    ])
  })

  it('resolveThemeColors should use defaults when system is null', () => {
    expect(resolveThemeColors(null)).toEqual({ primary: '#1976D2', secondary: '#42A5F5' })
  })

  it('resolveThemeColors should fallback when colors are invalid', () => {
    expect(resolveThemeColors({ primary_color: 'red', secondary_color: '#12' })).toEqual({ primary: '#1976D2', secondary: '#42A5F5' })
  })

  it('resolveThemeColors should use system colors when valid', () => {
    expect(resolveThemeColors({ primary_color: '#111111', secondary_color: '#abcdef' })).toEqual({ primary: '#111111', secondary: '#abcdef' })
  })
})
