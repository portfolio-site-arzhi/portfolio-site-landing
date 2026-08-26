import type { TransitionProps } from 'vue'

export const EDITORIAL_PAGE_TRANSITION: TransitionProps = {
  name: 'page',
  mode: 'out-in'
}

export const resolvePageTransition = (isReady: boolean): TransitionProps | false =>
  isReady ? EDITORIAL_PAGE_TRANSITION : false
