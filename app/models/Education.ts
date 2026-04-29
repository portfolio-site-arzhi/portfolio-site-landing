export interface Education {
  id: number;
  institution: string;
  program: string;
  period: string;
  location?: string;
  description?: string;
  highlights?: string[];
}
