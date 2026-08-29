export interface PortfolioActivationCallbacks {
  onEnter: () => void
  onEnterBack: () => void
}

export const createPortfolioActivationCallbacks = (
  recordIndex: number,
  activate: (index: number) => void
): PortfolioActivationCallbacks => ({
  onEnter: () => activate(recordIndex),
  onEnterBack: () => activate(recordIndex)
})

export const resolvePortfolioActiveIndex = (
  recordTops: number[],
  viewportHeight: number,
  scrollTop: number
): number => {
  if (scrollTop <= 1) return 0

  const viewportCenter = Math.max(0, viewportHeight) / 2

  return recordTops.reduce((activeIndex, recordTop, index) => {
    if (!Number.isFinite(recordTop)) return activeIndex
    return recordTop <= viewportCenter ? index : activeIndex
  }, 0)
}
