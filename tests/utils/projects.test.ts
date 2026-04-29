import { describe, it, expect } from 'vitest'
import { getProjectBySlug } from '../../app/utils/projects'
import type { Project } from '../../app/models/Project'

describe('getProjectBySlug', () => {
  it('returns matching project', () => {
    const projects: Project[] = [
      {
        id: 1,
        slug: 'a',
        title: 'A',
        description: 'A',
        image: 'a',
        stack: []
      },
      {
        id: 2,
        slug: 'b',
        title: 'B',
        description: 'B',
        image: 'b',
        stack: []
      }
    ]

    const result = getProjectBySlug(projects, 'b')
    expect(result?.id).toBe(2)
  })

  it('returns undefined when not found', () => {
    const projects: Project[] = [
      {
        id: 1,
        slug: 'a',
        title: 'A',
        description: 'A',
        image: 'a',
        stack: []
      }
    ]

    const result = getProjectBySlug(projects, 'missing')
    expect(result).toBeUndefined()
  })
})
