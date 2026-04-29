import type { LandingSkillGroupDto, LandingSkillName, SortableLandingSkill } from '../models/LandingSkill'
import type { SkillGroup } from '../models/SkillGroup'
import { pickLocalizedText } from './siteConfig'

const resolveOrder = (item: SortableLandingSkill): number => {
  if (typeof item.display_order === 'number') return item.display_order
  if (typeof item.sort === 'number') return item.sort
  return Number.POSITIVE_INFINITY
}

const sortByOrderThenId = <T extends SortableLandingSkill>(a: T, b: T): number => {
  const orderA = resolveOrder(a)
  const orderB = resolveOrder(b)
  if (orderA !== orderB) return orderA - orderB
  return a.id - b.id
}

const resolveSkillName = (value: LandingSkillName, locale: string): string => {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const localized = pickLocalizedText(value, locale)
  return String(localized ?? '').trim()
}

export const mapLandingSkillsToViewModel = (items: LandingSkillGroupDto[], locale: string): SkillGroup[] => {
  const normalized = Array.isArray(items) ? items : []

  return [...normalized]
    .sort(sortByOrderThenId)
    .map((group) => {
      const skills = (group.skills ?? [])
        .slice()
        .sort(sortByOrderThenId)
        .map((skill) => resolveSkillName(skill.name, locale))
        .filter((name) => name.length > 0)

      return {
        id: group.id,
        name: resolveSkillName(group.name, locale),
        skills
      }
    })
    .filter((group) => group.name.length > 0 || group.skills.length > 0)
}
