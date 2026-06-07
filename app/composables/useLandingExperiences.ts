import type { Experience } from '../models/Experience'
import type { LandingExperiencesResponse } from '../models/LandingExperience'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { mapLandingExperiencesToViewModel } from '../utils/landingExperiencesMapper'

const fetchLandingExperiences = async (
  failHardOnBackendError: boolean
): Promise<LandingExperiencesResponse | null> => {
  try {
    return await $fetch<LandingExperiencesResponse>('/api/landing/experiences')
  } catch {
    if (import.meta.server && failHardOnBackendError) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

export const useLandingExperiences = () => {
  const runtimeConfig = useRuntimeConfig()
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackExperiences = useState<Experience[]>('experiences', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingExperiencesResponse | null>(
    'landing-experiences',
    async () => await fetchLandingExperiences(failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => !pending.value && data.value === null)

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

