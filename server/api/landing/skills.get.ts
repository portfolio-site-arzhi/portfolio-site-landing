import { fetchLandingSkillsFromBackend } from '../../utils/landingCollections'

export default defineEventHandler(async (event) => {
  return await fetchLandingSkillsFromBackend(event)
})
