import type { H3Event } from 'h3'
import type { LandingCertificationDto, LandingCertificationsResponse } from '../../app/models/LandingCertification'
import type { LandingEducationDto, LandingEducationsResponse } from '../../app/models/LandingEducation'
import type { LandingExperienceDto, LandingExperiencesResponse } from '../../app/models/LandingExperience'
import type { LandingSkillsResponse } from '../../app/models/LandingSkill'
import { sanitizeCertificationHtmlServer } from '../../app/utils/certificationHtml'
import { sanitizeEducationHtmlServer } from '../../app/utils/educationHtml'
import { sanitizeExperienceHtmlServer } from '../../app/utils/experienceHtml'
import { sanitizeLocalizedTextOrStringServer } from '../../app/utils/sanitizeHtml'
import { fetchFromBackend, getBackendUrl } from './backendConfig'

const serviceUnavailableError = () => createError({ statusCode: 503, statusMessage: 'Service Unavailable' })

const sanitizeLandingExperienceDto = async (
  dto: LandingExperienceDto
): Promise<LandingExperienceDto> => {
  const description = dto.description
  if (!description) return dto

  return {
    ...dto,
    description: {
      id: await sanitizeExperienceHtmlServer(description.id ?? ''),
      en: await sanitizeExperienceHtmlServer(description.en ?? '')
    }
  }
}

const sanitizeLandingEducationDto = async (
  dto: LandingEducationDto
): Promise<LandingEducationDto> => {
  const nextDescription = await sanitizeLocalizedTextOrStringServer(dto.description)
  const nextDescriptionEn = typeof dto.description_en === 'string'
    ? await sanitizeEducationHtmlServer(dto.description_en)
    : dto.description_en

  return {
    ...dto,
    description: nextDescription,
    description_en: nextDescriptionEn
  }
}

const sanitizeLandingCertificationDto = async (
  dto: LandingCertificationDto
): Promise<LandingCertificationDto> => {
  const nextDescription = await sanitizeLocalizedTextOrStringServer(dto.description)
  const nextDescriptionEn = typeof dto.description_en === 'string'
    ? await sanitizeCertificationHtmlServer(dto.description_en)
    : dto.description_en

  return {
    ...dto,
    description: nextDescription,
    description_en: nextDescriptionEn
  }
}

export const fetchLandingExperiencesFromBackend = async (
  event: H3Event
): Promise<LandingExperiencesResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) return { data: [] }

  try {
    const res = await fetchFromBackend<LandingExperiencesResponse>(backendUrl, '/landing/experiences')
    const data = Array.isArray(res?.data)
      ? await Promise.all(res.data.map(async (item) => await sanitizeLandingExperienceDto(item)))
      : []

    return { data }
  } catch {
    throw serviceUnavailableError()
  }
}

export const fetchLandingEducationsFromBackend = async (
  event: H3Event
): Promise<LandingEducationsResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) return { data: [] }

  try {
    const res = await fetchFromBackend<LandingEducationsResponse>(backendUrl, '/landing/educations')
    const data = Array.isArray(res?.data)
      ? await Promise.all(res.data.map(async (item) => await sanitizeLandingEducationDto(item)))
      : []

    return { data }
  } catch {
    throw serviceUnavailableError()
  }
}

export const fetchLandingCertificationsFromBackend = async (
  event: H3Event
): Promise<LandingCertificationsResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) return { data: [] }

  try {
    const res = await fetchFromBackend<LandingCertificationsResponse>(backendUrl, '/landing/certifications')
    const data = Array.isArray(res?.data)
      ? await Promise.all(res.data.map(async (item) => await sanitizeLandingCertificationDto(item)))
      : []

    return { data }
  } catch {
    throw serviceUnavailableError()
  }
}

export const fetchLandingSkillsFromBackend = async (
  event: H3Event
): Promise<LandingSkillsResponse> => {
  const backendUrl = getBackendUrl(event)
  if (!backendUrl) return { data: [] }

  try {
    const res = await fetchFromBackend<LandingSkillsResponse>(backendUrl, '/landing/skills')
    return {
      data: Array.isArray(res?.data) ? res.data : []
    }
  } catch {
    throw serviceUnavailableError()
  }
}
