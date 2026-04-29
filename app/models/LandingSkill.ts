import type { LocalizedText } from './SiteConfig'

export type LandingSkillName = LocalizedText | string | null | undefined
export type SortableLandingSkill = {
  id: number;
  display_order?: number | null;
  sort?: number | null;
}

export interface LandingSkillItemDto {
  id: number;
  name?: LandingSkillName;
  display_order?: number | null;
  sort?: number | null;
}

export interface LandingSkillGroupDto {
  id: number;
  name?: LandingSkillName;
  display_order?: number | null;
  sort?: number | null;
  skills?: LandingSkillItemDto[] | null;
}

export interface LandingSkillsResponse {
  data: LandingSkillGroupDto[];
}
