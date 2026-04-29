<template>
  <v-app>
    <v-layout class="d-flex flex-column" style="min-height: 100vh;">
      <v-app-bar elevation="1" class="site-app-bar">
        <template #prepend>
          <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
        </template>

      <v-app-bar-title class="font-weight-bold" @click="$router.push(localePath('/'))">{{ brandTitle }}</v-app-bar-title>

        <template #append>
          <div class="d-none d-md-flex">
            <v-btn :to="localePath('/')" variant="text" class="text-capitalize">{{ t('nav.home') }}</v-btn>
            <v-btn :to="localePath('/about')" variant="text" class="text-capitalize">{{ t('nav.about') }}</v-btn>
            <v-btn :to="localePath('/experience')" variant="text" class="text-capitalize">{{ t('nav.experience') }}</v-btn>
            <v-btn :to="localePath('/education')" variant="text" class="text-capitalize">{{ t('nav.education') }}</v-btn>
            <v-btn :to="localePath('/certifications')" variant="text" class="text-capitalize">{{ t('nav.certifications') }}</v-btn>
            <v-btn :to="localePath('/portfolio')" variant="text" class="text-capitalize">{{ t('nav.portfolio') }}</v-btn>
          </div>
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                class="ml-2"
              >
                <v-icon>mdi-translate</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="loc in availableLocales"
                :key="loc.code"
                :active="locale === loc.code"
                @click="setLocale(loc.code)"
              >
                <v-list-item-title>
                  {{ loc.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        temporary
        class="d-md-none"
      >
        <v-list nav>
          <v-list-item :to="localePath('/')" :title="t('nav.home')" prepend-icon="mdi-home-outline" />
          <v-list-item :to="localePath('/about')" :title="t('nav.about')" prepend-icon="mdi-account-outline" />
          <v-list-item :to="localePath('/experience')" :title="t('nav.experience')" prepend-icon="mdi-briefcase-outline" />
          <v-list-item :to="localePath('/education')" :title="t('nav.education')" prepend-icon="mdi-school-outline" />
          <v-list-item :to="localePath('/certifications')" :title="t('nav.certifications')" prepend-icon="mdi-certificate-outline" />
          <v-list-item :to="localePath('/portfolio')" :title="t('nav.portfolio')" prepend-icon="mdi-briefcase-variant-outline" />
        </v-list>
      </v-navigation-drawer>

      <v-main class="bg-grey-lighten-4 flex-grow-1">
        <v-container v-if="hasSiteConfigsBackendError" class="pt-6">
          <v-alert type="warning" variant="tonal" border="start">
            {{ t('errors.backendUnavailable') }}
          </v-alert>
        </v-container>
        <slot />
      </v-main>

      <v-footer class="bg-grey-lighten-3 text-center d-flex flex-column">
        <div class="pt-4">
          <v-btn
            v-for="social in footerSocials"
            :key="social.platform"
            :icon="social.icon"
            variant="text"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>

        <v-divider/>

        <div class="text-caption text-medium-emphasis mb-4">
        {{ new Date().getFullYear() }} — <strong>{{ brandTitle }}</strong>
        </div>
      </v-footer>
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

const availableLocales = computed(() => locales.value)
const footerSocials = computed(() => profile.value.socials.filter((item) => item.platform !== 'Email'))
const brandTitle = computed(() => {
  const configured = String(runtimeConfig.public.siteTitle || '').trim()
  if (configured) return configured
  const fromProfile = String(profile.value.name || '').trim()
  if (fromProfile) return fromProfile
  return 'App'
})

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
