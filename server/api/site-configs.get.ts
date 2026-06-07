import { fetchSiteConfigsFromBackend } from '../utils/siteConfigs'

export default defineEventHandler(async (event) => {
  return await fetchSiteConfigsFromBackend(event)
})
