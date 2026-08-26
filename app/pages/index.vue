<template>
  <v-container class="editorial-shell home-page">
    <section class="home-hero">
      <div class="home-hero__content">
        <RevealOnView>
          <p class="editorial-kicker home-hero__role">
            {{ profile.role }}
          </p>
        </RevealOnView>

        <RevealOnView :delay="70">
          <h1 class="editorial-display home-hero__title">
            {{ t('home.hello') }}
            <span class="home-hero__name">{{ profile.name }}</span>
          </h1>
        </RevealOnView>

        <RevealOnView :delay="140">
          <p class="editorial-lede home-hero__bio">
            {{ profile.bio }}
          </p>
        </RevealOnView>

        <RevealOnView :delay="210">
          <div class="editorial-actions home-hero__actions">
            <v-btn
              color="primary"
              size="large"
              :to="localePath('/portfolio')"
              append-icon="mdi-arrow-right"
            >
              {{ t('nav.portfolio') }}
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              :to="localePath('/experience')"
            >
              {{ t('nav.experience') }}
            </v-btn>
          </div>
        </RevealOnView>
      </div>

      <RevealOnView :delay="90" class="home-hero__portrait-reveal">
        <figure class="home-hero__portrait">
          <img
            :src="profile.avatar"
            :alt="profile.name"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          >
        </figure>
      </RevealOnView>
    </section>
  </v-container>
</template>

<script setup lang="ts">
const { profile } = useLandingData()
const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('nav.home'),
  titleTemplate: (title) => `${title} - ${profile.value.name}`,
  htmlAttrs: {
    lang: locale.value,
    dir: 'ltr'
  },
  meta: [
    { name: 'description', content: profile.value.bio }
  ]
})
</script>

<style scoped>
.home-page {
  display: flex;
  min-height: min(860px, calc(100svh - 72px));
  align-items: center;
}

.home-hero {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: clamp(36px, 7vw, 112px);
  align-items: center;
  padding-block: clamp(46px, 7vw, 92px);
}

.home-hero__content {
  position: relative;
  z-index: 1;
}

.home-hero .home-hero__role {
  margin-bottom: clamp(28px, 4vw, 52px);
}

.home-hero__title {
  position: relative;
  z-index: 2;
}

.home-hero__name {
  display: block;
  color: var(--editorial-accent);
}

.home-hero .home-hero__bio {
  margin-top: clamp(28px, 4vw, 48px);
}

.home-hero__actions {
  margin-top: 34px;
}

.home-hero__portrait-reveal {
  width: 100%;
}

.home-hero__portrait {
  position: relative;
  aspect-ratio: 4 / 5;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--editorial-line);
  border-radius: var(--editorial-radius-large);
  background: #e4e9ed;
}

.home-hero__portrait::after {
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(250, 251, 252, 0.58);
  border-radius: calc(var(--editorial-radius-large) - 8px);
  content: '';
  pointer-events: none;
}

.home-hero__portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 959px) {
  .home-page {
    min-height: auto;
  }

  .home-hero {
    grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
    gap: 36px;
  }
}

@media (max-width: 719px) {
  .home-hero {
    grid-template-columns: 1fr;
  }

  .home-hero__portrait-reveal {
    width: min(100%, 480px);
    justify-self: end;
  }

  .home-hero__portrait {
    aspect-ratio: 5 / 6;
  }
}
</style>
