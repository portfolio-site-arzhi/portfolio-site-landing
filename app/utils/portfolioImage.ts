export const PORTFOLIO_PLACEHOLDER_IMAGE = '/portfolio-placeholder.svg'

export const resolvePortfolioImage = (value: string | null | undefined): string => {
  if (typeof value !== 'string') return PORTFOLIO_PLACEHOLDER_IMAGE

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : PORTFOLIO_PLACEHOLDER_IMAGE
}
