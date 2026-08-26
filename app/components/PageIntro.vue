<template>
  <header class="page-intro">
    <p v-if="eyebrow" class="editorial-kicker page-intro__eyebrow">
      {{ eyebrow }}
    </p>
    <h1 class="editorial-title">
      {{ title }}
    </h1>
    <p v-if="description" class="editorial-lede page-intro__description">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="page-intro__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>(), {
  description: '',
  eyebrow: ''
})
</script>

<style scoped>
.page-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.68fr);
  gap: clamp(28px, 5vw, 80px);
  align-items: end;
  padding-bottom: clamp(48px, 7vw, 92px);
}

.page-intro__eyebrow {
  grid-column: 1 / -1;
  margin-bottom: clamp(-48px, -3.2vw, -18px);
}

.page-intro__description {
  padding-bottom: 0.3em;
}

.page-intro__actions {
  grid-column: 2;
}

@media (max-width: 799px) {
  .page-intro {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .page-intro__eyebrow,
  .page-intro__actions {
    grid-column: auto;
    margin-bottom: 0;
  }
}
</style>
