import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import PortfolioShowcase from '../../app/components/PortfolioShowcase.vue'
import type { Project } from '../../app/models/Project'

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
    image: '/beta.jpg',
    role: 'Backend Engineer',
    contribution: '',
    stack: ['Node.js'],
    outcome: ''
  }
]

describe('PortfolioShowcase', () => {
  it('loads the above-the-fold showcase with the portfolio route styles', () => {
    const portfolioPage = readFileSync(resolve(process.cwd(), 'app/pages/portfolio.vue'), 'utf8')

    expect(portfolioPage).toContain("import PortfolioShowcase from '../components/PortfolioShowcase.vue'")
    expect(portfolioPage).toContain('<PortfolioShowcase')
    expect(portfolioPage).not.toContain('defineLazyHydrationComponent')
  })

  it('renders every project with its own image and detail link', async () => {
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
    expect(wrapper.find('.portfolio-showcase__media').exists()).toBe(false)
    expect(wrapper.find('.portfolio-showcase__visual').exists()).toBe(false)

    const inlineImages = wrapper.findAll('.portfolio-showcase__inline-media img')
    expect(inlineImages.map(image => image.attributes('src'))).toEqual([
      '/alpha.jpg',
      '/beta.jpg'
    ])
    expect(inlineImages[0]?.attributes('loading')).toBe('eager')
    expect(inlineImages[1]?.attributes('loading')).toBe('lazy')

    wrapper.unmount()
  })
})
