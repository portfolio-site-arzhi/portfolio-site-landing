export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issuedAt: string;
  credentialUrl?: string;
  description?: string;
  highlights?: string[];
}
