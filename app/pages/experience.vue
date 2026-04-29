<template>
  <v-container>
    <h1 class="text-h3 font-weight-bold mb-8 text-center">{{ t('experience.heading') }}</h1>

    <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="mb-6">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>{{ t('errors.backendUnavailable') }}</div>
        <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
          {{ t('errors.retry') }}
        </v-btn>
      </div>
    </v-alert>

    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="d-sm-none">
          <div class="d-flex flex-column ga-4">
            <v-card
              v-for="(exp, index) in experiences"
              :key="exp.id"
              class="elevation-2 motion-lift motion-in"
              :style="{ '--enter-delay': `${index * 40}ms` }"
            >
              <v-card-title class="experience-card-title">
                <div class="text-caption text-primary mb-1">{{ exp.period }}</div>
                <div class="text-h6 text-wrap text-break">{{ exp.role }}</div>
                <div class="text-subtitle-1 text-grey-darken-1 text-wrap text-break">{{ exp.company }}</div>
              </v-card-title>
              <v-card-text>
                <div class="mb-3 experience-description" v-html="exp.description" />
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="skill in exp.skills"
                    :key="skill"
                    size="small"
                    color="secondary"
                    variant="tonal"
                  >
                    {{ skill }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <div class="d-none d-sm-block">
          <v-timeline align="start" side="end">
            <v-timeline-item
              v-for="(exp, index) in experiences"
              :key="exp.id"
              dot-color="primary"
              size="small"
              class="motion-in"
              :style="{ '--enter-delay': `${index * 40}ms` }"
            >
              <template #opposite>
                <div class="pt-1 headline font-weight-bold text-primary">
                  {{ exp.period }}
                </div>
              </template>

              <v-card class="elevation-2 motion-lift">
                <v-card-title class="experience-card-title">
                  <div class="text-h6 text-wrap text-break">{{ exp.role }}</div>
                  <div class="text-subtitle-1 text-grey-darken-1 text-wrap text-break">{{ exp.company }}</div>
                </v-card-title>
                <v-card-text>
                  <div class="mb-2 experience-description" v-html="exp.description" />
                  <div class="mt-2">
                    <v-chip
                      v-for="skill in exp.skills"
                      :key="skill"
                      size="small"
                      class="mr-2 mb-1"
                      color="secondary"
                      variant="tonal"
                    >
                      {{ skill }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { stripHtmlToText } from '../utils/experienceHtml'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'

const { experiences, hasBackendError, pending, refresh } = useLandingExperiences()
const { hasBackendError: hasSiteConfigsBackendError } = useSiteConfigs()
const { t, locale } = useI18n()
const runtimeConfig = useRuntimeConfig()

const failHardOnBackendError = computed(() =>
  resolveFailHardOnBackendError(runtimeConfig.public.failHardOnBackendError, !import.meta.dev)
)

const shouldShowInlineBackendAlert = computed(() =>
  hasBackendError.value && !hasSiteConfigsBackendError.value && !failHardOnBackendError.value
)

watchEffect(() => {
  if (!import.meta.client) return
  if (!failHardOnBackendError.value) return
  if (!hasBackendError.value) return
  showError(createError({ statusCode: 503, statusMessage: 'Service Unavailable' }))
})

const metaDescription = computed(() => {
  const first = experiences.value[0]
  if (!first) return t('experience.heading')
  const text = stripHtmlToText(first.description)
  if (!text) return t('experience.heading')
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
})

useHead(() => ({
  title: t('nav.experience'),
  htmlAttrs: {
    lang: locale.value,
    dir: 'ltr'
  },
  meta: [
    ...(hasBackendError.value ? [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }] : []),
    { key: 'description', name: 'description', content: metaDescription.value }
  ]
}))
</script>

<style scoped>
.experience-card-title {
  display: block;
  white-space: normal;
}

.experience-description :deep(p) {
  margin: 0 0 12px;
}

.experience-description :deep(ul),
.experience-description :deep(ol) {
  margin: 0 0 12px;
  padding-left: 1.25rem;
}
</style>
