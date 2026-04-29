import { describe, it, expect } from 'vitest'
import { sanitizeExperienceHtmlServer, stripHtmlToText } from '../../app/utils/experienceHtml'
import { formatExperiencePeriod } from '../../app/utils/experiencePeriod'
import { mapLandingExperiencesToViewModel } from '../../app/utils/landingExperiencesMapper'

describe('landing experiences mapper', () => {
  it('sanitizeExperienceHtmlServer should remove scripts and inline handlers', async () => {
    const html = '<p onclick="alert(1)">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'
    const sanitized = await sanitizeExperienceHtmlServer(html)
    expect(sanitized).toContain('<p>Hi</p>')
    expect(sanitized).not.toContain('onclick')
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('javascript:')
  })

  it('stripHtmlToText should extract text content', () => {
    expect(stripHtmlToText('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
  })

  it('formatExperiencePeriod should format month-year range', () => {
    expect(formatExperiencePeriod({ start_date: '2023-07-01', end_date: null, is_current: true }, 'id')).toBe('Juli 2023 - Sekarang')
    expect(formatExperiencePeriod({ start_date: '2023-07-01', end_date: null, is_current: true }, 'en')).toBe('July 2023 - Present')
    expect(formatExperiencePeriod({ start_date: '2021-01-01', end_date: '2023-12-01', is_current: false }, 'en')).toBe('January 2021 - December 2023')
  })

  it('mapLandingExperiencesToViewModel should localize and sort', () => {
    const mapped = mapLandingExperiencesToViewModel(
      [
        {
          id: 2,
          sort: 2,
          role: { id: 'Frontend Dev', en: 'Frontend Dev' },
          company_name: 'B',
          start_date: '2021-01-01',
          end_date: '2023-01-01',
          is_current: false,
          description: { id: '<p>Desc 2</p>', en: '<p>Desc 2</p>' },
          skills: [
            { id: 1, skill_name: 'Vue', sort: 2 },
            { id: 2, skill_name: 'Nuxt', sort: 1 }
          ]
        },
        {
          id: 1,
          sort: 1,
          role: { id: 'Senior', en: 'Senior' },
          company_name: 'A',
          start_date: '2023-07-01',
          end_date: null,
          is_current: true,
          description: { id: '<p>Hi</p>', en: '<p>Hi</p>' },
          skills: [{ id: 3, skill_name: 'TypeScript', sort: 1 }]
        }
      ],
      'id'
    )

    expect(mapped[0]?.id).toBe(1)
    expect(mapped[0]?.period).toBe('Juli 2023 - Sekarang')
    expect(mapped[0]?.description).toBe('<p>Hi</p>')
    expect(mapped[1]?.skills).toEqual(['Nuxt', 'Vue'])
  })
})
