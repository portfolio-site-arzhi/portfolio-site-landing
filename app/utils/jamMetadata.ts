import { jam } from '@jam.dev/sdk'

export const createLandingJamMetadata = () => ({
  application: 'portfolio-site-landing',
  environment: import.meta.dev ? 'development' : 'production',
  locale: document.documentElement.lang || 'unknown',
  path: window.location.pathname
})

export const registerLandingJamMetadata = (): void => {
  jam.metadata(createLandingJamMetadata)
}
