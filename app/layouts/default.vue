<template>
  <v-app>
    <a class="skip-link" href="#main-content">
      {{ t('a11y.skipToContent') }}
    </a>

    <v-layout class="site-layout">
      <v-app-bar class="site-app-bar" flat height="72">
        <v-container class="editorial-shell site-header__inner">
          <v-app-bar-nav-icon
            class="d-lg-none"
            :aria-label="t('a11y.openNavigation')"
            @click="drawer = !drawer"
          />

          <NuxtLink class="site-brand" :to="localePath('/')" :aria-label="brandTitle">
            {{ brandTitle }}
          </NuxtLink>

          <nav class="site-nav d-none d-lg-flex" :aria-label="t('a11y.primaryNavigation')">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.path"
              :to="localePath(item.path)"
              prefetch
              class="site-nav__link"
              :class="{ 'site-nav__link--active': isActive(item.path) }"
              :aria-current="isActive(item.path) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <v-spacer />

          <v-menu location="bottom end">
            <template #activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                icon="mdi-translate"
                variant="text"
                :aria-label="t('a11y.changeLanguage')"
              />
            </template>
            <v-list density="compact" class="site-language-menu">
              <v-list-item
                v-for="loc in availableLocales"
                :key="loc.code"
                :active="locale === loc.code"
                @click="setLocale(loc.code)"
              >
                <v-list-item-title>{{ loc.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-container>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        temporary
        class="site-drawer d-lg-none"
      >
        <div class="site-drawer__header">
          <span class="site-brand">{{ brandTitle }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            :aria-label="t('a11y.closeNavigation')"
            @click="drawer = false"
          />
        </div>
        <nav class="site-drawer__nav" :aria-label="t('a11y.primaryNavigation')">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="localePath(item.path)"
            prefetch
            class="site-drawer__link"
            :class="{ 'site-drawer__link--active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            @click="drawer = false"
          >
            <v-icon :icon="item.icon" size="21" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </v-navigation-drawer>

      <v-main id="main-content" class="site-main" tabindex="-1">
        <v-container v-if="hasSiteConfigsBackendError" class="editorial-shell pt-6">
          <v-alert type="warning" variant="tonal" border="start" class="editorial-alert">
            {{ t('errors.backendUnavailable') }}
          </v-alert>
        </v-container>
        <slot />
      </v-main>

      <footer class="site-footer">
        <v-container class="editorial-shell site-footer__inner">
          <div>
            <p class="site-footer__brand">{{ brandTitle }}</p>
            <p class="site-footer__copyright">© {{ currentYear }}</p>
          </div>

          <div v-if="footerSocials.length" class="site-footer__socials" :aria-label="t('about.connect')">
            <v-btn
              v-for="social in footerSocials"
              :key="social.platform"
              :icon="social.icon"
              variant="text"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.platform"
            />
          </div>
        </v-container>
      </footer>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(false)
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { profile, hasSiteConfigsBackendError } = useLandingData()
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()

const currentYear = new Date().getFullYear()
const availableLocales = computed(() => locales.value)
const footerSocials = computed(() => profile.value.socials.filter((item) => item.platform !== 'Email'))
const brandTitle = computed(() => {
  const configured = String(runtimeConfig.public.siteTitle || '').trim()
  if (configured) return configured
  const fromProfile = String(profile.value.name || '').trim()
  if (fromProfile) return fromProfile
  return 'App'
})

const navigationItems = computed(() => [
  { path: '/', label: t('nav.home'), icon: 'mdi-home-outline' },
  { path: '/about', label: t('nav.about'), icon: 'mdi-account-outline' },
  { path: '/experience', label: t('nav.experience'), icon: 'mdi-briefcase-outline' },
  { path: '/education', label: t('nav.education'), icon: 'mdi-school-outline' },
  { path: '/certifications', label: t('nav.certifications'), icon: 'mdi-certificate-outline' },
  { path: '/portfolio', label: t('nav.portfolio'), icon: 'mdi-briefcase-variant-outline' }
])

const normalizePath = (path: string) => path.length > 1 ? path.replace(/\/$/, '') : path
const isActive = (path: string) => {
  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(localePath(path))
  if (path === '/') return currentPath === targetPath
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

useHead(() => ({
  meta: [
    ...(hasSiteConfigsBackendError.value ? [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }] : [])
  ]
}))

watch(
  () => route.fullPath,
  () => {
    drawer.value = false
  }
)
</script>

<style scoped>
.site-layout {
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  overflow: visible !important;
}

.site-header__inner {
  display: flex;
  height: 100%;
  align-items: center;
  gap: clamp(8px, 1.6vw, 24px);
}

.site-brand {
  color: var(--editorial-ink);
  font-size: 0.96rem;
  font-variation-settings: 'wght' 680;
  letter-spacing: -0.035em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}

.site-nav {
  align-items: center;
  gap: 0;
}

.site-nav .site-nav__link {
  display: inline-flex;
  position: relative;
  min-width: 0;
  min-height: 36px;
  padding-inline: 10px;
  border-radius: 10px;
  align-items: center;
  color: var(--editorial-muted);
  font-size: 0.82rem;
  justify-content: center;
  letter-spacing: 0.089em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 160ms ease, color 160ms ease;
}

.site-nav .site-nav__link:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  color: var(--editorial-ink);
}

.site-nav .site-nav__link--active {
  color: var(--editorial-ink);
  box-shadow: inset 0 -2px 0 var(--editorial-accent);
}

.site-language-menu {
  border: 1px solid var(--editorial-line);
  border-radius: 10px;
  background: var(--editorial-surface);
}

.site-drawer {
  background: var(--editorial-surface);
}

.site-drawer.v-navigation-drawer--active {
  display: flex !important;
  position: fixed !important;
  z-index: 3100 !important;
  top: 0 !important;
  bottom: 0 !important;
  height: 100dvh !important;
}

.site-layout > .v-navigation-drawer__scrim {
  position: fixed !important;
  z-index: 3050 !important;
  inset: 0 !important;
}

.site-drawer__header {
  display: flex;
  position: sticky;
  z-index: 1;
  top: 0;
  min-height: 72px;
  padding: 0 16px 0 24px;
  border-bottom: 1px solid var(--editorial-line);
  align-items: center;
  background: var(--editorial-surface);
  justify-content: space-between;
}

.site-drawer__nav {
  display: grid;
  padding: 16px 12px;
  gap: 4px;
}

.site-drawer__link {
  display: grid;
  min-height: 48px;
  padding-inline: 16px;
  border-radius: 8px;
  align-items: center;
  color: var(--editorial-muted);
  column-gap: 16px;
  grid-template-columns: 24px minmax(0, 1fr);
  text-decoration: none;
  transition: background-color 160ms ease, color 160ms ease;
}

.site-drawer__link:hover,
.site-drawer__link--active {
  background: rgba(var(--v-theme-primary), 0.08);
  color: var(--editorial-ink);
}

.site-footer {
  border-top: 1px solid var(--editorial-line);
  background: var(--editorial-canvas);
}

.site-footer__inner {
  display: flex;
  min-height: 150px;
  padding-block: 36px !important;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-footer__brand,
.site-footer__copyright {
  margin: 0;
}

.site-footer__brand {
  font-variation-settings: 'wght' 650;
  letter-spacing: -0.03em;
}

.site-footer__copyright {
  margin-top: 6px;
  color: var(--editorial-faint);
  font-size: 0.78rem;
}

.site-footer__socials {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 599px) {
  .site-header__inner {
    padding-left: 8px !important;
  }

  .site-footer__inner {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-nav .site-nav__link,
  .site-drawer__link {
    transition: none;
  }
}

</style>
