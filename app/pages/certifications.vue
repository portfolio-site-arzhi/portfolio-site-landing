<template>
  <v-container class="editorial-shell editorial-page">
    <PageIntro :title="t('nav.certifications')" />

    <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="editorial-alert mb-8">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>{{ t('errors.backendUnavailable') }}</div>
        <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
          {{ t('errors.retry') }}
        </v-btn>
      </div>
    </v-alert>

    <ContentState
      :pending="pending && certifications.length === 0"
      :empty="!pending && certifications.length === 0"
      :loading-text="t('states.loading')"
      :empty-text="t('states.emptyCertifications')"
    >
      <CvCertifications :items="certifications" />
    </ContentState>
  </v-container>
</template>

<script setup lang="ts">
import { stripHtmlToText } from '../utils/experienceHtml'
import { resolveFailHardOnBackendError } from '../utils/backendFailure'

const { certifications, hasBackendError, pending, refresh } = useLandingCertifications()
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
  const first = certifications.value[0]
  if (!first) return t('nav.certifications')

  const fromHtml = stripHtmlToText(first.description)
  const text = fromHtml || [first.title, first.issuer, first.issuedAt].filter(Boolean).join(' - ')
  if (!text) return t('nav.certifications')
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
})

useHead(() => ({
  title: t('nav.certifications'),
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
