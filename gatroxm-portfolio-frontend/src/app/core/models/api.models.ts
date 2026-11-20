export interface Stat {
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
}

export interface FlowStep {
  title: string;
  text: string;
}

export interface Profile {
  name: string;
  brand: string;
  roles: string[];
  title: string;
  location: string;
  lead: string;
  stats: Stat[];
  about: { paragraphs: string[]; flow: FlowStep[] };
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    whatsapp: string;
    linkedin: string;
    github: string;
  };
  resumeHref: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: 'web' | 'architecture' | 'ai';
  tags: string[];
  featured: boolean;
  links: { demo?: string; repo?: string };
  media: { poster?: string; webm?: string; mp4?: string; pngSequence?: string };
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  tags: string[];
  bullets: string[];
  order: number;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
  order: number;
}

export interface EducationItem {
  id: string;
  type: 'education' | 'certification' | 'language';
  title: string;
  org: string;
  year: string;
  href?: string;
  order: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  source: 'ai' | 'knowledge';
  suggestions?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt: string | null;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: { username: string; role: string };
}

export interface AuthUser {
  username: string;
  role: string;
}
