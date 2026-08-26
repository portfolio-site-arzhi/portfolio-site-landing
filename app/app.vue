<template>
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { resolveFailHardOnBackendError } from './utils/backendFailure'
import { resolvePageTransition } from './utils/pageTransition'
import { resolveThemeColors } from './utils/siteConfig'

const pageTransitionsReady = ref(false)
const pageTransition = computed(() => resolvePageTransition(pageTransitionsReady.value))

const theme = useTheme()
const runtimeConfig = useRuntimeConfig()

// Prefetch landing lists on initial SSR and keep them alive across client navigations.
// Portfolio detail stays route-level to avoid preloading every project payload globally.
useLandingExperiences()
useLandingEducations()
useLandingCertifications()
useLandingSkills()
useLandingPortfolios()

const { siteConfigs, hasBackendError } = await useSiteConfigsReady()
const failHardOnBackendError = computed(() =>
  resolveFailHardOnBackendError(runtimeConfig.public.failHardOnBackendError, !import.meta.dev)
)

if (hasBackendError.value && failHardOnBackendError.value) {
  throw createError({ statusCode: 503, statusMessage: 'Service Unavailable' })
}

const applyThemeColors = (colors: { primary: string; secondary: string }) => {
  const { primary, secondary } = colors

  const light = theme.themes.value.light
  if (light?.colors) {
    light.colors.primary = primary
    light.colors.secondary = secondary
  }
}

const themeColors = computed(() => resolveThemeColors(siteConfigs.value.system))
applyThemeColors(themeColors.value)

watch(themeColors, (colors) => {
  applyThemeColors(colors)
})

onMounted(() => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      pageTransitionsReady.value = true
    })
  })
})

useHead({
  meta: [{ key: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }]
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 180ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
