import { fetchLandingEducationsFromBackend } from '../../utils/landingCollections'

export default defineEventHandler(async (event) => {
  return await fetchLandingEducationsFromBackend(event)
})
