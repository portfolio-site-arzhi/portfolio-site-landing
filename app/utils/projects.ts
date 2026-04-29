import type { Project } from '../models/Project';

export const getProjectBySlug = (projects: Project[], slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

