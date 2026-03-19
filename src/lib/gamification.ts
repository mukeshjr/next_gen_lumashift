export const POINTS = {
  FIRST_LOGIN:        20,
  PROFILE_FIELD:      10,  // per completed field group
  QUIZ_COMPLETED:     50,
  BLOG_READ:           5,
  RESOURCE_SAVED:     10,
  ROLE_EXPLORED:      10,
  ROLES_COMPARED:     15,
  SERVICE_VIEWED:      5,
  SERVICE_REQUESTED:  25,
  ROADMAP_VIEWED:     10,
  SKILL_GAP_VIEWED:   10,
  PROFILE_COMPLETED:  30,
} as const;

export type EventType =
  | 'blog_read'
  | 'resource_view'
  | 'resource_saved'
  | 'quiz_attempt'
  | 'role_explored'
  | 'roles_compared'
  | 'service_viewed'
  | 'service_requested'
  | 'profile_updated'
  | 'first_login'
  | 'roadmap_viewed'
  | 'skill_gap_viewed'
  | 'profile_completed';

export function pointsForEvent(event: EventType): number {
  switch (event) {
    case 'first_login':       return POINTS.FIRST_LOGIN;
    case 'quiz_attempt':      return POINTS.QUIZ_COMPLETED;
    case 'blog_read':         return POINTS.BLOG_READ;
    case 'resource_saved':    return POINTS.RESOURCE_SAVED;
    case 'resource_view':     return 0;
    case 'role_explored':     return POINTS.ROLE_EXPLORED;
    case 'roles_compared':    return POINTS.ROLES_COMPARED;
    case 'service_viewed':    return POINTS.SERVICE_VIEWED;
    case 'service_requested': return POINTS.SERVICE_REQUESTED;
    case 'profile_updated':   return POINTS.PROFILE_FIELD;
    case 'roadmap_viewed':    return POINTS.ROADMAP_VIEWED;
    case 'skill_gap_viewed':  return POINTS.SKILL_GAP_VIEWED;
    case 'profile_completed': return POINTS.PROFILE_COMPLETED;
    default:                  return 0;
  }
}

/* ─── Badges ──────────────────────────────────────────────────────────────── */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGES: Badge[] = [
  {
    id: 'profile_starter',
    name: 'Profile Starter',
    description: 'Completed at least 20% of your profile',
    icon: '\u{1F31F}',
    color: 'bg-blue-500',
  },
  {
    id: 'career_explorer',
    name: 'Career Explorer',
    description: 'Explored 3 or more cybersecurity career roles',
    icon: '\u{1F5FA}\u{FE0F}',
    color: 'bg-green-500',
  },
  {
    id: 'cyber_learner',
    name: 'Cyber Learner',
    description: 'Read 5 or more blog posts',
    icon: '\u{1F4DA}',
    color: 'bg-purple-500',
  },
  {
    id: 'quiz_finisher',
    name: 'Quiz Finisher',
    description: 'Completed the Cybersecurity Career Quiz',
    icon: '\u{1F3AF}',
    color: 'bg-orange-500',
  },
  {
    id: 'role_explorer',
    name: 'Role Explorer',
    description: 'Used the Compare Roles tool',
    icon: '\u{2696}\u{FE0F}',
    color: 'bg-yellow-500',
  },
  {
    id: 'resource_collector',
    name: 'Resource Collector',
    description: 'Saved 3 or more resources to your library',
    icon: '\u{1F4C1}',
    color: 'bg-pink-500',
  },
  {
    id: 'career_ready',
    name: 'Career Ready',
    description: 'Completed 70% or more of your profile',
    icon: '\u{1F680}',
    color: 'bg-orange-600',
  },
  // ─── New Badges ────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Engaged 3 days in a row',
    icon: '\u{1F525}',
    color: 'bg-red-500',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Engaged 7 days in a row',
    icon: '\u{1F525}',
    color: 'bg-red-600',
  },
  {
    id: 'roadmap_viewer',
    name: 'Pathfinder',
    description: 'Viewed the Career Roadmap',
    icon: '\u{1F9ED}',
    color: 'bg-indigo-500',
  },
  {
    id: 'skill_gap_viewer',
    name: 'Self Aware',
    description: 'Viewed Skill Gap Analysis',
    icon: '\u{1F50D}',
    color: 'bg-teal-500',
  },
  {
    id: 'services_explorer',
    name: 'Service Scout',
    description: 'Viewed 3+ services',
    icon: '\u{1F52D}',
    color: 'bg-violet-500',
  },
  {
    id: 'first_save',
    name: 'First Bookmark',
    description: 'Saved first item',
    icon: '\u{1F516}',
    color: 'bg-sky-500',
  },
  {
    id: 'cert_planner',
    name: 'Cert Strategist',
    description: 'Added planned certifications',
    icon: '\u{1F4DC}',
    color: 'bg-amber-500',
  },
  {
    id: 'profile_complete',
    name: 'Identity Forged',
    description: '100% profile completion',
    icon: '\u{1F6E1}\u{FE0F}',
    color: 'bg-emerald-500',
  },
];

/* ─── Badge Check ─────────────────────────────────────────────────────────── */

