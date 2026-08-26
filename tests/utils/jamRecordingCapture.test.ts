import { describe, expect, it } from 'vitest'
import {
  initializeLandingJamCapture,
  isJamRecordingUrl,
  JAM_RECORDING_SCRIPT_URLS
} from '../../app/utils/jamRecordingCapture'

const createTargetDocument = () => {
  const scripts: HTMLScriptElement[] = []
  const targetDocument = {
    createElement: (tagName: string) => document.createElement(tagName),
    querySelector: (selector: string) => {
      const src = selector.match(/^script\[src="(.+)"\]$/)?.[1]
      return scripts.find((script) => script.src === src) ?? null
    },
    head: {
      append: (...nodes: HTMLScriptElement[]) => scripts.push(...nodes)
    }
  } as unknown as Document

  return { scripts, targetDocument }
}

describe('Jam recording capture', () => {
  it('does not load third-party scripts during a regular visit', () => {
    const { scripts, targetDocument } = createTargetDocument()

    expect(initializeLandingJamCapture('', targetDocument)).toBe(false)
    expect(scripts).toHaveLength(0)
  })

  it('loads the official recorder and capture scripts for a Recording Link', () => {
    const { scripts, targetDocument } = createTargetDocument()

    expect(isJamRecordingUrl('?jam-recording=recording-123&jam-title=Bug')).toBe(true)
    expect(initializeLandingJamCapture('?jam-recording=recording-123', targetDocument)).toBe(true)

    expect(scripts.map((script) => script.src)).toEqual([...JAM_RECORDING_SCRIPT_URLS])
    expect(scripts.every((script) => script.type === 'module')).toBe(true)
  })

  it('deduplicates scripts when the page-finish hook runs more than once', () => {
    const { scripts, targetDocument } = createTargetDocument()

    initializeLandingJamCapture('?jam-recording=recording-123', targetDocument)
    initializeLandingJamCapture('?jam-recording=recording-123', targetDocument)

    expect(scripts).toHaveLength(2)
  })
})
