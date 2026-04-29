import type { Education } from '../models/Education'
import type { LandingEducationDto, LandingEducationsResponse } from '../models/LandingEducation'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { sanitizeEducationHtmlServer } from '../utils/educationHtml'
import { mapLandingEducationsToViewModel } from '../utils/landingEducationsMapper'
import { sanitizeLocalizedTextOrStringServer } from '../utils/sanitizeHtml'

const fetchLandingEducations = async (
  backendUrl: string | undefined,
  failHardOnBackendError: boolean
): Promise<LandingEducationsResponse | null> => {
  if (!backendUrl) return null
  try {
    const url = new URL('/landing/educations', backendUrl).toString()
    const res = await $fetch<LandingEducationsResponse>(url)
    if (!res?.data?.length) return res ?? null

    if (import.meta.client) return res

    const sanitized = await Promise.all(
      res.data.map(async (dto): Promise<LandingEducationDto> => {
        const nextDescription = await sanitizeLocalizedTextOrStringServer(dto.description)
        const nextDescriptionEn = typeof dto.description_en === 'string'
          ? await sanitizeEducationHtmlServer(dto.description_en)
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

export const useLandingEducations = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const { locale } = useI18n()
  const fallbackEducations = useState<Education[]>('educations', () => [])

  const { data, pending, error, refresh } = useAsyncData<LandingEducationsResponse | null>(
    'landing-educations',
    async () => await fetchLandingEducations(backendUrl, failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

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
