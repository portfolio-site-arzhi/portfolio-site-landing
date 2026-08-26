<template>
  <EditorialRecordList>
    <article
      v-for="(item, index) in items"
      :key="item.id"
      class="editorial-record education-record"
    >
      <RevealOnView :delay="Math.min(index * 45, 180)">
        <div class="education-record__inner">
          <div class="education-record__meta">
            <p>{{ item.period }}</p>
            <p v-if="item.location">{{ item.location }}</p>
          </div>

          <div class="education-record__body">
            <h2>{{ item.institution }}</h2>
            <p class="education-record__program">{{ item.program }}</p>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-if="item.description" class="editorial-rich-text education-record__description" v-html="item.description" />
            <ul v-if="item.highlights?.length" class="education-record__highlights">
              <li v-for="highlight in item.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </div>
      </RevealOnView>
    </article>
  </EditorialRecordList>
</template>

<script setup lang="ts">
import type { Education } from '../models/Education'

defineProps<{
  items: Education[]
}>()
</script>

<style scoped>
.education-record {
  padding-block: clamp(32px, 5vw, 62px);
}

.education-record__inner {
  display: grid;
  grid-template-columns: minmax(180px, 0.34fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 92px);
}

.education-record__meta p {
  margin: 0;
  color: var(--editorial-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}

.education-record__meta p:first-child {
  color: var(--editorial-accent);
  font-weight: 680;
}

.education-record__body h2 {
  max-width: 22ch;
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 3rem);
  font-variation-settings: 'wght' 635;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.education-record__program {
  margin: 12px 0 0;
  color: var(--editorial-muted);
  font-size: 1rem;
  font-weight: 550;
}

.education-record__description {
  max-width: 72ch;
  margin-top: 26px;
}

.education-record__highlights {
  max-width: 68ch;
  padding-left: 1.2rem;
  margin: 24px 0 0;
  color: var(--editorial-muted);
  line-height: 1.65;
}

.education-record__highlights li + li {
  margin-top: 8px;
}

@media (max-width: 679px) {
  .education-record__inner {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}
</style>
