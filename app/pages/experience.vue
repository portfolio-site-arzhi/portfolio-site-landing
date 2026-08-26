<template>
  <v-container class="editorial-shell editorial-page experience-page">
    <PageIntro :title="t('experience.heading')" />

    <v-alert v-if="shouldShowInlineBackendAlert" type="warning" variant="tonal" border="start" class="editorial-alert mb-8">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>{{ t('errors.backendUnavailable') }}</div>
        <v-btn size="small" variant="outlined" :loading="pending" @click="refresh()">
          {{ t('errors.retry') }}
        </v-btn>
      </div>
    </v-alert>

    <ContentState
      :pending="pending && experiences.length === 0"
      :empty="!pending && experiences.length === 0"
      :loading-text="t('states.loading')"
      :empty-text="t('states.emptyExperience')"
    >
      <EditorialRecordList class="experience-list">
        <article
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="editorial-record experience-record"
        >
          <RevealOnView :delay="Math.min(index * 45, 180)">
            <div class="experience-record__inner">
              <div class="experience-record__period">
                <span>{{ exp.period }}</span>
              </div>

              <div class="experience-record__body">
                <h2>{{ exp.role }}</h2>
                <p class="experience-record__company">{{ exp.company }}</p>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="editorial-rich-text experience-record__description" v-html="exp.description" />
                <ul v-if="exp.skills.length" class="experience-record__skills">
                  <li v-for="skill in exp.skills" :key="skill">
                    {{ skill }}
                  </li>
                </ul>
              </div>
            </div>
          </RevealOnView>
        </article>
      </EditorialRecordList>
    </ContentState>
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
.experience-record {
  padding-block: clamp(32px, 5vw, 64px);
}

.experience-record__inner {
  display: grid;
  grid-template-columns: minmax(170px, 0.31fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 72px);
}

.experience-record__period {
  position: relative;
  padding-top: 7px;
  color: var(--editorial-accent);
  font-size: 0.82rem;
  font-variation-settings: 'wght' 680;
  letter-spacing: -0.01em;
}

.experience-record__period::after {
  position: absolute;
  top: 11px;
  right: clamp(-40px, calc(-2.5vw - 4px), -18px);
  width: 9px;
  height: 9px;
  border: 2px solid var(--editorial-canvas);
  border-radius: 50%;
  background: var(--editorial-accent);
  box-shadow: 0 0 0 1px var(--editorial-line-strong);
  content: '';
}

.experience-record__body {
  padding-left: clamp(28px, 4vw, 58px);
  border-left: 1px solid var(--editorial-line-strong);
}

.experience-record__body h2 {
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 3rem);
  font-variation-settings: 'wght' 635;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.experience-record__company {
  margin: 10px 0 0;
  color: var(--editorial-muted);
  font-size: 1rem;
  font-weight: 550;
}

.experience-record__description {
  max-width: 72ch;
  margin-top: 28px;
}

.experience-record__skills {
  display: flex;
  padding: 0;
  margin: 28px 0 0;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}

.experience-record__skills li {
  padding: 6px 9px;
  border: 1px solid var(--editorial-line);
  border-radius: 8px;
  color: var(--editorial-muted);
  font-size: 0.78rem;
  font-weight: 550;
}

@media (max-width: 699px) {
  .experience-record__inner {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .experience-record__period::after {
    display: none;
  }

  .experience-record__body {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
