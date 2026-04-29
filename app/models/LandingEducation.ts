import type { LocalizedText } from './SiteConfig'

export interface LandingEducationDto {
  id: number;
  sort?: number | null;
  sort_order?: number | null;
  institution_name?: string | null;
  degree?: LocalizedText | string | null;
  degree_en?: string | null;
  field_of_study?: LocalizedText | string | null;
  field_of_study_en?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: LocalizedText | string | null;
  description_en?: string | null;
  location?: string | null;
}

export interface LandingEducationsResponse {
  data: LandingEducationDto[];
}

