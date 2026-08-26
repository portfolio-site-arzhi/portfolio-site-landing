import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RevealOnView from '../../app/components/RevealOnView.vue'

const mediaQueryList = (matches: boolean): MediaQueryList => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('RevealOnView', () => {
  it('reveals slotted content after it enters the viewport', async () => {
    let callback: IntersectionObserverCallback | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()

    class IntersectionObserverMock implements IntersectionObserver {
      readonly root = null
      readonly rootMargin = '0px'
      readonly thresholds = [0.14]

      constructor(observerCallback: IntersectionObserverCallback) {
        callback = observerCallback
      }

      observe = observe
      unobserve = vi.fn()
      disconnect = disconnect
      takeRecords = vi.fn(() => [])
    }

    vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList(false)))
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 1200
    } as DOMRect)

    const wrapper = await mountSuspended(RevealOnView, {
      slots: { default: 'Visible portfolio content' }
    })

    expect(wrapper.text()).toContain('Visible portfolio content')
    expect(wrapper.attributes('data-reveal-state')).toBe('pending')
    expect(observe).toHaveBeenCalledOnce()

    callback?.([
      { isIntersecting: true } as IntersectionObserverEntry
    ], {} as IntersectionObserver)
    await nextTick()

    expect(wrapper.attributes('data-reveal-state')).toBe('visible')
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('keeps SSR content visible when it is already inside the initial viewport', async () => {
    const observer = vi.fn()

    vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList(false)))
    vi.stubGlobal('IntersectionObserver', observer)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 120
    } as DOMRect)

    const wrapper = await mountSuspended(RevealOnView, {
      slots: { default: 'Initial viewport content' }
    })

    expect(wrapper.attributes('data-reveal-state')).toBe('visible')
    expect(wrapper.text()).toContain('Initial viewport content')
    expect(observer).not.toHaveBeenCalled()
  })

  it('stays visible and skips the observer when reduced motion is requested', async () => {
    const observer = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList(true)))
    vi.stubGlobal('IntersectionObserver', observer)

    const wrapper = await mountSuspended(RevealOnView, {
      slots: { default: 'Reduced motion content' }
    })

    expect(wrapper.attributes('data-reveal-state')).toBe('visible')
    expect(wrapper.text()).toContain('Reduced motion content')
    expect(observer).not.toHaveBeenCalled()
  })

})
