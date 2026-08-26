<template>
  <v-container class="editorial-shell editorial-page portfolio-detail">
    <nav class="portfolio-detail__toolbar" :aria-label="t('nav.portfolio')">
      <v-btn :to="localePath('/portfolio')" variant="text" prepend-icon="mdi-arrow-left">
        {{ t('nav.portfolio') }}
      </v-btn>

      <div v-if="project" class="portfolio-detail__external-links">
        <v-btn
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          variant="text"
          prepend-icon="mdi-github"
        >
          {{ t('project.github') }}
        </v-btn>
        <v-btn
          v-if="project.link"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          variant="flat"
          append-icon="mdi-open-in-new"
        >
          {{ t('project.live') }}
        </v-btn>
      </div>
    </nav>

    <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="editorial-alert mb-8">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>{{ t('errors.backendUnavailable') }}</div>
        <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
          {{ t('errors.retry') }}
        </v-btn>
      </div>
    </v-alert>

    <template v-if="project">
      <PageIntro
        :title="project.title"
        :description="project.description"
        :eyebrow="project.role || t('project.title')"
      />

      <RevealOnView>
        <figure class="portfolio-detail__hero">
          <img
            :src="resolvePortfolioImage(project.image)"
            :alt="project.title"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            class="portfolio-hero-image"
            @error="applyPortfolioImageFallback"
          >
        </figure>
      </RevealOnView>

      <div class="portfolio-detail__case-study">
        <aside class="portfolio-detail__metadata">
          <dl>
            <div>
              <dt>{{ t('project.role') }}</dt>
              <dd>{{ project.role || '-' }}</dd>
            </div>
            <div>
              <dt>{{ t('project.stack') }}</dt>
              <dd>
                <ul class="portfolio-detail__stack">
                  <li v-for="tech in project.stack" :key="tech">
                    {{ tech }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </aside>

        <div class="portfolio-detail__narrative">
          <RevealOnView v-if="project.contribution">
            <section class="portfolio-detail__section">
              <h2>{{ t('project.contributions') }}</h2>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="editorial-rich-text portfolio-rich-text" v-html="project.contribution" />
            </section>
          </RevealOnView>

          <RevealOnView v-if="project.outcome" :delay="70">
            <section class="portfolio-detail__section">
              <h2>{{ t('project.outcomes') }}</h2>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="editorial-rich-text portfolio-rich-text" v-html="project.outcome" />
            </section>
          </RevealOnView>
        </div>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useLandingPortfolioDetail } from '../../composables/useLandingPortfolios'
import { resolveFailHardOnBackendError } from '../../utils/backendFailure'
import { applyPortfolioImageFallback, resolvePortfolioImage } from '../../utils/portfolioImage'

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
.portfolio-detail__toolbar {
  display: flex;
  margin-bottom: clamp(44px, 7vw, 90px);
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.portfolio-detail__external-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.portfolio-detail__hero {
  aspect-ratio: 16 / 9;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--editorial-line);
  border-radius: var(--editorial-radius-large);
  background: #e4e9ed;
}

.portfolio-hero-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portfolio-detail__case-study {
  display: grid;
  grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
  gap: clamp(48px, 9vw, 144px);
  padding-top: clamp(64px, 10vw, 144px);
}

.portfolio-detail__metadata {
  align-self: start;
}

.portfolio-detail__metadata dl {
  position: sticky;
  top: calc(var(--app-bar-fallback) + 36px);
  margin: 0;
  border-top: 1px solid var(--editorial-line-strong);
}

.portfolio-detail__metadata dl > div {
  padding-block: 20px;
  border-bottom: 1px solid var(--editorial-line);
}

.portfolio-detail__metadata dt {
  margin-bottom: 8px;
  color: var(--editorial-faint);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.portfolio-detail__metadata dd {
  margin: 0;
  color: var(--editorial-muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.portfolio-detail__stack {
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  gap: 7px;
  list-style: none;
}

.portfolio-detail__stack li {
  padding: 5px 8px;
  border: 1px solid var(--editorial-line);
  border-radius: 7px;
  font-size: 0.76rem;
}

.portfolio-detail__narrative {
  border-top: 1px solid var(--editorial-line-strong);
}

.portfolio-detail__section {
  padding-block: clamp(38px, 6vw, 76px);
  border-bottom: 1px solid var(--editorial-line);
}

.portfolio-detail__section h2 {
  max-width: 18ch;
  margin: 0 0 28px;
  font-size: clamp(1.55rem, 3vw, 3rem);
  font-variation-settings: 'wght' 635;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.portfolio-rich-text {
  max-width: 72ch;
}

@media (max-width: 799px) {
  .portfolio-detail__toolbar {
    align-items: flex-start;
  }

  .portfolio-detail__case-study {
    grid-template-columns: 1fr;
  }

  .portfolio-detail__metadata dl {
    position: static;
  }
}

@media (max-width: 599px) {
  .portfolio-detail__toolbar {
    flex-direction: column;
  }

  .portfolio-detail__external-links {
    width: 100%;
  }
}
</style>
