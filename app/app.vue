<template>
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { resolveFailHardOnBackendError } from './utils/backendFailure'
import { resolveThemeColors } from './utils/siteConfig'

const pageTransition = {
  name: 'page',
  mode: 'out-in'
} as const

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

  const dark = theme.themes.value.dark
  if (dark?.colors) {
    dark.colors.primary = primary
    dark.colors.secondary = secondary
  }
}

const themeColors = computed(() => resolveThemeColors(siteConfigs.value.system))
applyThemeColors(themeColors.value)

watch(themeColors, (colors) => {
  applyThemeColors(colors)
})

useHead({
  meta: [{ key: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }]
})
</script>

<style>
html,
body {
  overflow-x: hidden;
}

.site-app-bar {
  z-index: 3000;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(6px);
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

.motion-lift {
  transition: transform 220ms ease, box-shadow 220ms ease;
  will-change: transform;
}

.motion-lift:hover,
.motion-lift:focus-within {
  transform: translateY(-3px);
}

@keyframes motion-fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.motion-in {
  animation: motion-fade-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--enter-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .motion-lift {
    transition: none;
  }

  .motion-lift:hover,
  .motion-lift:focus-within {
    transform: none;
  }

  .motion-in {
    animation: none;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
