import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

const componentProject = await defineVitestProject({
  test: {
    name: 'components',
    include: [
      'tests/utils/revealOnView.test.ts',
      'tests/utils/portfolioShowcase.test.ts',
      'tests/utils/defaultLayout.test.ts'
    ],
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    }
  }
})

export default defineConfig({
  test: {
    hookTimeout: 480_000,
    testTimeout: 480_000,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/utils/**/*.{test,spec}.ts'],
          exclude: [
            'tests/utils/revealOnView.test.ts',
            'tests/utils/portfolioShowcase.test.ts',
            'tests/utils/defaultLayout.test.ts'
          ],
          environment: 'happy-dom'
        }
      },
      componentProject,
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/**/*.{test,spec}.ts'],
          environment: 'node',
          hookTimeout: 480_000,
          testTimeout: 480_000
        }
      }
    ]
  }
})
