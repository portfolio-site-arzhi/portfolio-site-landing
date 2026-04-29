import { describe, it, expect } from 'vitest'
import { sanitizeEducationHtmlServer } from '../../app/utils/educationHtml'
import { mapLandingEducationsToViewModel } from '../../app/utils/landingEducationsMapper'

describe('landing educations mapper', () => {
  it('sanitizeEducationHtmlServer should remove scripts and inline handlers', async () => {
    const html = '<p onclick="alert(1)">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'
    const sanitized = await sanitizeEducationHtmlServer(html)
    expect(sanitized).toContain('<p>Hi</p>')
    expect(sanitized).not.toContain('onclick')
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('javascript:')
  })

  it('mapLandingEducationsToViewModel should localize, cover nulls, and sort', () => {
    const mapped = mapLandingEducationsToViewModel(
      [
        {
          id: 2,
          sort_order: 2,
          institution_name: 'Institut B',
          degree: { id: 'Sarjana', en: 'Bachelor' },
          field_of_study: { id: 'Informatika', en: 'Computer Science' },
          start_date: '2018-08-01',
          end_date: '2022-07-01',
          description: { id: '<p>Desc ID</p>', en: '<p>Desc EN</p>' },
          location: null
        },
        {
          id: 1,
          sort_order: 1,
          institution_name: 'Institut A',
          degree: 'S1',
          degree_en: 'Bachelor',
          field_of_study: 'Teknik',
          field_of_study_en: 'Engineering',
          start_date: '2023-01-01',
          end_date: null,
          description: '<p>Ongoing</p>',
          location: 'Bandung'
        }
      ],
      'id'
    )

    expect(mapped[0]?.id).toBe(1)
    expect(mapped[0]?.program).toBe('S1 Teknik')
    expect(mapped[0]?.period).toBe('Januari 2023 - Sekarang')
    expect(mapped[0]?.location).toBe('Bandung')
    expect(mapped[0]?.description).toBe('<p>Ongoing</p>')

    expect(mapped[1]?.id).toBe(2)
    expect(mapped[1]?.program).toBe('Sarjana Informatika')
    expect(mapped[1]?.period).toBe('Agustus 2018 - Juli 2022')
    expect(mapped[1]?.location).toBeUndefined()
    expect(mapped[1]?.description).toBe('<p>Desc ID</p>')
  })
})

