import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('landing collection loading', () => {
  it('keeps collection requests route-scoped across hydration', () => {
    const app = readFileSync(resolve(process.cwd(), 'app/app.vue'), 'utf8')
    const landingData = readFileSync(resolve(process.cwd(), 'app/composables/useLandingData.ts'), 'utf8')

    expect(app).not.toContain('useLandingCollectionPrefetch')
    expect(landingData).not.toContain('useLandingCollectionPrefetch')

    const routeCollections = [
      ['app/pages/experience.vue', 'useLandingExperiences()'],
      ['app/pages/education.vue', 'useLandingEducations()'],
      ['app/pages/certifications.vue', 'useLandingCertifications()'],
      ['app/pages/about.vue', 'useLandingSkills()'],
      ['app/pages/portfolio.vue', 'useLandingPortfolios()']
    ] as const

    for (const [pagePath, composableCall] of routeCollections) {
      const page = readFileSync(resolve(process.cwd(), pagePath), 'utf8')
      expect(page).toContain(composableCall)
    }
  })
})
