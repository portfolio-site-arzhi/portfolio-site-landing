<template>
  <section class="skills-section" aria-labelledby="skills-heading">
    <div class="skills-section__heading">
      <h2 id="skills-heading" class="editorial-section-title">Skills</h2>
    </div>

    <EditorialRecordList class="skills-section__groups">
      <article
        v-for="(group, index) in groups"
        :key="group.id"
        class="editorial-record skills-group"
      >
        <RevealOnView :delay="Math.min(index * 45, 180)">
          <div class="skills-group__inner">
            <h3>{{ group.name }}</h3>
            <ul>
              <li
                v-for="(skill, skillIndex) in group.skills"
                :key="`${group.id}-${skillIndex}-${skill}`"
              >
                {{ skill }}
              </li>
            </ul>
          </div>
        </RevealOnView>
      </article>
    </EditorialRecordList>
  </section>
</template>

<script setup lang="ts">
import type { SkillGroup } from '../models/SkillGroup'

defineProps<{
  groups: SkillGroup[]
}>()
</script>

<style scoped>
.skills-section {
  display: grid;
  grid-template-columns: minmax(180px, 0.36fr) minmax(0, 1fr);
  gap: clamp(40px, 8vw, 128px);
  align-items: start;
}

.skills-section__heading {
  position: sticky;
  top: calc(var(--app-bar-fallback) + 36px);
}

.skills-group {
  padding-block: 28px;
}

.skills-group__inner {
  display: grid;
  grid-template-columns: minmax(140px, 0.38fr) minmax(0, 1fr);
  gap: 24px;
}

.skills-group h3 {
  margin: 0;
  font-size: 1rem;
  font-variation-settings: 'wght' 650;
  letter-spacing: -0.025em;
}

.skills-group ul {
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}

.skills-group li {
  padding: 6px 9px;
  border: 1px solid var(--editorial-line);
  border-radius: 8px;
  color: var(--editorial-muted);
  font-size: 0.8rem;
  line-height: 1.25;
}

@media (max-width: 799px) {
  .skills-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .skills-section__heading {
    position: static;
  }
}

@media (max-width: 519px) {
  .skills-group__inner {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>
