import { registerLandingJamMetadata } from '../utils/jamMetadata'
import { initializeLandingJamCapture } from '../utils/jamRecordingCapture'

export default defineNuxtPlugin((nuxtApp) => {
  const initializeCapture = () => {
    initializeLandingJamCapture()
  }

  initializeCapture()
  registerLandingJamMetadata()
  nuxtApp.hook('page:finish', initializeCapture)
})
