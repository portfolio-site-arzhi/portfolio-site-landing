<template>
  <div>
    <NuxtPage v-if="isDetail" />

    <v-container v-else class="editorial-shell editorial-page portfolio-page">
      <PageIntro
        :title="t('portfolio.title')"
        :description="t('portfolio.description')"
      />

      <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="editorial-alert mb-8">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>{{ t('errors.backendUnavailable') }}</div>
          <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
            {{ t('errors.retry') }}
          </v-btn>
        </div>
      </v-alert>

      <ContentState
        :pending="pending && projects.length === 0"
        :empty="!pending && projects.length === 0"
        :loading-text="t('states.loading')"
        :empty-text="t('states.emptyPortfolio')"
      >
        <PortfolioShowcase
          :projects="projects"
          :base-path="localePath('/portfolio')"
          :details-label="t('portfolio.details')"
          :github-label="t('project.github')"
          :live-label="t('project.live')"
          :stack-label="t('project.stack')"
        />
      </ContentState>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import PortfolioShowcase from '../components/PortfolioShowcase.vue'
import { useLandingPortfolios } from '../composables/useLandingPortfolios'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'

const { projects, hasBackendError, pending, refresh } = useLandingPortfolios()
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const isDetail = computed(() => {
  const slug = route.params.slug
  if (Array.isArray(slug)) return Boolean(slug[0])
  return typeof slug === 'string' && slug.length > 0
})

const failHardOnBackendError = computed(() =>
  resolveFailHardOnBackendError(runtimeConfig.public.failHardOnBackendError, !import.meta.dev)
)

const shouldShowInlineBackendAlert = computed(() =>
  hasBackendError.value && !failHardOnBackendError.value
)

const metaDescription = computed(() => {
  const first = projects.value[0]
  return first?.description || t('portfolio.description')
})

watchEffect(() => {
  if (!import.meta.client) return
  if (!failHardOnBackendError.value) return
  if (!hasBackendError.value) return
  showError(createError({ statusCode: 503, statusMessage: 'Service Unavailable' }))
})

useHead(() => {
  if (isDetail.value) return {}

  return {
    title: t('portfolio.title'),
    htmlAttrs: {
      lang: locale.value,
      dir: 'ltr'
    },
    meta: [
      ...(hasBackendError.value ? [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }] : []),
      { key: 'description', name: 'description', content: metaDescription.value }
    ]
  }
})
</script>
