export interface PortfolioActivationCallbacks {
  onEnter: () => void
  onLeaveBack: () => void
}

export const createPortfolioActivationCallbacks = (
  recordIndex: number,
  activate: (index: number) => void
): PortfolioActivationCallbacks => ({
  onEnter: () => activate(recordIndex),
  onLeaveBack: () => activate(recordIndex - 1)
})
