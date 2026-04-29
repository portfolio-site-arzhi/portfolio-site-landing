<template>
  <div>
    <NuxtPage v-if="isDetail" />

    <v-container v-else>
      <h1 class="text-h3 font-weight-bold mb-8 text-center">{{ t('portfolio.title') }}</h1>
      <p class="text-body-2 text-medium-emphasis mb-6 text-center">
        {{ t('portfolio.description') }}
      </p>

      <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="mb-6">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>{{ t('errors.backendUnavailable') }}</div>
          <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
            {{ t('errors.retry') }}
          </v-btn>
        </div>
      </v-alert>

      <v-row>
        <v-col
          v-for="(project, index) in projects"
          :key="project.id"
          cols="12"
          md="4"
          class="motion-in"
          :style="{ '--enter-delay': `${index * 40}ms` }"
        >
          <v-card
            elevation="2"
            class="d-flex flex-column h-100 transition-swing motion-lift"
            role="link"
            tabindex="0"
            @click="navigateTo(`/portfolio/${project.slug}`)"
            @keydown.enter.prevent="navigateTo(`/portfolio/${project.slug}`)"
            @keydown.space.prevent="navigateTo(`/portfolio/${project.slug}`)"
          >
            <img
              :src="resolvePortfolioImage(project.image)"
              :alt="project.title"
              :loading="index < 3 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              decoding="async"
              style="width: 100%; height: 200px; object-fit: cover; display: block;"
            >

              <v-card-title>{{ project.title }}</v-card-title>

              <v-card-text class="flex-grow-1">
                <p class="mb-0 line-clamp-2">{{ project.description }}</p>
              </v-card-text>

              <v-card-actions class="d-flex ga-2 portfolio-actions">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click.stop="navigateTo(`/portfolio/${project.slug}`)"
                >
                  {{ t('portfolio.details') }}
                </v-btn>
                <v-spacer />
                <v-btn
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  icon="mdi-github"
                  variant="text"
                  @click.stop
                />
                <v-btn
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  color="primary"
                  variant="text"
                  @click.stop
                >
                  {{ t('project.live') }}
                </v-btn>
              </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useLandingPortfolios } from '../composables/useLandingPortfolios'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'
import { resolvePortfolioImage } from '../utils/portfolioImage'

const { projects, hasBackendError, pending, refresh } = useLandingPortfolios()
const route = useRoute()
const { t, locale } = useI18n()
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

<style scoped>
.portfolio-actions {
  min-height: 64px;
  align-items: center;
}
</style>
