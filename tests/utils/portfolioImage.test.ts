import { describe, expect, it } from 'vitest'
import {
  applyPortfolioImageFallback,
  PORTFOLIO_PLACEHOLDER_IMAGE,
  resolvePortfolioImage
} from '../../app/utils/portfolioImage'

describe('portfolio image fallback', () => {
  it('keeps a configured image URL unchanged', () => {
    const imageUrl = 'https://cdn.example.com/projects/alpha.jpg'

    expect(resolvePortfolioImage(imageUrl)).toBe(imageUrl)
  })

  it.each([undefined, null, '', '   '])(
    'uses the placeholder when the configured image is %s',
    (image) => {
      expect(resolvePortfolioImage(image)).toBe(PORTFOLIO_PLACEHOLDER_IMAGE)
    }
  )

  it('replaces an image URL that fails to load with the placeholder', () => {
    const image = document.createElement('img')
    image.src = 'https://example.com/missing-project.jpg'
    image.addEventListener('error', applyPortfolioImageFallback)

    image.dispatchEvent(new Event('error'))

    expect(image.getAttribute('src')).toBe(PORTFOLIO_PLACEHOLDER_IMAGE)
  })

  it('does not keep replacing the placeholder when it also emits an error', () => {
    const image = document.createElement('img')
    image.src = PORTFOLIO_PLACEHOLDER_IMAGE
    image.addEventListener('error', applyPortfolioImageFallback)

    image.dispatchEvent(new Event('error'))

    expect(image.getAttribute('src')).toBe(PORTFOLIO_PLACEHOLDER_IMAGE)
  })
})
