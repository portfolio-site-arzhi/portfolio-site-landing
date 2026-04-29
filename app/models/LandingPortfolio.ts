import type { LocalizedText } from './SiteConfig'

export type LandingPortfolioLocalizedField = LocalizedText | string | null | undefined

export interface LandingPortfolioStackDto {
  id: number;
  display_order?: number | null;
  name?: string | null;
}

export interface LandingPortfolioDto {
  id: number;
  slug?: string | null;
  display_order?: number | null;
  title?: string | null;
  description?: LandingPortfolioLocalizedField;
  contribution?: LandingPortfolioLocalizedField;
  outcome?: LandingPortfolioLocalizedField;
  image?: string | null;
  role?: string | null;
  live_url?: string | null;
  github_url?: string | null;
  stacks?: LandingPortfolioStackDto[] | null;
}

export interface LandingPortfoliosResponse {
  data: LandingPortfolioDto[];
}

export interface LandingPortfolioDetailResponse {
  data: LandingPortfolioDto | null;
}
