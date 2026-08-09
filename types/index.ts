export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  architecture: string; // Detail or Mermaid markup
  features: string[];
  images: string[];
  tags: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  outcome: string;
  dbDesign?: string;
  challenges: string;
  lessonsLearned: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100 proficiency
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'devops' | 'languages';
  iconName: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  iconName: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education' | 'achievement';
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  pdfUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  isPlaceholder?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}
