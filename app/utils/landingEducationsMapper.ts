import type { Education } from '../models/Education'
import type { LandingEducationDto } from '../models/LandingEducation'
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

const resolveSortValue = (item: LandingEducationDto): number => {
  if (typeof item.sort === 'number') return item.sort
  if (typeof item.sort_order === 'number') return item.sort_order
  return Number.POSITIVE_INFINITY
}

export const mapLandingEducationsToViewModel = (items: LandingEducationDto[], locale: string): Education[] => {
  const normalized = Array.isArray(items) ? items : []

  return [...normalized]
    .sort((a, b) => {
      const sortA = resolveSortValue(a)
      const sortB = resolveSortValue(b)
      if (sortA !== sortB) return sortA - sortB
      return a.id - b.id
    })
    .map((item) => {
      const institution = String(item.institution_name ?? '').trim() || '—'

      const degree = pickText(item.degree, item.degree_en, locale)
      const fieldOfStudy = pickText(item.field_of_study, item.field_of_study_en, locale)
      const program = [degree, fieldOfStudy].filter((part) => part.length > 0).join(' ') || '—'

      const endDate = typeof item.end_date === 'string' ? item.end_date.trim() : ''
      const isCurrent = !endDate
      const period = formatExperiencePeriod(
        {
          start_date: item.start_date,
          end_date: endDate || null,
          is_current: isCurrent
        },
        locale
      )

      const location = String(item.location ?? '').trim() || undefined

      const descriptionRaw = pickText(item.description, item.description_en, locale)
      const description = descriptionRaw.trim() || undefined

      return {
        id: item.id,
        institution,
        program,
        period,
        location,
        description
      }
    })
}

