import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    hookTimeout: 480_000,
    testTimeout: 480_000,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/utils/**/*.{test,spec}.ts'],
          environment: 'happy-dom'
        }
      },
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
