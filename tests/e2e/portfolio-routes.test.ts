import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('portfolio detail routes', async () => {
  await setup({
    env: {
      NUXT_PUBLIC_BACKEND_URL: '',
      NUXT_PUBLIC_FAIL_HARD_ON_BACKEND_ERROR: ''
    }
  })

  it('prefetches portfolio list payload on non-portfolio routes', async () => {
    const html = await $fetch('/about')
    expect(html).toContain('landing-portfolios')
  })

  it('serves /portfolio/ecommerce-dashboard on direct request', async () => {
    const html = await $fetch('/portfolio/ecommerce-dashboard')
    expect(html).toContain('Dashboard E-Commerce')
    expect(html).toContain('Merancang arsitektur informasi dashboard')
    expect(html).not.toContain('Buka halaman detail untuk melihat peran, kontribusi, dan stack tiap project.')
    expect(html).toContain('https://github.com')
    expect(html).toContain('https://example.com')
    expect(html).toContain('portfolio-hero-image')
    expect(html).toContain('layout-offset-fallback')
  })
})
