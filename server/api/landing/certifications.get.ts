import { fetchLandingCertificationsFromBackend } from '../../utils/landingCollections'

export default defineEventHandler(async (event) => {
  return await fetchLandingCertificationsFromBackend(event)
})
