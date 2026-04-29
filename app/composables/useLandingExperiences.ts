import type { Experience } from '../models/Experience'
import type { LandingExperiencesResponse } from '../models/LandingExperience'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { sanitizeExperienceHtmlServer } from '../utils/experienceHtml'
import { mapLandingExperiencesToViewModel } from '../utils/landingExperiencesMapper'

const fetchLandingExperiences = async (
  backendUrl: string | undefined,
  failHardOnBackendError: boolean
): Promise<LandingExperiencesResponse | null> => {
  if (!backendUrl) return null
  try {
    const url = new URL('/landing/experiences', backendUrl).toString()
    const res = await $fetch<LandingExperiencesResponse>(url)
    if (!res?.data?.length) return res ?? null

    if (import.meta.client) return res

    const sanitized = await Promise.all(
      res.data.map(async (dto) => {
        const desc = dto.description
        if (!desc) return dto
        return {
          ...dto,
          description: {
            id: await sanitizeExperienceHtmlServer(desc.id ?? ''),
            en: await sanitizeExperienceHtmlServer(desc.en ?? '')
          }
        }
      })
    )

    return { data: sanitized }
  } catch {
    if (import.meta.server && failHardOnBackendError && backendUrl) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

export const useLandingExperiences = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackExperiences = useState<Experience[]>('experiences', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingExperiencesResponse | null>(
    'landing-experiences',
    async () => await fetchLandingExperiences(backendUrl, failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

  const experiences = computed<Experience[]>(() => {
    const fromApi = data.value?.data
    if (Array.isArray(fromApi)) {
      if (fromApi.length === 0) return []
      return mapLandingExperiencesToViewModel(fromApi, locale.value)
    }
    return fallbackExperiences.value
  })

  return {
    experiences,
    hasBackendError,
    pending,
    error,
    refresh
  }
}

