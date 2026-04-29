<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 motion-lift motion-in" elevation="2">
          <v-card-title class="text-h4 font-weight-bold mb-4">
            {{ t('nav.about') }}
          </v-card-title>
          <v-card-text class="text-body-1">
            <p class="mb-4">
              {{ aboutMe }}
            </p>
            
            <v-divider class="my-6"/>

            <CvSkills :groups="skillGroups" />

            <v-divider class="my-6"/>
            
            <h3 class="text-h5 mb-4">{{ t('about.connect') }}</h3>
            <div class="d-flex flex-wrap ga-2">
              <v-btn
                v-for="social in profile.socials"
                :key="social.platform"
                :href="social.url"
                target="_blank"
                :prepend-icon="social.icon"
                variant="outlined"
                class="mb-2"
              >
                {{ social.platform }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { profile, aboutMe } = useLandingData()
const { skillGroups } = useLandingSkills()
const { t, locale } = useI18n()
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
