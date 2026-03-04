export interface Service {
  id: string;
  title: string;
  tier: 'starter' | 'professional' | 'advanced';
  tag?: string;
  forWho: string;
  description: string;
  outcomes: string[];
  price?: string;
  duration?: string;
  track?: string;
  popular?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  published: boolean;
  coverImage?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'template' | 'checklist' | 'guide' | 'video';
  free: boolean;
  downloadUrl?: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  outcome: string;
  avatar?: string;
  linkedIn?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  certifications: string[];
  linkedIn: string;
  email?: string;
  avatar?: string;
}

export interface RoleData {
  id: string;
  title: string;
  icon: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
  tools: string[];
  certifications: string[];
  backgroundFit: string[];
  growthPath: string[];
  avgSalaryMY?: string;
  avgSalaryGlobal?: string;
  demandLevel: 'High' | 'Very High' | 'Critical';
  recommendedServices: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options?: { value: string; label: string }[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

export interface QuizResult {
  confidenceScore: number;
  recommendedRoles: string[];
  recommendedServices: string[];
  strengths: string[];
  gaps: string[];
  talkToCoach: boolean;
}

export interface FormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  careerGoal?: string;
  experienceLevel?: string;
  formType: 'contact' | 'resource_unlock' | 'quiz_result';
}
