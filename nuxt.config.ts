import { readFileSync } from 'node:fs'

// https://nuxt.com/docs/api/configuration/nuxt-config
const isTypecheckRun = process.argv.includes('typecheck')
const isDevRun = process.argv.includes('dev')
// Nuxt dev serves SFC styles through Vite after SSR HTML, so inline a metric-matched shell before first paint.
const criticalStyles = isDevRun
  ? readFileSync(new URL('./app/assets/styles/critical.css', import.meta.url), 'utf8')
  : ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'vuetify/styles',
    '~/assets/styles/editorial.css'
  ],
  buildDir: isTypecheckRun ? '.nuxt-typecheck' : '.nuxt',
  app: {
    head: {
      meta: [
        {
          key: 'jam-team',
          name: 'jam:team',
          content: 'e2cd76f8-c843-48c9-86a6-35706fa653de'
        },
        {
          key: 'jam-blur',
          name: 'jam:blur',
          content: '[data-jam-blur], input[type="password"]'
        }
      ],
      link: [
        {
          key: 'geist-latin-preload',
          rel: 'preload',
          href: '/fonts/geist-latin-variable-v5.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        {
          key: 'site-favicon',
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=bf68864d'
        }
      ],
      style: [
        {
          key: 'geist-font-face',
          innerHTML: "@font-face{font-family:'Geist Variable';font-style:normal;font-display:block;font-weight:100 900;src:url('/fonts/geist-latin-variable-v5.woff2') format('woff2-variations')}"
        },
        ...(isDevRun
          ? [
              {
                key: 'critical-shell',
                innerHTML: criticalStyles
              }
            ]
          : []),
        {
          key: 'layout-offset-fallback',
          innerHTML: ':root{--app-bar-fallback:72px}.v-main{padding-top:max(var(--v-layout-top,0px),var(--app-bar-fallback))!important}'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || '',
      siteTitle: process.env.NUXT_PUBLIC_SITE_TITLE || '',
      failHardOnBackendError: process.env.NUXT_PUBLIC_FAIL_HARD_ON_BACKEND_ERROR || ''
    }
  },
  // Experience content comes from the runtime backend, which is unavailable while the Docker image is built.
  routeRules: {
    '/experience': { prerender: false },
    '/en/experience': { prerender: false }
  },
  modules: [
    ...(isTypecheckRun ? [] : ['@nuxt/eslint']),
    '@nuxt/test-utils/module',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n'
  ],
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#f3f5f7',
              surface: '#fafbfc',
              'surface-variant': '#e8edf1',
              'on-surface': '#14191e',
              'on-background': '#14191e',
              outline: '#c8d0d7'
            }
          }
        }
      }
    }
  },
  typescript: {
    typeCheck: false,
  },
  i18n: {
    locales: [
      { code: 'id', iso: 'id-ID', name: 'Bahasa Indonesia' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ],
    defaultLocale: 'id',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  }
})
