export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials: SocialLink[];
}
