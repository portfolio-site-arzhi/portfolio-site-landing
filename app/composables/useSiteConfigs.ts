import type { SiteConfigsData, SiteConfigsResponse } from '../models/SiteConfig'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { ensureSiteConfigsData } from '../utils/siteConfig'

const fetchSiteConfigs = async (backendUrl: string | undefined): Promise<SiteConfigsResponse | null> => {
  if (!backendUrl) return null
  try {
    const url = new URL('/site-configs', backendUrl).toString()
    return await $fetch<SiteConfigsResponse>(url)
  } catch {
    return null
  }
}

export const useSiteConfigs = () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined

  const { data, pending, error, refresh } = useAsyncData<SiteConfigsResponse | null>(
    'site-configs',
    async () => await fetchSiteConfigs(backendUrl),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const siteConfigs = computed<SiteConfigsData>(() => ensureSiteConfigsData(data.value?.data))
  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

  return {
    siteConfigs,
    hasBackendError,
    pending,
    error,
    refresh
  }
}

export const useSiteConfigsReady = async () => {
  const runtimeConfig = useRuntimeConfig()
  const backendUrl = String(runtimeConfig.public.backendUrl || '').trim() || undefined

  const { data, pending, error, refresh } = await useAsyncData<SiteConfigsResponse | null>(
    'site-configs',
    async () => await fetchSiteConfigs(backendUrl),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const siteConfigs = computed<SiteConfigsData>(() => ensureSiteConfigsData(data.value?.data))
  const hasBackendError = computed(() => Boolean(backendUrl) && !pending.value && data.value === null)

  return {
    siteConfigs,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
