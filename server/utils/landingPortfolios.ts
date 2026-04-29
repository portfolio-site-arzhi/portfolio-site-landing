import type { H3Event } from 'h3'
import type { LandingPortfolioDetailResponse, LandingPortfolioDto, LandingPortfoliosResponse } from '../../app/models/LandingPortfolio'
import { sanitizeLocalizedTextOrStringServer } from '../../app/utils/sanitizeHtml'

const getBackendUrl = (event: H3Event): string | undefined => {
  const config = useRuntimeConfig(event)
  const backendUrl = String(config.public.backendUrl || '').trim()
  return backendUrl || undefined
}

const getFetchErrorStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) return undefined
  const response = (error as { response?: { status?: unknown } }).response
  return typeof response?.status === 'number' ? response.status : undefined
}

const resolveBackendAssetUrl = (
  value: string | null | undefined,
  backendUrl: string
): string | null | undefined => {
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  try {
    return new URL(trimmed, backendUrl).toString()
  } catch {
    return trimmed
  }
}

const sanitizeLandingPortfolioDto = async (
  dto: LandingPortfolioDto,
  backendUrl: string
): Promise<LandingPortfolioDto> => {
  return {
    ...dto,
    image: resolveBackendAssetUrl(dto.image, backendUrl),
    contribution: await sanitizeLocalizedTextOrStringServer(dto.contribution),
    outcome: await sanitizeLocalizedTextOrStringServer(dto.outcome)
  }
}

export const fetchLandingPortfoliosFromBackend = async (
  event: H3Event
): Promise<LandingPortfoliosResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) return { data: [] }

  try {
    const url = new URL('/landing/portfolios', backendUrl).toString()
    const res = await $fetch<LandingPortfoliosResponse>(url)
    const data = Array.isArray(res?.data)
      ? await Promise.all(res.data.map(async (item) => await sanitizeLandingPortfolioDto(item, backendUrl)))
      : []

    return { data }
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
  }
}

export const fetchLandingPortfolioDetailFromBackend = async (
  event: H3Event,
  slug: string
): Promise<LandingPortfolioDetailResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl || !slug) return { data: null }

  try {
    const url = new URL(`/landing/portfolios/${slug}`, backendUrl).toString()
    const res = await $fetch<LandingPortfolioDetailResponse>(url)

    if (!res?.data) return { data: null }

    return {
      data: await sanitizeLandingPortfolioDto(res.data, backendUrl)
    }
  } catch (error) {
    if (getFetchErrorStatusCode(error) === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })
    }

    throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
  }
}
