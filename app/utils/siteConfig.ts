import type { SocialLink } from '../models/Profile'
import type { LocaleCode, LocalizedText, SiteConfigAbout, SiteConfigFooter, SiteConfigsData, SiteConfigSystem } from '../models/SiteConfig'

export const pickLocalizedText = (value: LocalizedText | undefined, locale: string): string | undefined => {
  if (!value) return undefined

  const key = locale as LocaleCode
  const direct = value[key]
  if (direct) return direct

  const fallbackId = value.id
  if (fallbackId) return fallbackId

  const fallbackEn = value.en
  if (fallbackEn) return fallbackEn

  return undefined
}

export const buildSocialLinks = (input: {
  footer: SiteConfigFooter | null | undefined;
  about: SiteConfigAbout | null | undefined;
  fallback: SocialLink[];
}): SocialLink[] => {
  const byPlatform = new Map<string, SocialLink>()
  for (const item of input.fallback) byPlatform.set(item.platform, item)

  const github = input.footer?.github ?? byPlatform.get('GitHub')?.url
  const linkedin = input.footer?.linkedin ?? byPlatform.get('LinkedIn')?.url
  const email = input.about?.email
    ? `mailto:${input.about.email}`
    : byPlatform.get('Email')?.url

  const next: SocialLink[] = []
  if (github) next.push({ platform: 'GitHub', url: github, icon: 'mdi-github' })
  if (linkedin) next.push({ platform: 'LinkedIn', url: linkedin, icon: 'mdi-linkedin' })
  if (email) next.push({ platform: 'Email', url: email, icon: 'mdi-email' })

  const instagram = input.footer?.instagram
  if (instagram) next.push({ platform: 'Instagram', url: instagram, icon: 'mdi-instagram' })

  return next
}

export const ensureSiteConfigsData = (data: SiteConfigsData | null | undefined): SiteConfigsData => {
  return {
    system: data?.system ?? null,
    home: data?.home ?? null,
    about: data?.about ?? null,
    footer: data?.footer ?? null
  }
}

const isHexColor = (value: string): boolean => {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
}

export const resolveThemeColors = (system: SiteConfigSystem | null | undefined): { primary: string; secondary: string } => {
  const primary = typeof system?.primary_color === 'string' && isHexColor(system.primary_color)
    ? system.primary_color
    : '#1976D2'

  const secondary = typeof system?.secondary_color === 'string' && isHexColor(system.secondary_color)
    ? system.secondary_color
    : '#42A5F5'

  return { primary, secondary }
}
