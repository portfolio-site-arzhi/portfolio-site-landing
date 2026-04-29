import type { Certification } from '../models/Certification'
import type { LandingCertificationDto } from '../models/LandingCertification'
import type { LocalizedText } from '../models/SiteConfig'
import { formatExperiencePeriod } from './experiencePeriod'
import { pickLocalizedText } from './siteConfig'

const pickText = (
  value: LocalizedText | string | null | undefined,
  fallbackEn: string | null | undefined,
  locale: string
): string => {
  if (value && typeof value === 'object') {
    const localized = pickLocalizedText(value as LocalizedText, locale)
    if (localized) return String(localized).trim()
  }

  const idText = typeof value === 'string' ? value.trim() : ''
  const enText = typeof fallbackEn === 'string' ? fallbackEn.trim() : ''
  if (locale === 'en') return enText || idText
  return idText || enText
}

const resolveSortValue = (item: LandingCertificationDto): number => {
  if (typeof item.sort === 'number') return item.sort
  if (typeof item.sort_order === 'number') return item.sort_order
  return Number.POSITIVE_INFINITY
}

export const mapLandingCertificationsToViewModel = (items: LandingCertificationDto[], locale: string): Certification[] => {
  const normalized = Array.isArray(items) ? items : []

  return [...normalized]
    .sort((a, b) => {
      const sortA = resolveSortValue(a)
      const sortB = resolveSortValue(b)
      if (sortA !== sortB) return sortA - sortB
      return a.id - b.id
    })
    .map((item) => {
      const title = pickText(item.name, item.name_en, locale) || '—'
      const issuer = String(item.issuing_organization ?? '').trim() || '—'
      const credentialUrl = typeof item.credential_url === 'string' && item.credential_url.trim().length > 0
        ? item.credential_url.trim()
        : undefined

      const issuedAt = formatExperiencePeriod(
        {
          start_date: item.issue_date,
          end_date: null,
          is_current: false
        },
        locale
      )

      const descriptionRaw = pickText(item.description, item.description_en, locale)
      const description = descriptionRaw.trim() || undefined

      return {
        id: item.id,
        title,
        issuer,
        issuedAt,
        credentialUrl,
        description
      }
    })
}

