import { describe, expect, it } from 'vitest'
import {
  EDITORIAL_PAGE_TRANSITION,
  resolvePageTransition
} from '../../app/utils/pageTransition'

describe('page transition', () => {
  it('keeps the initial SSR and hydration render static', () => {
    expect(resolvePageTransition(false)).toBe(false)
  })

  it('enables motion for client-side navigation after the initial paint', () => {
    expect(resolvePageTransition(true)).toBe(EDITORIAL_PAGE_TRANSITION)
    expect(resolvePageTransition(true)).toMatchObject({
      name: 'page',
      mode: 'out-in'
    })
  })
})
