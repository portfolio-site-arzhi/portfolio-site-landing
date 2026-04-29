export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  role?: string;
  contribution?: string;
  stack: string[];
  outcome?: string;
  link?: string;
  github?: string;
}
