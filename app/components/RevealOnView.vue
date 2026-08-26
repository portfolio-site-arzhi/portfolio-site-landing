<template>
  <div
    ref="root"
    class="reveal-on-view"
    :data-reveal-state="state"
    :style="revealStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  delay?: number
  threshold?: number
}>(), {
  delay: 0,
  threshold: 0.14
})

const root = ref<HTMLElement | null>(null)
const state = ref<'pending' | 'visible'>('visible')
let observer: IntersectionObserver | undefined

const revealStyle = computed(() => ({
  '--reveal-delay': `${Math.max(0, props.delay)}ms`
}))

onMounted(() => {
  const prefersReducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    state.value = 'visible'
    return
  }

  const element = root.value
  if (!element) return

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const isBelowInitialViewport = viewportHeight > 0
    && element.getBoundingClientRect().top >= viewportHeight

  // SSR content must never flash from visible to hidden during hydration.
  // Only arm the reveal for content that has not entered the initial viewport.
  if (!isBelowInitialViewport) return

  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    state.value = 'visible'
    observer?.disconnect()
    observer = undefined
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: Math.min(1, Math.max(0, props.threshold))
  })

  state.value = 'pending'
  observer.observe(element)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