export interface BadgeCheckContext {
  profileScore: number;
  rolesExplored: number;
  blogsRead: number;
  quizzesTaken: number;
  rolesCompared: number;
  resourcesSaved: number;
  servicesViewed: number;
  roadmapViewed: boolean;
  skillGapViewed: boolean;
  hasSavedItem: boolean;
  hasCertPlanned: boolean;
  profileComplete: boolean;
  streakDays: number;
}

export function checkEarnedBadges(ctx: BadgeCheckContext): string[] {
  const earned: string[] = [];

  if (ctx.profileScore >= 20)   earned.push('profile_starter');
  if (ctx.rolesExplored >= 3)   earned.push('career_explorer');
  if (ctx.blogsRead >= 5)       earned.push('cyber_learner');
  if (ctx.quizzesTaken >= 1)    earned.push('quiz_finisher');
  if (ctx.rolesCompared >= 1)   earned.push('role_explorer');
  if (ctx.resourcesSaved >= 3)  earned.push('resource_collector');
  if (ctx.profileScore >= 70)   earned.push('career_ready');

  // New badge checks
  if (ctx.streakDays >= 3)      earned.push('streak_3');
  if (ctx.streakDays >= 7)      earned.push('streak_7');
  if (ctx.roadmapViewed)        earned.push('roadmap_viewer');
  if (ctx.skillGapViewed)       earned.push('skill_gap_viewer');
  if (ctx.servicesViewed >= 3)  earned.push('services_explorer');
  if (ctx.hasSavedItem)         earned.push('first_save');
  if (ctx.hasCertPlanned)       earned.push('cert_planner');
  if (ctx.profileComplete)      earned.push('profile_complete');

  return earned;
}

/* ─── Milestone Tiers ─────────────────────────────────────────────────────── */

export type MilestoneTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  tier: MilestoneTier;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'You have taken your first steps into cybersecurity',
    pointsRequired: 20,
    icon: '\u{1F463}',
    tier: 'bronze',
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'You are building momentum on your journey',
    pointsRequired: 50,
    icon: '\u{1F331}',
    tier: 'bronze',
  },
  {
    id: 'foundation_built',
    name: 'Foundation Built',
    description: 'A solid foundation for your cyber career',
    pointsRequired: 100,
    icon: '\u{1F3D7}\u{FE0F}',
    tier: 'silver',
  },
  {
    id: 'growing_fast',
    name: 'Growing Fast',
    description: 'Your skills are growing rapidly',
    pointsRequired: 200,
    icon: '\u{1F4C8}',
    tier: 'silver',
  },
  {
    id: 'interview_ready',
    name: 'Interview Ready',
    description: 'You are prepared to ace interviews',
    pointsRequired: 350,
    icon: '\u{1F3A4}',
    tier: 'gold',
  },
  {
    id: 'career_ready_milestone',
    name: 'Career Ready',
    description: 'Ready to launch your cybersecurity career',
    pointsRequired: 500,
    icon: '\u{1F680}',
    tier: 'gold',
  },
  {
    id: 'cyber_professional',
    name: 'Cyber Professional',
    description: 'A true cybersecurity professional',
    pointsRequired: 750,
    icon: '\u{1F9D1}\u{200D}\u{1F4BB}',
    tier: 'platinum',
  },
  {
    id: 'career_master',
    name: 'Career Master',
    description: 'You have mastered the art of career growth',
    pointsRequired: 1000,
    icon: '\u{1F451}',
    tier: 'diamond',
  },
];

export function getCurrentMilestone(totalPoints: number): Milestone {
  let current = MILESTONES[0];
  for (const m of MILESTONES) {
    if (totalPoints >= m.pointsRequired) {
      current = m;
    } else {
      break;
    }
  }
  return current;
}

export function getNextMilestone(totalPoints: number): Milestone | null {
  for (const m of MILESTONES) {
    if (totalPoints < m.pointsRequired) {
      return m;
    }
  }
  return null;
}

export function getMilestoneProgress(totalPoints: number): {
  current: Milestone;
  next: Milestone | null;
  progress: number;
} {
  const current = getCurrentMilestone(totalPoints);
  const next = getNextMilestone(totalPoints);

  if (!next) {
    return { current, next: null, progress: 100 };
  }

  const range = next.pointsRequired - current.pointsRequired;
  const earned = totalPoints - current.pointsRequired;
  const progress = Math.min(Math.max(Math.round((earned / range) * 100), 0), 100);

  return { current, next, progress };
}

/* ─── Tier Styling Helpers ────────────────────────────────────────────────── */

export const TIER_COLORS: Record<MilestoneTier, { bg: string; text: string; border: string; glow: string }> = {
  bronze:   { bg: 'bg-amber-900/20',   text: 'text-amber-500',    border: 'border-amber-700/40',   glow: 'shadow-[0_0_20px_rgba(217,119,6,0.15)]' },
  silver:   { bg: 'bg-gray-400/20',     text: 'text-gray-300',     border: 'border-gray-500/40',    glow: 'shadow-[0_0_20px_rgba(156,163,175,0.15)]' },
  gold:     { bg: 'bg-yellow-500/20',   text: 'text-yellow-400',   border: 'border-yellow-500/40',  glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]' },
  platinum: { bg: 'bg-cyan-500/20',     text: 'text-cyan-400',     border: 'border-cyan-500/40',    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]' },
  diamond:  { bg: 'bg-violet-500/20',   text: 'text-violet-400',   border: 'border-violet-500/40',  glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' },
};
