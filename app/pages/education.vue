<template>
  <v-container>
    <h1 class="text-h3 font-weight-bold mb-8 text-center">{{ t('nav.education') }}</h1>

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
        <CvEducation :items="educations" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { stripHtmlToText } from '../utils/experienceHtml'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'

const { educations, hasBackendError, pending, refresh } = useLandingEducations()
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
  const first = educations.value[0]
  if (!first) return t('nav.education')

  const fromHtml = stripHtmlToText(first.description)
  const text = fromHtml || [first.program, first.institution, first.location].filter(Boolean).join(' - ')
  if (!text) return t('nav.education')
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
})

useHead(() => ({
  title: t('nav.education'),
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
