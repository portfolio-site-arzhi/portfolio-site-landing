import type { LocalizedText } from './SiteConfig'

export interface LandingExperienceSkillDto {
  id: number;
  skill_name: string;
  sort?: number | null;
}

export interface LandingExperienceDto {
  id: number;
  sort?: number | null;
  role?: LocalizedText;
  company_name?: string | null;
  company_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean | null;
  description?: LocalizedText;
  skills?: LandingExperienceSkillDto[] | null;
}

export interface LandingExperiencesResponse {
  data: LandingExperienceDto[];
}

