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
  visualType?: 'threat-landscape' | 'career-path' | 'concept-diagram' | 'timeline' | 'comparison-table';
  keyTakeaways?: string[];
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

// ─── User / Auth Types ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  location: string | null;
  job_role: string | null;
  years_experience: number | null;
  career_stage: string | null;
  target_roles: string[];
  current_skills: string[];
  certifications_obtained: string[];
  certifications_planned: string[];
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  event_type: string;
  item_id: string | null;
  item_title: string | null;
  metadata: Record<string, unknown>;
  points_awarded: number;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'blog_post' | 'resource';
  item_id: string;
  item_title: string;
  item_data: Record<string, unknown>;
  created_at: string;
}

export interface QuizResultRecord {
  id: string;
  user_id: string;
  confidence_score: number;
  recommended_roles: string[];
  recommended_services: string[];
  strengths: string[];
  gaps: string[];
  talk_to_coach: boolean;
  answers: Record<string, unknown>;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_description: string | null;
  badge_icon: string | null;
  earned_at: string;
}

export interface ServiceInterest {
  id: string;
  user_id: string;
  service_id: string;
  service_title: string | null;
  interest_type: 'viewed' | 'requested' | 'subscribed' | 'coaching_requested';
  metadata: Record<string, unknown>;
  created_at: string;
}
