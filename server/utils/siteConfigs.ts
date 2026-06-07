import type { H3Event } from 'h3'
import type { SiteConfigsResponse } from '../../app/models/SiteConfig'
import { ensureSiteConfigsData } from '../../app/utils/siteConfig'
import { fetchFromBackend, getBackendUrl, resolveBackendAssetUrl } from './backendConfig'

const serviceUnavailableError = () => createError({ statusCode: 503, statusMessage: 'Service Unavailable' })

export const fetchSiteConfigsFromBackend = async (
  event: H3Event
): Promise<SiteConfigsResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) {
    return { data: ensureSiteConfigsData(null) }
  }

  try {
    const res = await fetchFromBackend<SiteConfigsResponse>(backendUrl, '/site-configs')
    const data = ensureSiteConfigsData(res?.data)

    return {
      data: {
        ...data,
        home: data.home
          ? {
              ...data.home,
              photo: resolveBackendAssetUrl(data.home.photo, backendUrl)
            }
          : null
      }
    }
  } catch {
    throw serviceUnavailableError()
  }
}
