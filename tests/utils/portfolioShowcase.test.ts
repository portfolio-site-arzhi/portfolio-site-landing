import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PortfolioShowcase from '../../app/components/PortfolioShowcase.vue'
import type { Project } from '../../app/models/Project'
import { createPortfolioActivationCallbacks } from '../../app/utils/portfolioShowcaseMotion'

const projects: Project[] = [
  {
    id: 1,
    slug: 'alpha-platform',
    title: 'Alpha Platform',
    description: 'A platform for the first case study.',
    image: '/alpha.jpg',
    role: 'Engineer',
    contribution: '',
    stack: ['Nuxt', 'TypeScript'],
    outcome: '',
    link: 'https://alpha.example.com',
    github: 'https://github.com/example/alpha'
  },
  {
    id: 2,
    slug: 'beta-api',
    title: 'Beta API',
    description: 'An API for the second case study.',
    image: '',
    role: 'Backend Engineer',
    contribution: '',
    stack: ['Node.js'],
    outcome: ''
  }
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PortfolioShowcase', () => {
  it('renders every project and detail link before motion enhancement', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))

    const wrapper = await mountSuspended(PortfolioShowcase, {
      props: {
        projects,
        basePath: '/portfolio',
        detailsLabel: 'Details',
        githubLabel: 'GitHub',
        liveLabel: 'Live Demo',
        stackLabel: 'Tech Stack'
      }
    })

    expect(wrapper.findAll('.portfolio-showcase__record')).toHaveLength(projects.length)
    expect(wrapper.text()).toContain('Alpha Platform')
    expect(wrapper.text()).toContain('Beta API')
    expect(wrapper.html()).toContain('href="/portfolio/alpha-platform"')
    expect(wrapper.html()).toContain('href="/portfolio/beta-api"')
    expect(wrapper.html()).toContain('https://github.com/example/alpha')
    expect(wrapper.html()).toContain('https://alpha.example.com')
    expect(wrapper.attributes('data-motion')).toBeUndefined()

    const stickyImages = wrapper.findAll('.portfolio-showcase__media img')
    expect(stickyImages.map(image => image.attributes('src'))).toEqual([
      '/alpha.jpg',
      '/portfolio-placeholder.svg'
    ])
    const inlineImages = wrapper.findAll('.portfolio-showcase__inline-media img')
    expect(inlineImages.map(image => image.attributes('src'))).toEqual([
      '/alpha.jpg',
      '/portfolio-placeholder.svg'
    ])

    wrapper.unmount()
  })

  it('restores the previous project image when scrolling back', () => {
    const activate = vi.fn()
    const callbacks = createPortfolioActivationCallbacks(1, activate)

    callbacks.onEnter()
    callbacks.onLeaveBack()

    expect(activate).toHaveBeenNthCalledWith(1, 1)
    expect(activate).toHaveBeenNthCalledWith(2, 0)
  })
})
