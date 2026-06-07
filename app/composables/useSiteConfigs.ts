import type { SiteConfigsData, SiteConfigsResponse } from '../models/SiteConfig'
import { getCachedDataFromPayload } from '../utils/asyncDataCache'
import { ensureSiteConfigsData } from '../utils/siteConfig'

const fetchSiteConfigs = async (): Promise<SiteConfigsResponse | null> => {
  try {
    return await $fetch<SiteConfigsResponse>('/api/site-configs')
  } catch {
    return null
  }
}

export const useSiteConfigs = () => {
  const { data, pending, error, refresh } = useAsyncData<SiteConfigsResponse | null>(
    'site-configs',
    async () => await fetchSiteConfigs(),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const siteConfigs = computed<SiteConfigsData>(() => ensureSiteConfigsData(data.value?.data))
  const hasBackendError = computed(() => !pending.value && data.value === null)

  return {
    siteConfigs,
    hasBackendError,
    pending,
    error,
    refresh
  }
}

export const useSiteConfigsReady = async () => {
  const { data, pending, error, refresh } = await useAsyncData<SiteConfigsResponse | null>(
    'site-configs',
    async () => await fetchSiteConfigs(),
    {
      server: true,
      getCachedData: getCachedDataFromPayload,
      default: () => null
    }
  )

  const siteConfigs = computed<SiteConfigsData>(() => ensureSiteConfigsData(data.value?.data))
  const hasBackendError = computed(() => !pending.value && data.value === null)

  return {
    siteConfigs,
    hasBackendError,
    pending,
    error,
    refresh
  }
}
