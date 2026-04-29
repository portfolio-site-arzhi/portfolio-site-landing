import type { NuxtApp } from '#app'

type AsyncDataRefreshCause = 'initial' | 'refresh:hook' | 'refresh:manual' | 'watch'

type AsyncDataCacheContext = {
  cause: AsyncDataRefreshCause
}

export const getCachedDataFromPayload = <T>(
  key: string,
  nuxtApp: NuxtApp,
  context: AsyncDataCacheContext
): T | undefined => {
  if (context.cause === 'refresh:manual' || context.cause === 'refresh:hook' || context.cause === 'watch') {
    return undefined
  }

  const fromPayload = nuxtApp.payload.data[key]
  if (fromPayload !== undefined) {
    return fromPayload as T
  }

  const fromStatic = nuxtApp.static.data[key]
  if (fromStatic !== undefined) {
    return fromStatic as T
  }

  return undefined
}

