<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center text-md-left">
        <v-fade-transition appear>
          <div>
            <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4 text-break">
              {{ t('home.hello') }} <span class="text-primary">{{ profile.name }}</span>
            </h1>
            <h2 class="text-h6 text-sm-h5 text-md-h4 text-grey-darken-1 mb-6 text-break">
              {{ profile.role }}
            </h2>
            <p class="text-body-1 mb-8">
              {{ profile.bio }}
            </p>
            <div class="d-flex flex-column flex-sm-row justify-center justify-md-start ga-4">
              <v-btn
                color="primary"
                size="large"
                :to="localePath('/portfolio')"
                prepend-icon="mdi-briefcase-outline"
              >
                {{ t('nav.portfolio') }}
              </v-btn>
              <v-btn
                variant="outlined"
                size="large"
                :to="localePath('/experience')"
                prepend-icon="mdi-briefcase-account-outline"
              >
                {{ t('nav.experience') }}
              </v-btn>
            </div>
          </div>
        </v-fade-transition>
      </v-col>
      
      <v-col cols="12" md="6" class="text-center">
        <v-scale-transition appear>
          <v-avatar class="elevation-10" style="width: clamp(220px, 60vw, 300px); height: clamp(220px, 60vw, 300px);">
            <img
              :src="profile.avatar"
              :alt="t('nav.home')"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
            >
          </v-avatar>
        </v-scale-transition>
      </v-col>
    </v-row>
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
