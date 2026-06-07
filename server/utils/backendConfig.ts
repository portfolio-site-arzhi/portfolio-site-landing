import type { H3Event } from 'h3'

export const getBackendUrl = (event: H3Event): string | undefined => {
  const config = useRuntimeConfig(event)
  const backendUrl = String(config.public.backendUrl || '').trim()
  return backendUrl || undefined
}

export const fetchFromBackend = async <T>(
  backendUrl: string,
  path: string
): Promise<T> => {
  const url = new URL(path, backendUrl).toString()
  return await $fetch<T>(url) as T
}

export const resolveBackendAssetUrl = (
  value: string | null | undefined,
  backendUrl: string
): string | null | undefined => {
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  try {
    return new URL(trimmed, backendUrl).toString()
  } catch {
    return trimmed
  }
}
