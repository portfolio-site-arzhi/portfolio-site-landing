export type LocaleCode = 'id' | 'en'

export type LocalizedText = Partial<Record<LocaleCode, string | null>> | null

export interface SiteConfigSystem {
  primary_color?: string | null;
  secondary_color?: string | null;
}

export interface SiteConfigHome {
  name?: string | null;
  position?: string | null;
  description?: LocalizedText;
  photo?: string | null;
}

export interface SiteConfigAbout {
  about_me?: LocalizedText;
  email?: string | null;
}

export interface SiteConfigFooter {
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
}

export interface SiteConfigsData {
  system: SiteConfigSystem | null;
  home: SiteConfigHome | null;
  about: SiteConfigAbout | null;
  footer: SiteConfigFooter | null;
}

export interface SiteConfigsResponse {
  data: SiteConfigsData;
}
