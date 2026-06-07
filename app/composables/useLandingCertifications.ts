import type { Certification } from '../models/Certification'
import type { LandingCertificationsResponse } from '../models/LandingCertification'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { mapLandingCertificationsToViewModel } from '../utils/landingCertificationsMapper'

const fetchLandingCertifications = async (
  failHardOnBackendError: boolean
): Promise<LandingCertificationsResponse | null> => {
  try {
    return await $fetch<LandingCertificationsResponse>('/api/landing/certifications')
  } catch {
    if (import.meta.server && failHardOnBackendError) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

export const useLandingCertifications = () => {
  const runtimeConfig = useRuntimeConfig()
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackCertifications = useState<Certification[]>('certifications', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingCertificationsResponse | null>(
    'landing-certifications',
    async () => await fetchLandingCertifications(failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => !pending.value && data.value === null)

  const certifications = computed<Certification[]>(() => {
    const fromApi = data.value?.data
    if (Array.isArray(fromApi)) {
      if (fromApi.length === 0) return []
      return mapLandingCertificationsToViewModel(fromApi, locale.value)
    }
    return fallbackCertifications.value
  })

  return {
    certifications,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
