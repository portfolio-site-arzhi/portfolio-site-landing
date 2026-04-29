import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { LandingPortfolioDetailResponse, LandingPortfolioDto, LandingPortfoliosResponse } from '../models/LandingPortfolio'
import type { Project } from '../models/Project'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { mapLandingPortfolioToViewModel, mapLandingPortfoliosToViewModel } from '../utils/landingPortfoliosMapper'
import { createFallbackProjects } from '../utils/portfolioFallback'

type LandingPortfolioDetailState = {
  data: LandingPortfolioDto | null;
  notFound: boolean;
}

const getFetchErrorStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) return undefined
  const response = (error as { response?: { status?: unknown } }).response
  return typeof response?.status === 'number' ? response.status : undefined
}

const fetchLandingPortfolios = async (
  failHardOnBackendError: boolean
): Promise<LandingPortfoliosResponse | null> => {
  try {
    return await $fetch<LandingPortfoliosResponse>('/api/landing/portfolios')
  } catch {
    if (import.meta.server && failHardOnBackendError) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

const fetchLandingPortfolioDetail = async (
  slug: string,
  failHardOnBackendError: boolean
): Promise<LandingPortfolioDetailState> => {
  if (!slug) return { data: null, notFound: true }

  try {
    const res = await $fetch<LandingPortfolioDetailResponse>(`/api/landing/portfolios/${slug}`)
    return {
      data: res?.data ?? null,
      notFound: false
    }
  } catch (error) {
    if (getFetchErrorStatusCode(error) === 404) {
      return { data: null, notFound: true }
    }

    if (import.meta.server && failHardOnBackendError) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }

    return { data: null, notFound: false }
  }
}

export const useLandingPortfolios = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim()
  const backendConfigured = backendUrl.length > 0
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackProjects = useState<Project[]>('portfolio-fallback-projects', createFallbackProjects)

  const { data, pending, error, refresh } = useAsyncData<LandingPortfoliosResponse | null>(
    'landing-portfolios',
    async () => {
      if (!backendConfigured) return { data: [] }
      return await fetchLandingPortfolios(failHardOnBackendError)
    },
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const projects = computed<Project[]>(() => {
    if (!backendConfigured) return fallbackProjects.value

    const fromApi = data.value?.data
    if (Array.isArray(fromApi)) {
      if (fromApi.length === 0) return []
      return mapLandingPortfoliosToViewModel(fromApi, locale.value)
    }

    return []
  })

  const hasBackendError = computed(() => backendConfigured && !pending.value && data.value === null)

  return {
    projects,
    hasBackendError,
    pending,
    error,
    refresh
  }
}

export const useLandingPortfolioDetail = async (slugInput: MaybeRefOrGetter<string>) => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim()
  const backendConfigured = backendUrl.length > 0
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackProjects = useState<Project[]>('portfolio-fallback-projects', createFallbackProjects)
  const slug = computed(() => {
    const value = toValue(slugInput)
    return typeof value === 'string' ? value.trim() : ''
  })

  const { data, pending, error, refresh } = await useAsyncData<LandingPortfolioDetailState>(
    computed(() => `landing-portfolio-${slug.value || 'missing'}`),
    async () => {
      if (!backendConfigured) {
        return {
          data: null,
          notFound: false
        }
      }

      return await fetchLandingPortfolioDetail(slug.value, failHardOnBackendError)
    },
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => ({ data: null, notFound: false })
    }
  )

  const project = computed<Project | null>(() => {
    if (!backendConfigured) {
      return fallbackProjects.value.find((item) => item.slug === slug.value) ?? null
    }

    if (!data.value.data) return null
    return mapLandingPortfolioToViewModel(data.value.data, locale.value)
  })

  const notFound = computed(() => {
    if (!backendConfigured) return project.value === null
    return data.value.notFound
  })

  const hasBackendError = computed(() =>
    backendConfigured && !pending.value && data.value.data === null && !data.value.notFound
  )

  return {
    project,
    notFound,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
