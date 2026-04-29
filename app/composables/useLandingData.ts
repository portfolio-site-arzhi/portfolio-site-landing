import type { Profile } from '../models/Profile'
import type { Experience } from '../models/Experience'
import type { Education } from '../models/Education'
import type { Certification } from '../models/Certification'
import { buildSocialLinks, pickLocalizedText } from '../utils/siteConfig'

export const useLandingData = () => {
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useI18n()
  const { siteConfigs, hasBackendError: hasSiteConfigsBackendError } = useSiteConfigs()
  const siteTitle = String(runtimeConfig.public.siteTitle || '').trim()

  const profileFallback = useState<Profile>('profile', () => ({
    name: siteTitle || 'Your Name',
    role: 'Frontend Developer',
    bio: 'Tulis deskripsi singkat tentang Anda atau produk Anda.',
    avatar: '/avatar-placeholder.svg',
    socials: []
  }))

  const profile = computed<Profile>(() => {
    const base = profileFallback.value
    const home = siteConfigs.value.home
    const about = siteConfigs.value.about
    const footer = siteConfigs.value.footer

    const bio = pickLocalizedText(home?.description, locale.value) ?? base.bio

    return {
      ...base,
      name: home?.name ?? base.name,
      role: home?.position ?? base.role,
      bio,
      avatar: home?.photo ?? base.avatar,
      socials: buildSocialLinks({ footer, about, fallback: base.socials })
    }
  })

  const aboutMe = computed<string>(() => {
    return pickLocalizedText(siteConfigs.value.about?.about_me, locale.value) ?? profile.value.bio
  })

  const experiences = useState<Experience[]>('experiences', () => [])

  const educations = useState<Education[]>('educations', () => [])

  const certifications = useState<Certification[]>('certifications', () => [])
  return {
    profile,
    aboutMe,
    experiences,
    educations,
    certifications,
    hasSiteConfigsBackendError
  }
}
