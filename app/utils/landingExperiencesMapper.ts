import type { Experience } from '../models/Experience'
import type { LandingExperienceDto } from '../models/LandingExperience'
import { pickLocalizedText } from './siteConfig'
import { formatExperiencePeriod } from './experiencePeriod'

export const mapLandingExperiencesToViewModel = (items: LandingExperienceDto[], locale: string): Experience[] => {
  const normalized = Array.isArray(items) ? items : []

  return [...normalized]
    .sort((a, b) => {
      const sortA = typeof a.sort === 'number' ? a.sort : Number.POSITIVE_INFINITY
      const sortB = typeof b.sort === 'number' ? b.sort : Number.POSITIVE_INFINITY
      if (sortA !== sortB) return sortA - sortB
      return a.id - b.id
    })
    .map((item) => {
      const role = pickLocalizedText(item.role, locale) ?? ''
      const descriptionRaw = pickLocalizedText(item.description, locale) ?? ''
      const description = String(descriptionRaw).trim()
      const company = String(item.company_name ?? '').trim() || '—'
      const skills = (item.skills ?? [])
        .slice()
        .sort((a, b) => {
          const sortA = typeof a.sort === 'number' ? a.sort : Number.POSITIVE_INFINITY
          const sortB = typeof b.sort === 'number' ? b.sort : Number.POSITIVE_INFINITY
          if (sortA !== sortB) return sortA - sortB
          return a.id - b.id
        })
        .map((s) => s.skill_name)
        .filter((s) => typeof s === 'string' && s.trim().length > 0)

      return {
        id: item.id,
        role,
        company,
        period: formatExperiencePeriod(item, locale),
        description,
        skills
      }
    })
}

