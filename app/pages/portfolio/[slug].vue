<template>
  <v-container>
    <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-6">
      <v-btn :to="localePath('/portfolio')" variant="text" prepend-icon="mdi-arrow-left">
        {{ t('nav.portfolio') }}
      </v-btn>
      <div v-if="project" class="d-flex align-center gap-2">
        <v-btn
          v-if="project.github"
          :href="project.github"
          target="_blank"
          variant="text"
          prepend-icon="mdi-github"
        >
          {{ t('project.github') }}
        </v-btn>
        <v-btn
          v-if="project.link"
          :href="project.link"
          target="_blank"
          color="primary"
          variant="tonal"
          append-icon="mdi-open-in-new"
        >
          {{ t('project.live') }}
        </v-btn>
      </div>
    </div>

    <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="mb-6">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>{{ t('errors.backendUnavailable') }}</div>
        <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
          {{ t('errors.retry') }}
        </v-btn>
      </div>
    </v-alert>

    <template v-if="project">
      <v-fade-transition appear>
        <div>
          <h1 class="text-h3 font-weight-bold mb-2">{{ project.title }}</h1>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ project.description }}
          </p>
        </div>
      </v-fade-transition>

      <v-row>
        <v-col cols="12" md="7">
          <v-card elevation="2" class="mb-6 portfolio-hero-card">
            <img
              :src="resolvePortfolioImage(project.image)"
              :alt="project.title"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="portfolio-hero-image"
            >
          </v-card>

          <v-card v-if="project.contribution" elevation="2" class="pa-6 mb-6">
            <div class="text-h6 font-weight-bold mb-3">{{ t('project.contributions') }}</div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="portfolio-rich-text" v-html="project.contribution" />
          </v-card>

          <v-card v-if="project.outcome" elevation="2" class="pa-6">
            <div class="text-h6 font-weight-bold mb-3">{{ t('project.outcomes') }}</div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="portfolio-rich-text" v-html="project.outcome" />
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card elevation="2" class="pa-6 mb-6">
            <div class="text-h6 font-weight-bold mb-3">{{ t('project.role') }}</div>
            <div class="text-body-1">{{ project.role || '-' }}</div>

            <v-divider class="my-4" />

            <div class="text-h6 font-weight-bold mb-3">{{ t('project.stack') }}</div>
            <div>
              <v-chip
                v-for="tech in project.stack"
                :key="tech"
                size="small"
                class="mr-2 mb-2"
                color="primary"
                variant="tonal"
              >
                {{ tech }}
              </v-chip>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useLandingPortfolioDetail } from '../../composables/useLandingPortfolios'
import { resolveFailHardOnBackendError } from '../../utils/backendFailure'
import { resolvePortfolioImage } from '../../utils/portfolioImage'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const slug = computed(() => String(route.params.slug || ''))
const { project, notFound, hasBackendError, pending, refresh } = await useLandingPortfolioDetail(slug)

const failHardOnBackendError = computed(() =>
  resolveFailHardOnBackendError(runtimeConfig.public.failHardOnBackendError, !import.meta.dev)
)

const shouldShowInlineBackendAlert = computed(() =>
  hasBackendError.value && !failHardOnBackendError.value
)

const pageTitle = computed(() => project.value?.title || t('nav.portfolio'))
const pageDescription = computed(() => project.value?.description || t('portfolio.description'))
const pageImage = computed(() => resolvePortfolioImage(project.value?.image))

if (notFound.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

watchEffect(() => {
  if (!import.meta.client) return
  if (!failHardOnBackendError.value) return
  if (!hasBackendError.value) return
  showError(createError({ statusCode: 503, statusMessage: 'Service Unavailable' }))
})

useHead(() => ({
  title: pageTitle.value,
  htmlAttrs: {
    lang: locale.value,
    dir: 'ltr'
  },
  meta: [
    ...(hasBackendError.value ? [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }] : []),
    { key: 'description', name: 'description', content: pageDescription.value },
    { key: 'og:title', property: 'og:title', content: pageTitle.value },
    { key: 'og:description', property: 'og:description', content: pageDescription.value },
    { key: 'og:image', property: 'og:image', content: pageImage.value }
  ]
}))
</script>

<style scoped>
.portfolio-hero-card {
  overflow: hidden;
  border-radius: 24px;
}

.portfolio-hero-image {
  width: 100%;
  height: clamp(280px, 62vw, 380px);
  object-fit: cover;
  display: block;
}

.portfolio-rich-text :deep(p) {
  margin: 0 0 12px;
}

.portfolio-rich-text :deep(ul),
.portfolio-rich-text :deep(ol) {
  margin: 0;
  padding-left: 1.25rem;
}

.portfolio-rich-text :deep(li) {
  margin-bottom: 8px;
}

@media (min-width: 960px) {
  .portfolio-hero-image {
    height: clamp(420px, 40vw, 540px);
  }
}
</style>
