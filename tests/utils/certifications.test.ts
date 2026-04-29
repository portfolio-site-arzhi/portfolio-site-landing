import { describe, it, expect } from 'vitest'
import { sanitizeCertificationHtmlServer } from '../../app/utils/certificationHtml'
import { mapLandingCertificationsToViewModel } from '../../app/utils/landingCertificationsMapper'

describe('landing certifications mapper', () => {
  it('sanitizeCertificationHtmlServer should remove scripts and inline handlers', async () => {
    const html = '<p onclick="alert(1)">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'
    const sanitized = await sanitizeCertificationHtmlServer(html)
    expect(sanitized).toContain('<p>Hi</p>')
    expect(sanitized).not.toContain('onclick')
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('javascript:')
  })

  it('mapLandingCertificationsToViewModel should localize, cover nulls, and sort', () => {
    const mapped = mapLandingCertificationsToViewModel(
      [
        {
          id: 2,
          sort: 2,
          name: { id: 'Sertifikasi', en: 'Certification' },
          issuing_organization: 'Org B',
          issue_date: '2024-01-01',
          description: { id: '<p>Desc</p>', en: '<p>Desc</p>' },
          credential_url: 'https://example.com'
        },
        {
          id: 1,
          sort: 1,
          name: 'Sertifikasi 1',
          name_en: 'Certification 1',
          issuing_organization: null,
          issue_date: '2023-07-01',
          description: null
        }
      ],
      'en'
    )

    expect(mapped[0]?.id).toBe(1)
    expect(mapped[0]?.title).toBe('Certification 1')
    expect(mapped[0]?.issuer).toBe('—')
    expect(mapped[0]?.issuedAt).toBe('July 2023')
    expect(mapped[0]?.credentialUrl).toBeUndefined()
    expect(mapped[0]?.description).toBeUndefined()

    expect(mapped[1]?.id).toBe(2)
    expect(mapped[1]?.title).toBe('Certification')
    expect(mapped[1]?.issuer).toBe('Org B')
    expect(mapped[1]?.issuedAt).toBe('January 2024')
    expect(mapped[1]?.credentialUrl).toBe('https://example.com')
    expect(mapped[1]?.description).toBe('<p>Desc</p>')
  })
})

