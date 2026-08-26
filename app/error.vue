<template>
  <v-app>
    <v-main class="site-main error-page">
      <v-container class="editorial-shell error-page__inner">
        <section class="error-page__content">
          <p v-if="statusCode" class="error-page__code" aria-hidden="true">
            {{ statusCode }}
          </p>

          <div>
            <p class="editorial-kicker">{{ statusText || t('errors.errorTitle') }}</p>
            <h1 class="editorial-title error-page__title">
              {{ t('errors.errorTitle') }}
            </h1>
            <p class="editorial-lede error-page__description">
              {{ t('errors.errorDescription') }}
            </p>

            <div class="editorial-actions error-page__actions">
              <v-btn color="primary" size="large" @click="handleRetry">
                {{ t('errors.retry') }}
              </v-btn>
              <v-btn variant="outlined" size="large" @click="handleHome">
                {{ t('errors.backHome') }}
              </v-btn>
            </div>
          </div>
        </section>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { resolveErrorHomePath, resolveErrorRetryPath } from './utils/errorNavigation'

const requestUrl = useRequestURL()
const error = useError()
const { t, locale } = useI18n()
const currentError = computed(() => error.value as NuxtError | null)

const statusCode = computed(() => {
  const value = currentError.value?.statusCode
  return typeof value === 'number' ? value : undefined
})

const statusText = computed(() => {
  const err = currentError.value
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
  clearError({ redirect: resolveErrorHomePath(requestUrl.pathname) })
}

const handleRetry = () => {
  clearError({
    redirect: resolveErrorRetryPath(
      requestUrl.pathname,
      requestUrl.search,
      requestUrl.hash
    )
  })
}
</script>

<style scoped>
.error-page {
  min-height: 100svh;
}

.error-page__inner {
  display: flex;
  min-height: 100svh;
  align-items: center;
}

.error-page__content {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(220px, 0.48fr) minmax(0, 0.82fr);
  gap: clamp(44px, 8vw, 128px);
  align-items: end;
  padding-block: 64px;
  border-top: 1px solid var(--editorial-line-strong);
  border-bottom: 1px solid var(--editorial-line);
}

.error-page__code {
  margin: 0;
  color: rgba(var(--v-theme-primary), 0.18);
  font-size: clamp(7rem, 20vw, 18rem);
  font-variation-settings: 'wght' 720;
  letter-spacing: -0.1em;
  line-height: 0.7;
}

.error-page__title {
  margin-top: 20px;
}

.error-page__description {
  margin-top: 28px;
}

.error-page__actions {
  margin-top: 34px;
}

@media (max-width: 759px) {
  .error-page__content {
    grid-template-columns: 1fr;
  }

  .error-page__code {
    font-size: clamp(6rem, 34vw, 10rem);
  }
}
</style>
