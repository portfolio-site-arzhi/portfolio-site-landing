import { describe, it, expect } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils/e2e'

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

  it.each([
    ['/', 'Halo, saya'],
    ['/about', 'Tentang Saya'],
    ['/experience', 'Pengalaman'],
    ['/education', 'Pendidikan'],
    ['/certifications', 'Sertifikasi'],
    ['/portfolio', 'Portfolio']
  ])('serves %s with navigation, main content, and SEO metadata', async (path, expectedCopy) => {
    const html = await $fetch(path)
    expect(html).toContain(expectedCopy)
    expect(html).toContain('id="main-content"')
    expect(html).toContain('Lewati ke konten utama')
    expect(html).toContain('href="/portfolio"')
    expect(html).toMatch(/<meta[^>]+name="description"/)
    expect(html).toMatch(/<title>[^<]+<\/title>/)
  })

  it('renders the complete portfolio showcase in SSR HTML', async () => {
    const html = await $fetch('/portfolio')
    expect(html).toContain('portfolio-showcase__record')
    expect(html).toContain('/portfolio/ecommerce-dashboard')
    expect(html).toContain('/portfolio/task-management-app')
    expect(html).toContain('https://github.com')
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
    expect(html).toContain('property="og:title"')
    expect(html).toContain('property="og:description"')
    expect(html).toContain('property="og:image"')
    expect(html).toContain('href="/portfolio"')
  })

  it('keeps /cv as a permanent redirect to experience', async () => {
    const response = await fetch('/cv', { redirect: 'manual' })
    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe('/experience')
  })

  it('renders the editorial error page with recovery actions', async () => {
    const response = await fetch('/route-that-does-not-exist', {
      headers: { accept: 'text/html' }
    })
    const html = await response.text()
    expect(response.status).toBe(404)
    expect(html).toContain('Terjadi kesalahan')
    expect(html).toContain('Coba lagi')
    expect(html).toContain('Kembali ke Beranda')
  })
})
