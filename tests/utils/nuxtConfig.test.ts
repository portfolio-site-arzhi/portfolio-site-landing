import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('nuxt.config favicon', () => {
  it('merender favicon ico melalui static app head', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')

    expect(nuxtConfig).toMatch(/key: 'site-favicon',[\s\S]*rel: 'icon',[\s\S]*type: 'image\/x-icon',[\s\S]*href: '\/favicon\.ico\?v=bf68864d'/)
  })

  it('menyediakan identitas workspace Jam tanpa memuat capture pada kunjungan biasa', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')

    expect(nuxtConfig).toContain("name: 'jam:team'")
    expect(nuxtConfig).toContain("content: 'e2cd76f8-c843-48c9-86a6-35706fa653de'")
    expect(nuxtConfig).toContain("name: 'jam:blur'")
    expect(nuxtConfig).not.toContain("src: 'https://js.jam.dev/recorder.js'")
    expect(nuxtConfig).not.toContain("src: 'https://js.jam.dev/capture.js'")
  })

  it('menjaga offset SSR sama dengan tinggi app bar tanpa stylesheet Vuetify duplikat', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')

    expect(nuxtConfig).toContain(':root{--app-bar-fallback:72px}')
    expect(nuxtConfig).not.toContain('vuetify-styles-direct')
    expect(nuxtConfig).not.toContain("key: 'geist-font-direct'")
  })

  it('melakukan preload Geist latin sebelum first paint', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')
    const font = readFileSync(resolve(process.cwd(), 'public/fonts/geist-latin-variable-v5.woff2'))

    expect(nuxtConfig).toMatch(/key: 'geist-latin-preload',[\s\S]*rel: 'preload',[\s\S]*href: '([\w/-]+\.woff2)',[\s\S]*as: 'font',[\s\S]*type: 'font\/woff2'/)
    expect(nuxtConfig).toContain("font-display:block")
    expect(nuxtConfig).toContain("src:url('/fonts/geist-latin-variable-v5.woff2')")
    expect(font.byteLength).toBeGreaterThan(0)
  })

  it('meng-inline critical shell agar first paint sudah memiliki layout dasar', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')

    expect(nuxtConfig).toContain("new URL('./app/assets/styles/critical.css', import.meta.url)")
    expect(nuxtConfig).toContain("key: 'critical-shell'")
    expect(nuxtConfig).toContain('innerHTML: criticalStyles')
  })

  it('menyamakan metrik first paint dengan style setelah hydration', () => {
    const criticalCss = readFileSync(resolve(process.cwd(), 'app/assets/styles/critical.css'), 'utf8')
    const editorialCss = readFileSync(resolve(process.cwd(), 'app/assets/styles/editorial.css'), 'utf8')
    const layout = readFileSync(resolve(process.cwd(), 'app/layouts/default.vue'), 'utf8')
    const home = readFileSync(resolve(process.cwd(), 'app/pages/index.vue'), 'utf8')

    expect(criticalCss).toMatch(/html \{[\s\S]*overflow-y: scroll;[\s\S]*scrollbar-gutter: stable;/)
    expect(editorialCss).toMatch(/html \{[\s\S]*overflow-y: scroll;[\s\S]*scrollbar-gutter: stable;/)
    expect(criticalCss).toMatch(/body \{[^}]*overflow-x: clip;/)
    expect(editorialCss).toMatch(/body \{[^}]*overflow-x: clip;/)
    expect(criticalCss).toMatch(/html,[\s\S]*#__nuxt \{[^}]*min-width: 0;/)
    expect(editorialCss).toMatch(/html \{[^}]*min-width: 0 !important;/)
    expect(editorialCss).toMatch(/body \{[^}]*min-width: 0 !important;/)
    expect(editorialCss).toMatch(/#__nuxt \{[^}]*min-width: 0 !important;/)
    expect(layout).toMatch(/\.site-layout \{[^}]*min-height: 100vh;[^}]*flex-direction: column;[^}]*overflow: visible !important;/)
    expect(layout).toContain('<v-layout class="site-layout">')
    expect(criticalCss).toContain('.site-drawer:not(.v-navigation-drawer--active)')
    expect(criticalCss).not.toMatch(/\.site-drawer \{[^}]*display: none !important;/)
    expect(criticalCss).toMatch(/\.v-app-bar\.site-app-bar \{[^}]*position: fixed !important;/)
    expect(editorialCss).toMatch(/\.site-app-bar \{[^}]*position: fixed !important;/)
    expect(editorialCss).toMatch(/html:has\(\.site-drawer\.v-navigation-drawer--active\) \{[^}]*overflow: hidden !important;[^}]*overscroll-behavior: none;/)
    expect(editorialCss).toMatch(/\.site-drawer \.v-navigation-drawer__content \{[^}]*overscroll-behavior: contain;/)
    expect(layout).toMatch(/\.site-drawer\.v-navigation-drawer--active \{[^}]*display: flex !important;[^}]*position: fixed !important;[^}]*z-index: 3100 !important;[^}]*top: 0 !important;[^}]*height: 100dvh !important;/)
    expect(layout).toMatch(/\.site-layout > \.v-navigation-drawer__scrim \{[^}]*position: fixed !important;[^}]*z-index: 3050 !important;/)
    expect(layout).toMatch(/\.site-drawer__header \{[^}]*position: sticky;[^}]*top: 0;/)
    expect(criticalCss).toMatch(/\.v-btn \{[^}]*display: inline-grid;[^}]*grid-template-columns: max-content auto max-content;/)
    expect(criticalCss).not.toMatch(/\.v-btn \{[^}]*gap: 8px;/)
    expect(criticalCss).toContain('.home-hero__portrait::after')
    expect(home).toContain('.home-hero__portrait::after')
    expect(criticalCss).toContain('.home-hero .home-hero__role')
    expect(criticalCss).toContain('.home-hero .home-hero__bio')
    expect(home).toContain('.home-hero .home-hero__role')
    expect(home).toContain('.home-hero .home-hero__bio')
    expect(criticalCss).toContain('box-shadow: inset 0 -2px 0 var(--editorial-accent)')
    expect(layout).toContain('box-shadow: inset 0 -2px 0 var(--editorial-accent)')
    expect(criticalCss).not.toContain('.site-nav__link::after')
    expect(layout).not.toContain('.site-nav__link::after')
  })
})
