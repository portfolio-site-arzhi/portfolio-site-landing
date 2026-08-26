export const JAM_RECORDING_SCRIPT_URLS = [
  'https://js.jam.dev/recorder.js',
  'https://js.jam.dev/capture.js'
] as const

export const isJamRecordingUrl = (search: string): boolean => {
  const params = new URLSearchParams(search)
  return Boolean(params.get('jam-recording')?.trim())
}

const appendModuleScript = (targetDocument: Document, src: string): void => {
  if (targetDocument.querySelector(`script[src="${src}"]`)) return

  const script = targetDocument.createElement('script')
  script.type = 'module'
  script.src = src
  script.async = false
  script.dataset.jamRecordingCapture = 'true'
  targetDocument.head.append(script)
}

export const initializeLandingJamCapture = (
  search = window.location.search,
  targetDocument = document
): boolean => {
  if (!isJamRecordingUrl(search)) return false

  for (const src of JAM_RECORDING_SCRIPT_URLS) {
    appendModuleScript(targetDocument, src)
  }

  return true
}
