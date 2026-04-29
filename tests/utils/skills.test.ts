import { describe, expect, it } from 'vitest'
import { mapLandingSkillsToViewModel } from '../../app/utils/landingSkillsMapper'

describe('landing skills mapper', () => {
  it('maps groups and skills using display_order and preserves deterministic ordering', () => {
    const mapped = mapLandingSkillsToViewModel(
      [
        {
          id: 2,
          display_order: 2,
          name: { id: 'Tooling', en: 'Tooling' },
          skills: [
            { id: 4, display_order: 2, name: { id: 'CI', en: 'CI' } },
            { id: 3, display_order: 1, name: 'ESLint' }
          ]
        },
        {
          id: 1,
          display_order: 1,
          name: { id: 'Frontend', en: 'Frontend' },
          skills: [
            { id: 2, display_order: 2, name: { id: 'Nuxt', en: 'Nuxt' } },
            { id: 1, display_order: 1, name: 'Vue.js' }
          ]
        }
      ],
      'id'
    )

    expect(mapped).toEqual([
      { id: 1, name: 'Frontend', skills: ['Vue.js', 'Nuxt'] },
      { id: 2, name: 'Tooling', skills: ['ESLint', 'CI'] }
    ])
  })

  it('falls back to id locale and filters empty names', () => {
    const mapped = mapLandingSkillsToViewModel(
      [
        {
          id: 10,
          sort: 1,
          name: { id: 'UI', en: null },
          skills: [
            { id: 1, sort: 1, name: { id: 'Vuetify', en: '' } },
            { id: 2, sort: 2, name: { id: '', en: '' } }
          ]
        },
        {
          id: 11,
          sort: 2,
          name: '',
          skills: []
        }
      ],
      'en'
    )

    expect(mapped).toEqual([
      { id: 10, name: 'UI', skills: ['Vuetify'] }
    ])
  })
})

