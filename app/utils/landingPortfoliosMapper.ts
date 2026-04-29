import type { LandingPortfolioDto, LandingPortfolioLocalizedField, LandingPortfolioStackDto } from '../models/LandingPortfolio'
import type { Project } from '../models/Project'
import { resolvePortfolioImage } from './portfolioImage'
import { pickLocalizedText } from './siteConfig'

const normalizeText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  return text.length > 0 ? text : undefined
}

const pickLocalizedPortfolioField = (
  value: LandingPortfolioLocalizedField,
  locale: string
): string | undefined => {
  if (typeof value === 'string') return normalizeText(value)
  return pickLocalizedText(value, locale)
}

const sortStacks = (stacks: LandingPortfolioStackDto[] | null | undefined): LandingPortfolioStackDto[] => {
  if (!Array.isArray(stacks)) return []

  return [...stacks].sort((a, b) => {
    const leftOrder = typeof a.display_order === 'number' ? a.display_order : Number.MAX_SAFE_INTEGER
    const rightOrder = typeof b.display_order === 'number' ? b.display_order : Number.MAX_SAFE_INTEGER
    if (leftOrder !== rightOrder) return leftOrder - rightOrder
    return a.id - b.id
  })
}

export const mapLandingPortfolioToViewModel = (
  dto: LandingPortfolioDto,
  locale: string,
  fallbackId = 0
): Project => {
  const id = Number.isFinite(dto.id) ? dto.id : fallbackId
  const title = normalizeText(dto.title) || `Portfolio ${id || fallbackId || 1}`
  const description = pickLocalizedPortfolioField(dto.description, locale) || title
  const slug = normalizeText(dto.slug) || `portfolio-${id || fallbackId || 1}`
  const role = normalizeText(dto.role)
  const contribution = pickLocalizedPortfolioField(dto.contribution, locale)
  const outcome = pickLocalizedPortfolioField(dto.outcome, locale)
  const image = resolvePortfolioImage(dto.image)
  const link = normalizeText(dto.live_url)
  const github = normalizeText(dto.github_url)
  const stack = sortStacks(dto.stacks)
    .map((item) => normalizeText(item.name))
    .filter((value): value is string => Boolean(value))

  return {
    id: id || fallbackId || 1,
    slug,
    title,
    description,
    image,
    role,
    contribution,
    outcome,
    stack,
    link,
    github
  }
}

export const mapLandingPortfoliosToViewModel = (
  dtos: LandingPortfolioDto[] | null | undefined,
  locale: string
): Project[] => {
  if (!Array.isArray(dtos)) return []

  const sorted = [...dtos].sort((a, b) => {
    const leftOrder = typeof a.display_order === 'number' ? a.display_order : Number.MAX_SAFE_INTEGER
    const rightOrder = typeof b.display_order === 'number' ? b.display_order : Number.MAX_SAFE_INTEGER
    if (leftOrder !== rightOrder) return leftOrder - rightOrder
    return a.id - b.id
  })

  return sorted.map((dto, index) => mapLandingPortfolioToViewModel(dto, locale, index + 1))
}
