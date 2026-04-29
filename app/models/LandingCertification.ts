import type { LocalizedText } from './SiteConfig'

export interface LandingCertificationDto {
  id: number;
  sort?: number | null;
  sort_order?: number | null;
  name?: LocalizedText | string | null;
  name_en?: string | null;
  issuing_organization?: string | null;
  issue_date?: string | null;
  description?: LocalizedText | string | null;
  description_en?: string | null;
  credential_url?: string | null;
}

export interface LandingCertificationsResponse {
  data: LandingCertificationDto[];
}

