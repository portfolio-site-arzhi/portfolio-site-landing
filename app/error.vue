<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-6" elevation="2">
              <div class="text-h4 font-weight-bold mb-2">
                {{ t('errors.errorTitle') }}
              </div>

              <div class="text-body-1 text-medium-emphasis mb-2">
                <span v-if="statusCode">{{ statusCode }}</span>
                <span v-if="statusText">— {{ statusText }}</span>
              </div>

              <div class="text-body-2 mb-6">
                {{ t('errors.errorDescription') }}
              </div>

              <div class="d-flex flex-wrap ga-3">
                <v-btn color="primary" @click="handleRetry">
                  {{ t('errors.retry') }}
                </v-btn>
                <v-btn variant="outlined" @click="handleHome">
                  {{ t('errors.backHome') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
type ErrorLike = {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

const route = useRoute()
const error = useError()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const statusCode = computed(() => {
  const value = (error.value as ErrorLike | null)?.statusCode
  return typeof value === 'number' ? value : undefined
})

const statusText = computed(() => {
  const err = error.value as ErrorLike | null
  const raw = err?.statusMessage || err?.message
  const text = typeof raw === 'string' ? raw.trim() : ''
  return text.length > 0 ? text : undefined
})

useHead(() => ({
  title: t('errors.errorTitle'),
  htmlAttrs: {
    lang: locale.value,
    dir: 'ltr'
  },
  meta: [
    { key: 'robots', name: 'robots', content: 'noindex, nofollow' }
  ]
}))

const handleHome = () => {
  clearError({ redirect: localePath('/') })
}

const handleRetry = () => {
  clearError({ redirect: route.fullPath })
}
</script>

