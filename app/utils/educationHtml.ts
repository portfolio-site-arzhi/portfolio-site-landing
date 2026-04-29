import { sanitizeHtmlServer } from './sanitizeHtml'

export const sanitizeEducationHtmlServer = async (html: string | null | undefined): Promise<string> => {
  const input = typeof html === 'string' ? html : ''
  return await sanitizeHtmlServer(input)
}

