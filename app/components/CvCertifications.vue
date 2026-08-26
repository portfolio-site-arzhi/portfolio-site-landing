<template>
  <EditorialRecordList>
    <article
      v-for="(item, index) in items"
      :key="item.id"
      class="editorial-record certification-record"
    >
      <RevealOnView :delay="Math.min(index * 45, 180)">
        <div class="certification-record__inner">
          <div class="certification-record__meta">
            <p>{{ item.issuedAt }}</p>
            <p>{{ item.issuer }}</p>
          </div>

          <div class="certification-record__body">
            <div class="certification-record__heading">
              <h2>{{ item.title }}</h2>
              <v-btn
                v-if="item.credentialUrl"
                :href="item.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="text"
                color="primary"
                append-icon="mdi-open-in-new"
              >
                Credential
              </v-btn>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-if="item.description" class="editorial-rich-text certification-record__description" v-html="item.description" />
            <ul v-if="item.highlights?.length" class="certification-record__highlights">
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
import type { Certification } from '../models/Certification'

defineProps<{
  items: Certification[]
}>()
</script>

<style scoped>
.certification-record {
  padding-block: clamp(32px, 5vw, 62px);
}

.certification-record__inner {
  display: grid;
  grid-template-columns: minmax(180px, 0.34fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 92px);
}

.certification-record__meta p {
  margin: 0;
  color: var(--editorial-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}

.certification-record__meta p:first-child {
  color: var(--editorial-accent);
  font-weight: 680;
}

.certification-record__heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 24px;
}

.certification-record__heading h2 {
  max-width: 24ch;
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 3rem);
  font-variation-settings: 'wght' 635;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.certification-record__description {
  max-width: 72ch;
  margin-top: 26px;
}

.certification-record__highlights {
  max-width: 68ch;
  padding-left: 1.2rem;
  margin: 24px 0 0;
  color: var(--editorial-muted);
  line-height: 1.65;
}

.certification-record__highlights li + li {
  margin-top: 8px;
}

@media (max-width: 679px) {
  .certification-record__inner {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .certification-record__heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
