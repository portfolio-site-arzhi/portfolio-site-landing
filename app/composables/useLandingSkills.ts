import type { LandingSkillsResponse } from '../models/LandingSkill'
import type { SkillGroup } from '../models/SkillGroup'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { mapLandingSkillsToViewModel } from '../utils/landingSkillsMapper'

const fetchLandingSkills = async (
  backendUrl: string | undefined,
  failHardOnBackendError: boolean
): Promise<LandingSkillsResponse | null> => {
  if (!backendUrl) return null
  try {
    const url = new URL('/landing/skills', backendUrl).toString()
    return await $fetch<LandingSkillsResponse>(url)
  } catch {
    if (import.meta.server && failHardOnBackendError && backendUrl) {
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
    }
    return null
  }
}

export const useLandingSkills = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined
  const failHardOnBackendError = resolveFailHardOnBackendError(
    runtimeConfig.public.failHardOnBackendError,
    !import.meta.dev
  )
  const fallbackSkillGroups = useState<SkillGroup[]>('skillGroups', () => [])
  const { locale } = useI18n()

  const { data, pending, error, refresh } = useAsyncData<LandingSkillsResponse | null>(
    'landing-skills',
    async () => await fetchLandingSkills(backendUrl, failHardOnBackendError),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

  const skillGroups = computed<SkillGroup[]>(() => {
    const fromApi = data.value?.data
    if (Array.isArray(fromApi)) {
      if (fromApi.length === 0) return []
      return mapLandingSkillsToViewModel(fromApi, locale.value)
    }
    return fallbackSkillGroups.value
  })

  return {
    skillGroups,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
