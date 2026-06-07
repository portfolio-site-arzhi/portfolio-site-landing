import { fetchLandingExperiencesFromBackend } from '../../utils/landingCollections'

export default defineEventHandler(async (event) => {
  return await fetchLandingExperiencesFromBackend(event)
})
