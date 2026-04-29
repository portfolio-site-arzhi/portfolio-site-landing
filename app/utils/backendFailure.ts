export const resolveFailHardOnBackendError = (
  value: unknown,
  fallback: boolean
): boolean => {
  const text = String(value ?? '').trim().toLowerCase()
  if (text === '1' || text === 'true' || text === 'yes') return true
  if (text === '0' || text === 'false' || text === 'no') return false
  return fallback
}

