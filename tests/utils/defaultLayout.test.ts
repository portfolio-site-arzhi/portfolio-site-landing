import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '../../app/layouts/default.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('mobile navigation', () => {
  it('uses Nuxt links so visible navigation routes can be prefetched', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<div>Page content</div>' }
    })

    const desktopLinks = wrapper.findAll('.site-nav__link')
    const drawerLinks = wrapper.findAll('.site-drawer__link')

    expect(desktopLinks).toHaveLength(6)
    expect(drawerLinks).toHaveLength(6)
    expect(desktopLinks.every(link => link.element.tagName === 'A')).toBe(true)
    expect(drawerLinks.every(link => link.element.tagName === 'A')).toBe(true)
    expect(desktopLinks.map(link => link.attributes('href'))).toContain('/experience')
    expect(desktopLinks[0]?.attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('opens the drawer when the mobile navigation button is activated', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<div>Page content</div>' }
    })
    const toggle = wrapper.get('.v-app-bar-nav-icon')

    await toggle.trigger('click')
    await nextTick()

    expect(wrapper.get('.site-drawer').classes()).toContain('v-navigation-drawer--active')

    wrapper.unmount()
  })
})
