import type { ExperiencePeriodInput, MonthYear } from '../models/ExperiencePeriod'

const parseMonthYear = (dateValue: string | null | undefined): MonthYear | null => {
  if (typeof dateValue !== 'string') return null
  const match = dateValue.match(/^(\d{4})-(\d{2})-\d{2}$/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (!Number.isFinite(year) || !Number.isFinite(month)) return null
  if (month < 1 || month > 12) return null
  return { year, monthIndex: month - 1 }
}

const formatMonthYear = (value: MonthYear | null, locale: string): string | null => {
  if (!value) return null
  const date = new Date(Date.UTC(value.year, value.monthIndex, 1))
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export const formatExperiencePeriod = (dto: ExperiencePeriodInput, locale: string): string => {
  const start = formatMonthYear(parseMonthYear(dto.start_date), locale)
  const end = formatMonthYear(parseMonthYear(dto.end_date), locale)
  const isCurrent = dto.is_current === true
  const presentLabel = locale === 'id' ? 'Sekarang' : 'Present'

  if (isCurrent) {
    if (start) return `${start} - ${presentLabel}`
    return presentLabel
  }

  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end
  return ''
}
