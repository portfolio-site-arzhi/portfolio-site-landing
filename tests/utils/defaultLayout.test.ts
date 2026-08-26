import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '../../app/layouts/default.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('mobile navigation', () => {
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
