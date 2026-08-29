<template>
  <section ref="root" class="portfolio-showcase" aria-label="Portfolio">
    <div class="portfolio-showcase__media" aria-hidden="true">
      <figure
        v-for="(project, index) in projects"
        :key="`visual-${project.id}`"
        class="portfolio-showcase__visual"
        :class="{ 'portfolio-showcase__visual--initial': index === 0 }"
      >
        <img
          :src="resolvePortfolioImage(project.image)"
          alt=""
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async"
          @error="applyPortfolioImageFallback"
        >
      </figure>
    </div>

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
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Project } from '../models/Project'
import { applyPortfolioImageFallback, resolvePortfolioImage } from '../utils/portfolioImage'
import {
  createPortfolioActivationCallbacks,
  resolvePortfolioActiveIndex
} from '../utils/portfolioShowcaseMotion'

const props = defineProps<{
  projects: Project[]
  basePath: string
  detailsLabel: string
  githubLabel: string
  liveLabel: string
  stackLabel: string
}>()

const root = ref<HTMLElement | null>(null)
let disposeMotion: (() => void) | undefined
let isDisposed = false
let syncFrame: number | undefined

const projectPath = (slug: string) => `${props.basePath.replace(/\/$/, '')}/${slug}`

onMounted(async () => {
  const staticLayout = typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 959px), (prefers-reduced-motion: reduce)').matches
  if (staticLayout || props.projects.length < 2 || !root.value) return

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ])

  if (isDisposed || !root.value) return

  gsap.registerPlugin(ScrollTrigger)

  const context = gsap.context(() => {
    const visuals = gsap.utils.toArray<HTMLElement>('.portfolio-showcase__visual')
    const records = gsap.utils.toArray<HTMLElement>('.portfolio-showcase__record')
    let activeIndex = 0

    const setActiveVisualImmediately = (requestedIndex: number) => {
      const nextIndex = Math.max(0, Math.min(requestedIndex, visuals.length - 1))
      const activeVisual = visuals[nextIndex]

      gsap.killTweensOf(visuals)
      gsap.set(visuals, { opacity: 0, scale: 0.965, zIndex: 0 })
      if (activeVisual) {
        gsap.set(activeVisual, { opacity: 1, scale: 1, zIndex: 1 })
      }
      activeIndex = nextIndex
    }

    setActiveVisualImmediately(0)

    const activate = (requestedIndex: number) => {
      const nextIndex = Math.max(0, Math.min(requestedIndex, visuals.length - 1))
      if (nextIndex === activeIndex) return

      const outgoingVisual = visuals[activeIndex]
      const incomingVisual = visuals[nextIndex]
      if (!incomingVisual) return

      gsap.killTweensOf(visuals)

      visuals.forEach((visual, index) => {
        if (index !== activeIndex && index !== nextIndex) {
          gsap.set(visual, { opacity: 0, scale: 0.965, zIndex: 0 })
        }
      })

      if (outgoingVisual) {
        gsap.set(outgoingVisual, { opacity: 1, scale: 1, zIndex: 1 })
        gsap.to(outgoingVisual, {
          opacity: 0,
          scale: 0.965,
          duration: 0.52,
          ease: 'power3.out',
          overwrite: true
        })
      }

      gsap.set(incomingVisual, { opacity: 0, scale: 0.985, zIndex: 2 })
      gsap.to(incomingVisual, {
        opacity: 1,
        scale: 1,
        duration: 0.52,
        ease: 'power3.out',
        overwrite: true
      })

      activeIndex = nextIndex
    }

    records.forEach((record, index) => {
      const callbacks = createPortfolioActivationCallbacks(index, activate)

      ScrollTrigger.create({
        trigger: record,
        start: 'top center',
        end: 'bottom center',
        ...callbacks
      })
    })

    const syncActiveVisual = () => {
      const nextIndex = resolvePortfolioActiveIndex(
        records.map(record => record.getBoundingClientRect().top),
        window.innerHeight,
        window.scrollY
      )
      setActiveVisualImmediately(nextIndex)
    }

    syncActiveVisual()
    syncFrame = window.requestAnimationFrame(() => {
      if (isDisposed) return
      ScrollTrigger.refresh()
      syncActiveVisual()
    })
  }, root.value)

  root.value.dataset.motion = 'enhanced'
  disposeMotion = () => {
    if (syncFrame !== undefined) {
      window.cancelAnimationFrame(syncFrame)
      syncFrame = undefined
    }
    context.revert()
  }
})

onBeforeUnmount(() => {
  isDisposed = true
  disposeMotion?.()
})
</script>

<style scoped>
.portfolio-showcase {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(320px, 0.84fr);
  gap: clamp(44px, 7vw, 112px);
  align-items: start;
}

.portfolio-showcase__media {
  position: sticky;
  top: calc(var(--app-bar-fallback) + 36px);
  height: min(68svh, 680px);
  overflow: hidden;
  border-radius: var(--editorial-radius-large);
  background: #e4e9ed;
}

.portfolio-showcase__visual {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  transform: scale(0.965);
}

.portfolio-showcase__visual--initial {
  opacity: 1;
  transform: scale(1);
}

.portfolio-showcase__visual img,
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
  display: flex;
  min-height: min(70svh, 680px);
  padding-block: clamp(36px, 6vw, 72px);
  border-bottom: 1px solid var(--editorial-line);
  flex-direction: column;
  justify-content: center;
}

.portfolio-showcase__inline-media {
  display: none;
  aspect-ratio: 4 / 3;
  margin: 0 0 28px;
  overflow: hidden;
  border-radius: var(--editorial-radius);
  background: #e4e9ed;
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
  .portfolio-showcase {
    display: block;
  }

  .portfolio-showcase__media {
    display: none;
  }

  .portfolio-showcase__record {
    min-height: auto;
    justify-content: flex-start;
  }

  .portfolio-showcase__inline-media {
    display: block;
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

@media (prefers-reduced-motion: reduce) {
  .portfolio-showcase {
    display: block;
  }

  .portfolio-showcase__media {
    display: none;
  }

  .portfolio-showcase__record {
    min-height: auto;
  }

  .portfolio-showcase__inline-media {
    display: block;
  }
}
</style>
