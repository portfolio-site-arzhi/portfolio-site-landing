<template>
  <section class="portfolio-showcase" aria-label="Portfolio">
    <div class="portfolio-showcase__records">
      <article
        v-for="(project, index) in projects"
        :id="`project-${project.slug}`"
        :key="project.id"
        class="portfolio-showcase__record"
      >
        <figure class="portfolio-showcase__inline-media">
          <img
            :src="resolvePortfolioImage(project.image)"
            :alt="project.title"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
            @error="applyPortfolioImageFallback"
          >
        </figure>

        <div class="portfolio-showcase__body">
          <p class="portfolio-showcase__index" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </p>
          <h2 class="portfolio-showcase__title">
            <NuxtLink :to="projectPath(project.slug)">
              {{ project.title }}
            </NuxtLink>
          </h2>
          <p class="portfolio-showcase__description">
            {{ project.description }}
          </p>

          <ul v-if="project.stack.length" class="portfolio-showcase__stack" :aria-label="stackLabel">
            <li v-for="tech in project.stack" :key="tech">
              {{ tech }}
            </li>
          </ul>

          <div class="portfolio-showcase__actions">
            <v-btn
              :to="projectPath(project.slug)"
              color="primary"
              variant="flat"
              append-icon="mdi-arrow-right"
            >
              {{ detailsLabel }}
            </v-btn>
            <v-btn
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              prepend-icon="mdi-github"
            >
              {{ githubLabel }}
            </v-btn>
            <v-btn
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              append-icon="mdi-open-in-new"
            >
              {{ liveLabel }}
            </v-btn>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from '../models/Project'
import { applyPortfolioImageFallback, resolvePortfolioImage } from '../utils/portfolioImage'

const props = defineProps<{
  projects: Project[]
  basePath: string
  detailsLabel: string
  githubLabel: string
  liveLabel: string
  stackLabel: string
}>()

const projectPath = (slug: string) => `${props.basePath.replace(/\/$/, '')}/${slug}`
</script>

<style scoped>
.portfolio-showcase {
  display: block;
}

.portfolio-showcase__inline-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portfolio-showcase__records {
  border-top: 1px solid var(--editorial-line-strong);
}

.portfolio-showcase__record {
  display: grid;
  padding-block: clamp(40px, 6vw, 76px);
  border-bottom: 1px solid var(--editorial-line);
  align-items: center;
  gap: clamp(32px, 6vw, 88px);
  grid-template-columns: minmax(280px, 0.92fr) minmax(0, 1.08fr);
}

.portfolio-showcase__inline-media {
  display: block;
  aspect-ratio: 4 / 3;
  margin: 0;
  overflow: hidden;
  border-radius: var(--editorial-radius);
  background: #e4e9ed;
}

.portfolio-showcase__body {
  min-width: 0;
  max-width: 640px;
}

.portfolio-showcase__index {
  margin: 0 0 18px;
  color: var(--editorial-accent);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.portfolio-showcase__title {
  margin: 0;
  font-size: clamp(2rem, 3.5vw, 3.85rem);
  font-variation-settings: 'wght' 650;
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.portfolio-showcase__title a {
  text-decoration: none;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.13em;
}

.portfolio-showcase__title a:hover {
  text-decoration: underline;
}

.portfolio-showcase__description {
  margin: 22px 0 0;
  color: var(--editorial-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.portfolio-showcase__stack {
  display: flex;
  padding: 0;
  margin: 24px 0 0;
  flex-wrap: wrap;
  gap: 8px 16px;
  list-style: none;
}

.portfolio-showcase__stack li {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--editorial-line-strong);
  color: var(--editorial-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.portfolio-showcase__actions {
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 959px) {
  .portfolio-showcase__record {
    gap: 28px;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 599px) {
  .portfolio-showcase__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .portfolio-showcase__actions .v-btn {
    width: 100%;
  }
}
</style>
