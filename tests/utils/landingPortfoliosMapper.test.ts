import { describe, expect, it } from 'vitest'
import { mapLandingPortfolioToViewModel, mapLandingPortfoliosToViewModel } from '../../app/utils/landingPortfoliosMapper'
import { PORTFOLIO_PLACEHOLDER_IMAGE } from '../../app/utils/portfolioImage'

describe('landing portfolios mapper', () => {
  it('should localize fields and sort stacks by display order', () => {
    const mapped = mapLandingPortfolioToViewModel(
      {
        id: 7,
        slug: 'ecommerce-dashboard',
        title: 'Ecommerce Dashboard',
        description: {
          id: 'Dashboard analytics untuk toko online',
          en: 'Analytics dashboard for ecommerce store'
        },
        contribution: {
          id: '<p>Membangun dashboard analytics</p>',
          en: '<p>Built analytics dashboard</p>'
        },
        outcome: {
          id: '<p>Meningkatkan conversion rate</p>',
          en: '<p>Improved conversion rate</p>'
        },
        image: 'https://example.com/portfolio.png',
        role: 'Frontend Lead',
        live_url: ' https://demo.example.com ',
        github_url: ' https://github.com/example/repo ',
        stacks: [
          { id: 2, display_order: 2, name: 'Nuxt' },
          { id: 1, display_order: 1, name: 'TypeScript' }
        ]
      },
      'en'
    )

    expect(mapped.description).toBe('Analytics dashboard for ecommerce store')
    expect(mapped.contribution).toBe('<p>Built analytics dashboard</p>')
    expect(mapped.outcome).toBe('<p>Improved conversion rate</p>')
    expect(mapped.stack).toEqual(['TypeScript', 'Nuxt'])
    expect(mapped.link).toBe('https://demo.example.com')
    expect(mapped.github).toBe('https://github.com/example/repo')
  })

  it('should provide safe fallbacks for nullable fields and sort list data', () => {
    const mapped = mapLandingPortfoliosToViewModel(
      [
        {
          id: 3,
          display_order: 2,
          slug: null,
          title: null,
          description: null,
          contribution: null,
          outcome: null,
          image: null,
          role: 'Backend Engineer',
          live_url: null,
          github_url: null,
          stacks: null
        },
        {
          id: 1,
          display_order: 1,
          slug: 'task-management-app',
          title: 'Task Management App',
          description: {
            id: 'Aplikasi manajemen tugas',
            en: null
          },
          image: 'https://example.com/task.png',
          role: null,
          live_url: null,
          github_url: null,
          stacks: [
            { id: 5, name: 'Vue' },
            { id: 4, display_order: 1, name: 'Vuetify' }
          ]
        }
      ],
      'en'
    )

    expect(mapped[0]?.id).toBe(1)
    expect(mapped[0]?.description).toBe('Aplikasi manajemen tugas')
    expect(mapped[0]?.stack).toEqual(['Vuetify', 'Vue'])

    expect(mapped[1]).toMatchObject({
      id: 3,
      slug: 'portfolio-3',
      title: 'Portfolio 3',
      description: 'Portfolio 3',
      image: PORTFOLIO_PLACEHOLDER_IMAGE,
      role: 'Backend Engineer',
      stack: []
    })
  })

  it('should fallback to placeholder image when the image value is blank', () => {
    const mapped = mapLandingPortfolioToViewModel(
      {
        id: 9,
        image: '   '
      },
      'id'
    )

    expect(mapped.image).toBe(PORTFOLIO_PLACEHOLDER_IMAGE)
  })
})
