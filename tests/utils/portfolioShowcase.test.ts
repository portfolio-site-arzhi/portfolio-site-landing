import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import PortfolioShowcase from '../../app/components/PortfolioShowcase.vue'
import type { Project } from '../../app/models/Project'
import {
  createPortfolioActivationCallbacks,
  resolvePortfolioActiveIndex
} from '../../app/utils/portfolioShowcaseMotion'

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
  it('loads the above-the-fold showcase with the portfolio route styles', () => {
    const portfolioPage = readFileSync(resolve(process.cwd(), 'app/pages/portfolio.vue'), 'utf8')

    expect(portfolioPage).toContain("import PortfolioShowcase from '../components/PortfolioShowcase.vue'")
    expect(portfolioPage).toContain('<PortfolioShowcase')
    expect(portfolioPage).not.toContain('defineLazyHydrationComponent')
  })

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
    const stickyVisuals = wrapper.findAll('.portfolio-showcase__visual')
    expect(stickyVisuals[0]?.classes()).toContain('portfolio-showcase__visual--initial')
    expect(stickyVisuals[1]?.classes()).not.toContain('portfolio-showcase__visual--initial')
    const inlineImages = wrapper.findAll('.portfolio-showcase__inline-media img')
    expect(inlineImages.map(image => image.attributes('src'))).toEqual([
      '/alpha.jpg',
      '/portfolio-placeholder.svg'
    ])

    wrapper.unmount()
  })

  it('restores the previous project image when scrolling back', () => {
    const activate = vi.fn()
    const currentCallbacks = createPortfolioActivationCallbacks(1, activate)
    const previousCallbacks = createPortfolioActivationCallbacks(0, activate)

    currentCallbacks.onEnter()
    previousCallbacks.onEnterBack()

    expect(activate).toHaveBeenNthCalledWith(1, 1)
    expect(activate).toHaveBeenNthCalledWith(2, 0)
  })

  it('resolves the project intersecting the viewport center after initialization', () => {
    expect(resolvePortfolioActiveIndex([0, 0, 0], 855, 0)).toBe(0)
    expect(resolvePortfolioActiveIndex([353, 952, 1550], 855, 0)).toBe(0)
    expect(resolvePortfolioActiveIndex([-245, 353, 952], 855, 598)).toBe(1)
    expect(resolvePortfolioActiveIndex([], 855, 598)).toBe(0)
  })
})
