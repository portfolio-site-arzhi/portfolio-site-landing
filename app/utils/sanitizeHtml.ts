import type { IFrame, IOptions } from 'sanitize-html'
import type { SanitizeHtmlFn } from '../models/SanitizeHtml'
import type { LocalizedText } from '../models/SiteConfig'

let sanitizeHtmlFn: SanitizeHtmlFn | null = null

const getSanitizeHtmlFn = async (): Promise<SanitizeHtmlFn> => {
  if (sanitizeHtmlFn) return sanitizeHtmlFn
  const mod = await import('sanitize-html')
  sanitizeHtmlFn = ((mod as unknown as { default?: SanitizeHtmlFn }).default ?? (mod as unknown as SanitizeHtmlFn))
  return sanitizeHtmlFn
}

export const defaultSanitizeHtmlOptions: IOptions = {
  allowedTags: [
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    'span',
    'strong',
    'u',
    'ul'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href'],
  allowProtocolRelative: false,
  exclusiveFilter: (frame: IFrame) => {
    if (frame.tag === 'a' && !frame.attribs.href) return true
    return false
  }
}

export const sanitizeHtmlServer = async (html: string, options: IOptions = defaultSanitizeHtmlOptions): Promise<string> => {
  const sanitizeHtml = await getSanitizeHtmlFn()
  return sanitizeHtml(html, options).trim()
}

export const sanitizeLocalizedTextOrStringServer = async (
  value: LocalizedText | string | null | undefined,
  sanitize: (html: string) => Promise<string> = sanitizeHtmlServer
): Promise<LocalizedText | string | null | undefined> => {
  if (!value) return value

  if (typeof value === 'string') {
    return await sanitize(value)
  }

  if (typeof value === 'object') {
    const idValue = typeof value.id === 'string' ? value.id : ''
    const enValue = typeof value.en === 'string' ? value.en : ''

    return {
      ...value,
      id: await sanitize(idValue),
      en: await sanitize(enValue)
    }
  }

  return value
}
