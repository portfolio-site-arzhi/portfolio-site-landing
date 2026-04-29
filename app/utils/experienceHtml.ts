import { sanitizeHtmlServer } from './sanitizeHtml'

export const sanitizeExperienceHtmlServer = async (html: string | null | undefined): Promise<string> => {
  const input = typeof html === 'string' ? html : ''
  return await sanitizeHtmlServer(input)
}

export const stripHtmlToText = (html: string | null | undefined): string => {
  const input = typeof html === 'string' ? html : ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

