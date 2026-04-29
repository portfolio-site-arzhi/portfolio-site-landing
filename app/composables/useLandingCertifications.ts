import type { Certification } from '../models/Certification'
import type { LandingCertificationDto, LandingCertificationsResponse } from '../models/LandingCertification'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { sanitizeCertificationHtmlServer } from '../utils/certificationHtml'
import { mapLandingCertificationsToViewModel } from '../utils/landingCertificationsMapper'
import { sanitizeLocalizedTextOrStringServer } from '../utils/sanitizeHtml'

const fetchLandingCertifications = async (
  backendUrl: string | undefined,
  failHardOnBackendError: boolean
): Promise<LandingCertificationsResponse | null> => {
  if (!backendUrl) return null
  try {
    const url = new URL('/landing/certifications', backendUrl).toString()
    const res = await $fetch<LandingCertificationsResponse>(url)
    if (!res?.data?.length) return res ?? null

    if (import.meta.client) return res

    const sanitized = await Promise.all(
      res.data.map(async (dto): Promise<LandingCertificationDto> => {
        const nextDescription = await sanitizeLocalizedTextOrStringServer(dto.description)
        const nextDescriptionEn = typeof dto.description_en === 'string'
          ? await sanitizeCertificationHtmlServer(dto.description_en)
          : dto.description_en
        return {
          ...dto,
          description: nextDescription,
          description_en: nextDescriptionEn
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

export const useLandingCertifications = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackCertifications = useState<Certification[]>('certifications', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingCertificationsResponse | null>(
    'landing-certifications',
    async () => await fetchLandingCertifications(backendUrl, failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

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
