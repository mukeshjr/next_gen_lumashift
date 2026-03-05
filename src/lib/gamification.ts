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
  | 'first_login';

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
    default:                  return 0;
  }
}

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
    icon: '🌟',
    color: 'bg-blue-500',
  },
  {
    id: 'career_explorer',
    name: 'Career Explorer',
    description: 'Explored 3 or more cybersecurity career roles',
    icon: '🗺️',
    color: 'bg-green-500',
  },
  {
    id: 'cyber_learner',
    name: 'Cyber Learner',
    description: 'Read 5 or more blog posts',
    icon: '📚',
    color: 'bg-purple-500',
  },
  {
    id: 'quiz_finisher',
    name: 'Quiz Finisher',
    description: 'Completed the Cybersecurity Career Quiz',
    icon: '🎯',
    color: 'bg-orange-500',
  },
  {
    id: 'role_explorer',
    name: 'Role Explorer',
    description: 'Used the Compare Roles tool',
    icon: '⚖️',
    color: 'bg-yellow-500',
  },
  {
    id: 'resource_collector',
    name: 'Resource Collector',
    description: 'Saved 3 or more resources to your library',
    icon: '📁',
    color: 'bg-pink-500',
  },
  {
    id: 'career_ready',
    name: 'Career Ready',
    description: 'Completed 70% or more of your profile',
    icon: '🚀',
    color: 'bg-orange-600',
  },
];

export interface BadgeCheckContext {
  profileScore: number;
  rolesExplored: number;
  blogsRead: number;
  quizzesTaken: number;
  rolesCompared: number;
  resourcesSaved: number;
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

  return earned;
}
