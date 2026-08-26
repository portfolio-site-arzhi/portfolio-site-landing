export const PORTFOLIO_PLACEHOLDER_IMAGE = '/portfolio-placeholder.svg'

export const resolvePortfolioImage = (value: string | null | undefined): string => {
  if (typeof value !== 'string') return PORTFOLIO_PLACEHOLDER_IMAGE

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : PORTFOLIO_PLACEHOLDER_IMAGE
}

export const applyPortfolioImageFallback = (event: Event): void => {
  const image = event.currentTarget
  if (!(image instanceof HTMLImageElement)) return

  const currentSource = image.getAttribute('src')?.trim()
  if (currentSource === PORTFOLIO_PLACEHOLDER_IMAGE) return

  image.src = PORTFOLIO_PLACEHOLDER_IMAGE
}
