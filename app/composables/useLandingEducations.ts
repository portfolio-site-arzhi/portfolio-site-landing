import type { Education } from '../models/Education'
import type { LandingEducationsResponse } from '../models/LandingEducation'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { mapLandingEducationsToViewModel } from '../utils/landingEducationsMapper'

const fetchLandingEducations = async (
  failHardOnBackendError: boolean
): Promise<LandingEducationsResponse | null> => {
  try {
    return await $fetch<LandingEducationsResponse>('/api/landing/educations')
  } catch {
    if (import.meta.server && failHardOnBackendError) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

export const useLandingEducations = () => {
  const runtimeConfig = useRuntimeConfig()
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackEducations = useState<Education[]>('educations', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingEducationsResponse | null>(
    'landing-educations',
    async () => await fetchLandingEducations(failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => !pending.value && data.value === null)

  const educations = computed<Education[]>(() => {
    const fromApi = data.value?.data
    if (Array.isArray(fromApi)) {
      if (fromApi.length === 0) return []
      return mapLandingEducationsToViewModel(fromApi, locale.value)
    }
    return fallbackEducations.value
  })

  return {
    educations,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
