<template>
  <v-card class="pa-6 motion-lift" elevation="2">
    <v-card-title class="text-h5 font-weight-bold mb-4">{{ t('nav.education') }}</v-card-title>

    <v-list lines="three">
      <v-list-item
        v-for="(item, index) in items"
        :key="item.id"
        class="motion-in"
        :style="{ '--enter-delay': `${index * 36}ms` }"
      >
        <template #title>
          <div class="d-flex flex-wrap align-center justify-space-between gap-2">
            <div class="text-subtitle-1 font-weight-medium">{{ item.institution }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.period }}</div>
          </div>
        </template>

        <template #subtitle>
          <div class="text-body-2">{{ item.program }}<span v-if="item.location"> • {{ item.location }}</span></div>
          <v-expand-transition>
            <div v-if="item.description || item.highlights?.length" class="mt-2">
              <div v-if="item.description" class="education-description" v-html="item.description" />
              <ul v-if="item.highlights?.length" class="pl-4">
                <li v-for="h in item.highlights" :key="h" class="text-body-2">
                  {{ h }}
                </li>
              </ul>
            </div>
          </v-expand-transition>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Education } from '../models/Education'

const { t } = useI18n()

defineProps<{
  items: Education[]
}>()
</script>

<style scoped>
.education-description :deep(p) {
  margin: 0 0 12px;
}

.education-description :deep(ul),
.education-description :deep(ol) {
  margin: 0 0 12px;
  padding-left: 1.25rem;
}

.education-description :deep(p:last-child),
.education-description :deep(ul:last-child),
.education-description :deep(ol:last-child) {
  margin-bottom: 0;
}
</style>
