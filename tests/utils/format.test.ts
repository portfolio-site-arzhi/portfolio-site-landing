import { describe, it, expect } from 'vitest'
import { truncateText } from '../../app/utils/format'

describe('Utils', () => {
  it('truncateText should truncate long text', () => {
    const text = 'This is a very long text that needs to be truncated'
    const truncated = truncateText(text, 10)
    expect(truncated).toBe('This is a ...')
  })

  it('truncateText should not truncate short text', () => {
    const text = 'Short'
    const truncated = truncateText(text, 10)
    expect(truncated).toBe('Short')
  })
})
