<template>
  <v-container class="editorial-shell editorial-page about-page">
    <PageIntro :title="t('nav.about')" :eyebrow="profile.role" />

    <section class="about-narrative">
      <RevealOnView class="about-narrative__copy">
        <p>{{ aboutMe }}</p>
      </RevealOnView>

      <RevealOnView :delay="90">
        <aside class="about-connect" :aria-labelledby="connectHeadingId">
          <h2 :id="connectHeadingId" class="editorial-section-title">
            {{ t('about.connect') }}
          </h2>
          <ul class="about-connect__links">
            <li v-for="social in profile.socials" :key="social.platform">
              <a :href="social.url" target="_blank" rel="noopener noreferrer">
                <v-icon :icon="social.icon" size="18" aria-hidden="true" />
                <span>{{ social.platform }}</span>
                <v-icon icon="mdi-arrow-top-right" size="17" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </aside>
      </RevealOnView>
    </section>

    <RevealOnView class="about-skills">
      <CvSkills :groups="skillGroups" />
    </RevealOnView>
  </v-container>
</template>

<script setup lang="ts">
const { profile, aboutMe } = useLandingData()
const { skillGroups } = useLandingSkills()
const { t, locale } = useI18n()
const connectHeadingId = useId()
const skillsKeywords = computed(() => skillGroups.value
  .flatMap((group) => group.skills)
  .filter((skill) => typeof skill === 'string' && skill.trim().length > 0)
  .slice(0, 20)
  .join(', '))

useHead(() => ({
  title: t('nav.about'),
  htmlAttrs: {
    lang: locale.value,
    dir: 'ltr'
  },
  meta: [
    { name: 'description', content: aboutMe.value || `About ${profile.value.name} - ${profile.value.role}` },
    ...(skillsKeywords.value
      ? [{ name: 'keywords', content: skillsKeywords.value }]
      : [])
  ]
}))
</script>

<style scoped>
.about-narrative {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: clamp(56px, 9vw, 148px);
  padding-block: clamp(48px, 8vw, 112px);
  border-top: 1px solid var(--editorial-line-strong);
}

.about-narrative__copy p {
  max-width: 35ch;
  margin: 0;
  font-size: clamp(1.15rem, 1.6vw, 1.6rem);
  font-variation-settings: 'wght' 470;
  letter-spacing: -0.025em;
  line-height: 1.45;
}

.about-connect {
  padding-top: 6px;
}

.about-connect__links {
  padding: 0;
  margin: 28px 0 0;
  border-top: 1px solid var(--editorial-line-strong);
  list-style: none;
}

.about-connect__links li {
  border-bottom: 1px solid var(--editorial-line);
}

.about-connect__links a {
  display: grid;
  padding-block: 15px;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  color: var(--editorial-muted);
  font-size: 0.9rem;
  text-decoration: none;
  transition: transform 220ms var(--editorial-ease);
}

.about-connect__links a:hover {
  color: var(--editorial-accent);
  transform: translateX(4px);
}

.about-skills {
  margin-top: clamp(36px, 6vw, 88px);
}

@media (max-width: 799px) {
  .about-narrative {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-connect__links a {
    transition: none;
  }

  .about-connect__links a:hover {
    transform: none;
  }
}
</style>
