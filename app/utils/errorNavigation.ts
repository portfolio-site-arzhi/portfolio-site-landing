const englishLocaleRoot = '/en'

const normalizePathname = (pathname: string): string => {
  const trimmed = pathname.trim()
  if (!trimmed) return '/'
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export const resolveErrorHomePath = (pathname: string): string => {
  const normalizedPathname = normalizePathname(pathname)
  if (
    normalizedPathname === englishLocaleRoot
    || normalizedPathname.startsWith(`${englishLocaleRoot}/`)
  ) {
    return englishLocaleRoot
  }

  return '/'
}

export const resolveErrorRetryPath = (
  pathname: string,
  search = '',
  hash = ''
): string => {
  return `${normalizePathname(pathname)}${search}${hash}`
}
