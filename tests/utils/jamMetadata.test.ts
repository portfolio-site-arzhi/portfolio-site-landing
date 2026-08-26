import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createLandingJamMetadata,
  registerLandingJamMetadata
} from '../../app/utils/jamMetadata'

const jamSdk = vi.hoisted(() => ({
  metadata: vi.fn<(callback: () => Record<string, string>) => void>()
}))

vi.mock('@jam.dev/sdk', () => ({
  jam: {
    metadata: jamSdk.metadata
  }
}))

describe('landing Jam metadata', () => {
  beforeEach(() => {
    jamSdk.metadata.mockClear()
    document.documentElement.lang = 'id'
    window.history.replaceState({}, '', '/portfolio/example-project')
  })

  it('mendaftarkan callback dengan metadata halaman terbaru', () => {
    registerLandingJamMetadata()

    expect(jamSdk.metadata).toHaveBeenCalledOnce()
    expect(jamSdk.metadata).toHaveBeenCalledWith(createLandingJamMetadata)
    expect(createLandingJamMetadata()).toMatchObject({
      application: 'portfolio-site-landing',
      locale: 'id',
      path: '/portfolio/example-project'
    })
  })
})
