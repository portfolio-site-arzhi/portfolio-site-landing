<template>
  <v-card class="pa-6 motion-lift" elevation="2">
    <v-card-title class="text-h5 font-weight-bold mb-4">Skills</v-card-title>
    <v-row>
      <v-col
        v-for="(group, index) in groups"
        :key="group.id"
        cols="12"
        md="4"
        class="motion-in"
        :style="{ '--enter-delay': `${index * 60}ms` }"
      >
        <div class="text-subtitle-1 font-weight-medium mb-3">{{ group.name }}</div>
        <div>
          <v-chip
            v-for="(skill, skillIndex) in group.skills"
            :key="`${group.id}-${skillIndex}-${skill}`"
            size="small"
            class="mr-2 mb-2"
            variant="tonal"
            color="primary"
          >
            {{ skill }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { SkillGroup } from '../models/SkillGroup'

defineProps<{
  groups: SkillGroup[]
}>()
</script>
