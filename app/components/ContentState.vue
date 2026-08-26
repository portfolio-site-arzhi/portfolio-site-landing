<template>
  <div
    v-if="pending"
    class="content-state"
    role="status"
    aria-live="polite"
  >
    <span class="sr-only">{{ loadingText }}</span>
    <div class="content-state__skeleton" aria-hidden="true">
      <span class="content-state__skeleton-line" />
      <span class="content-state__skeleton-line" />
      <span class="content-state__skeleton-line" />
    </div>
  </div>
  <div v-else-if="empty" class="content-state" role="status">
    <p class="content-state__message">
      {{ emptyText }}
    </p>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  pending?: boolean
  empty?: boolean
  loadingText: string
  emptyText: string
}>(), {
  pending: false,
  empty: false
})
</script>
