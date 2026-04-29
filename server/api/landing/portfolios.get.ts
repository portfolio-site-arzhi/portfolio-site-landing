import { fetchLandingPortfoliosFromBackend } from '../../utils/landingPortfolios'

export default defineEventHandler(async (event) => {
  return await fetchLandingPortfoliosFromBackend(event)
})
