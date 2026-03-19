import { services } from '@/data/services';
import { blogPosts } from '@/data/blog-posts';
import { resources } from '@/data/resources';
import { roles } from '@/data/roles';

// ─── Input / Output Types ────────────────────────────────────────────────────

export interface RecommendationInput {
  profile: {
    career_stage: string | null;
    target_roles: string[];
    current_skills: string[];
    years_experience: number | null;
    certifications_obtained: string[];
    certifications_planned: string[];
    job_role: string | null;
  } | null;
  quizResult: {
    confidence_score: number;
    recommended_roles: string[];
    recommended_services: string[];
    strengths: string[];
    gaps: string[];
    talk_to_coach: boolean;
  } | null;
  profileScore: number;
  activitiesCompleted: string[];
  savedItemIds: string[];
  readBlogSlugs: string[];
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium';
  href: string;
  icon: string;
  category: 'profile' | 'skill' | 'content' | 'service' | 'tool';
}

export interface ServiceRecommendation {
  serviceId: string;
  title: string;
  reason: string;
  matchScore: number;
  tier: string;
  price: string;
}

export interface ContentRecommendation {
  type: 'blog' | 'resource';
  id: string;
  title: string;
  reason: string;
  relevanceScore: number;
}

export interface RoleRecommendation {
  roleId: string;
  title: string;
  matchReason: string;
  fitScore: number;
}

export interface Recommendations {
  nextActions: NextAction[];
  services: ServiceRecommendation[];
  content: ContentRecommendation[];
  roles: RoleRecommendation[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  return na.includes(nb) || nb.includes(na);
}

function overlapCount(a: string[], b: string[]): number {
  let count = 0;
  for (const x of a) {
    for (const y of b) {
      if (fuzzyMatch(x, y)) {
        count++;
        break;
      }
    }
  }
  return count;
}

/**
 * Map career_stage strings to tier preferences for service scoring.
 */
function stageTierAffinity(stage: string | null): Record<string, number> {
  switch (stage) {
    case 'Student':
    case 'Fresh Graduate':
      return { starter: 1.0, professional: 0.6, advanced: 0.3 };
    case 'Early Career':
      return { starter: 0.7, professional: 1.0, advanced: 0.5 };
    case 'Mid Career':
      return { starter: 0.3, professional: 0.8, advanced: 1.0 };
    case 'Senior':
    case 'Management':
      return { starter: 0.1, professional: 0.5, advanced: 1.0 };
    default:
      return { starter: 0.5, professional: 0.7, advanced: 0.5 };
  }
}

// ─── Next Actions ────────────────────────────────────────────────────────────

function buildNextActions(input: RecommendationInput): NextAction[] {
  const actions: NextAction[] = [];

  // 1. Profile completion
  if (input.profileScore < 50) {
    actions.push({
      id: 'complete-profile',
      title: 'Complete your profile',
      description: 'A complete profile unlocks personalised recommendations and career insights.',
      priority: 'urgent',
      href: '/profile',
      icon: 'UserCircle',
      category: 'profile',
    });
  }

  // 2. Quiz
  if (!input.quizResult) {
    actions.push({
      id: 'take-quiz',
      title: 'Take the Career Quiz',
      description: 'Discover your best-fit cybersecurity roles and get personalised guidance.',
      priority: 'urgent',
      href: '/quiz',
      icon: 'ClipboardCheck',
      category: 'tool',
    });
  }

  // 3-5. Gap-based actions
  const gaps = input.quizResult?.gaps ?? [];
  const gapLower = gaps.map((g) => g.toLowerCase());

  if (gapLower.some((g) => g.includes('resume'))) {
    actions.push({
      id: 'resume-review',
      title: 'Get a Resume Review',
      description: 'Your quiz flagged resume as a gap. A professional review can make a big difference.',
      priority: 'high',
      href: '/services',
      icon: 'FileText',
      category: 'service',
    });
  }

  if (gapLower.some((g) => g.includes('interview'))) {
    actions.push({
      id: 'mock-interview',
      title: 'Try Mock Interviews',
      description: 'Build confidence with realistic interview simulations and expert feedback.',
      priority: 'high',
      href: '/services',
      icon: 'MessageSquare',
      category: 'service',
    });
  }

  if (gapLower.some((g) => g.includes('linkedin'))) {
    actions.push({
      id: 'linkedin-optimise',
      title: 'Optimise your LinkedIn',
      description: 'A strong LinkedIn profile attracts recruiters and opens doors.',
      priority: 'high',
      href: '/services',
      icon: 'Linkedin',
      category: 'service',
    });
  }

  // 6. Low confidence
  if (input.quizResult && input.quizResult.confidence_score < 3) {
    actions.push({
      id: 'book-consultation',
      title: 'Book a Career Consultation',
      description: 'Your confidence score suggests a 1-on-1 session could provide clarity.',
      priority: 'high',
      href: '/contact',
      icon: 'Phone',
      category: 'service',
    });
  }

  // 7. No blogs read
  if (input.readBlogSlugs.length === 0) {
    actions.push({
      id: 'read-first-blog',
      title: 'Read your first blog post',
      description: 'Stay informed with curated cybersecurity career insights.',
      priority: 'medium',
      href: '/blog',
      icon: 'BookOpen',
      category: 'content',
    });
  }

  // 8. Target roles set but no roadmap viewed
  const targetRoles = input.profile?.target_roles ?? [];
  const hasViewedRoadmap = input.activitiesCompleted.includes('roadmap_viewed');
  if (targetRoles.length > 0 && !hasViewedRoadmap) {
    actions.push({
      id: 'view-roadmap',
      title: 'View your Career Roadmap',
      description: `See the step-by-step pathway to ${targetRoles[0].replace(/-/g, ' ')}.`,
      priority: 'medium',
      href: `/career/${targetRoles[0]}`,
      icon: 'Map',
      category: 'tool',
    });
  }

  // 9. Target roles set — analyse skill gaps
  if (targetRoles.length > 0) {
    actions.push({
      id: 'skill-gap-analysis',
      title: 'Analyse your Skill Gaps',
      description: 'Compare your current skills against what your target role demands.',
      priority: 'medium',
      href: '/compare-roles',
      icon: 'BarChart3',
      category: 'skill',
    });
  }

  // 10. No saved items
  if (input.savedItemIds.length === 0) {
    actions.push({
      id: 'save-resource',
      title: 'Save a resource to your library',
      description: 'Bookmark useful resources so you can find them easily later.',
      priority: 'medium',
      href: '/resources',
      icon: 'Bookmark',
      category: 'content',
    });
  }

  // Return top 5
  return actions.slice(0, 5);
}

// ─── Service Recommendations ─────────────────────────────────────────────────

function buildServiceRecommendations(input: RecommendationInput): ServiceRecommendation[] {
  const quizRecommended = new Set(input.quizResult?.recommended_services ?? []);
  const gaps = input.quizResult?.gaps ?? [];
  const gapLower = gaps.map((g) => g.toLowerCase());
  const stage = input.profile?.career_stage ?? null;
  const tierAffinity = stageTierAffinity(stage);

  const scored: ServiceRecommendation[] = services.map((svc) => {
    // Quiz recommendation signal (40%)
    const quizScore = quizRecommended.has(svc.id) ? 40 : 0;

    // Gap relevance signal (30%)
    let gapScore = 0;
    const svcLower = (svc.title + ' ' + svc.description).toLowerCase();
    for (const gap of gapLower) {
      if (svcLower.includes(gap)) {
        gapScore = 30;
        break;
      }
    }
    // Also check if service relates to target role tracks
    const targetRoles = input.profile?.target_roles ?? [];
    if (gapScore === 0 && svc.track) {
      const trackLower = svc.track.toLowerCase();
      for (const role of targetRoles) {
        if (fuzzyMatch(role, trackLower)) {
          gapScore = 20;
          break;
        }
      }
    }

    // Stage fit signal (30%)
    const stageFit = Math.round((tierAffinity[svc.tier] ?? 0.5) * 30);

    const matchScore = Math.min(100, quizScore + gapScore + stageFit);

    let reason = '';
    if (quizScore > 0) {
      reason = 'Recommended based on your quiz results';
    } else if (gapScore > 0 && gaps.length > 0) {
      reason = `Addresses your identified gap in ${gaps[0]}`;
    } else if (stageFit >= 20) {
      reason = `Great fit for your ${stage ?? 'current'} career stage`;
    } else {
      reason = 'Popular service for cybersecurity professionals';
    }

    return {
      serviceId: svc.id,
      title: svc.title,
      reason,
      matchScore,
      tier: svc.tier,
      price: svc.price ?? 'Contact us',
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 3);
}

// ─── Content Recommendations ─────────────────────────────────────────────────

function buildContentRecommendations(input: RecommendationInput): ContentRecommendation[] {
  const readSlugs = new Set(input.readBlogSlugs);
  const targetRoles = input.profile?.target_roles ?? [];
  const currentSkills = input.profile?.current_skills ?? [];
  const stage = input.profile?.career_stage ?? '';
  const quizRoles = input.quizResult?.recommended_roles ?? [];
  const allRoleKeywords = [...targetRoles, ...quizRoles];

  // Score blog posts
  const blogScored: ContentRecommendation[] = blogPosts
    .filter((post) => post.published && !readSlugs.has(post.slug))
    .map((post) => {
      let score = 0;

      // Tag overlap with target roles / quiz roles
      for (const tag of post.tags) {
        for (const keyword of allRoleKeywords) {
          if (fuzzyMatch(tag, keyword.replace(/-/g, ' '))) {
            score += 25;
            break;
          }
        }
      }

      // Category matching career stage
      if (stage && post.category === 'Career Guide') score += 15;
      if (post.category === 'Certifications') score += 10;

      // Skill relevance
      for (const skill of currentSkills) {
        for (const tag of post.tags) {
          if (fuzzyMatch(skill, tag)) {
            score += 10;
            break;
          }
        }
      }

      // Base relevance for published posts
      score += 5;

      let reason = '';
      const matchedTags = post.tags.filter((tag) =>
        allRoleKeywords.some((kw) => fuzzyMatch(tag, kw.replace(/-/g, ' ')))
      );
      if (matchedTags.length > 0) {
        reason = `Relevant to your interest in ${matchedTags[0]}`;
      } else if (post.category === 'Career Guide') {
        reason = 'Career guidance for your stage';
      } else {
        reason = `${post.category} insights for cybersecurity professionals`;
      }

      return {
        type: 'blog' as const,
        id: post.slug,
        title: post.title,
        reason,
        relevanceScore: Math.min(100, score),
      };
    });

  // Score resources
  const resourceScored: ContentRecommendation[] = resources.map((res) => {
    let score = 0;
    const catLower = res.category.toLowerCase();

    // Match resource category to target roles
    for (const role of allRoleKeywords) {
      const roleLower = role.replace(/-/g, ' ').toLowerCase();
      if (catLower.includes(roleLower) || roleLower.includes(catLower.split('/')[0].trim())) {
        score += 30;
        break;
      }
    }

    // SOC/Blue Team resources for SOC-related roles
    if (catLower.includes('soc') && allRoleKeywords.some((r) => r.includes('soc'))) score += 20;
    if (catLower.includes('cloud') && allRoleKeywords.some((r) => r.includes('cloud'))) score += 20;
    if (catLower.includes('grc') && allRoleKeywords.some((r) => r.includes('grc'))) score += 20;
    if (catLower.includes('ot') && allRoleKeywords.some((r) => r.includes('ot'))) score += 20;

    // Resume/interview resources are universally relevant
    if (catLower.includes('resume') || catLower.includes('interview')) score += 15;
    if (catLower.includes('certification')) score += 10;

    // Free resources get a small boost
    if (res.free) score += 5;

    let reason = '';
    if (score >= 30) {
      reason = `Matches your target role interests`;
    } else if (catLower.includes('resume') || catLower.includes('interview')) {
      reason = 'Essential job search resource';
    } else {
      reason = `${res.category} resource for cybersecurity professionals`;
    }

    return {
      type: 'resource' as const,
      id: res.id,
      title: res.title,
      reason,
      relevanceScore: Math.min(100, score),
    };
  });

  // Merge, sort, and return top 3 with a mix
  const all = [...blogScored, ...resourceScored].sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );

  // Ensure at least one of each type if available
  const result: ContentRecommendation[] = [];
  const topBlog = all.find((c) => c.type === 'blog');
  const topResource = all.find((c) => c.type === 'resource');

  if (topBlog) result.push(topBlog);
  if (topResource) result.push(topResource);

  for (const item of all) {
    if (result.length >= 3) break;
    if (!result.some((r) => r.id === item.id)) {
      result.push(item);
    }
  }

  return result.slice(0, 3);
}

// ─── Role Recommendations ────────────────────────────────────────────────────

function buildRoleRecommendations(input: RecommendationInput): RoleRecommendation[] {
  const quizRoles = input.quizResult?.recommended_roles ?? [];
  const currentSkills = input.profile?.current_skills ?? [];
  const stage = input.profile?.career_stage ?? '';
  const targetRoles = input.profile?.target_roles ?? [];

  const scored: RoleRecommendation[] = roles.map((role) => {
    let score = 0;
    const reasons: string[] = [];

    // Quiz recommendation (primary signal — up to 50 points)
    if (quizRoles.includes(role.id)) {
      score += 50;
      reasons.push('quiz-recommended');
    }

    // Skill overlap (up to 30 points)
    if (currentSkills.length > 0 && role.skills.length > 0) {
      const overlap = overlapCount(currentSkills, role.skills);
      const skillScore = Math.round((overlap / role.skills.length) * 30);
      score += skillScore;
      if (overlap > 0) reasons.push(`${overlap} matching skill${overlap > 1 ? 's' : ''}`);
    }

    // Career stage alignment (up to 20 points)
    const entryRoles = ['security-analyst', 'soc-analyst'];
    const midRoles = ['security-engineer', 'grc-analyst', 'cloud-security'];
    const seniorRoles = ['ot-ics-security', 'security-engineer', 'cloud-security'];

    if (stage === 'Student' || stage === 'Fresh Graduate' || stage === 'Early Career') {
      if (entryRoles.includes(role.id)) score += 20;
      else if (midRoles.includes(role.id)) score += 10;
    } else if (stage === 'Mid Career') {
      if (midRoles.includes(role.id)) score += 20;
      else score += 10;
    } else if (stage === 'Senior' || stage === 'Management') {
      if (seniorRoles.includes(role.id)) score += 20;
      else score += 10;
    } else {
      score += 10; // neutral
    }

    // Avoid recommending roles the user already targets (they know about those)
    if (targetRoles.includes(role.id)) {
      score -= 5;
    }

    let matchReason = '';
    if (reasons.includes('quiz-recommended') && reasons.length > 1) {
      matchReason = `Recommended by your quiz with ${reasons.filter((r) => r !== 'quiz-recommended').join(', ')}`;
    } else if (reasons.includes('quiz-recommended')) {
      matchReason = 'Top recommendation from your career quiz';
    } else if (reasons.length > 0) {
      matchReason = `Strong fit based on ${reasons.join(', ')}`;
    } else {
      matchReason = `Good fit for ${stage || 'your'} career stage`;
    }

    return {
      roleId: role.id,
      title: role.title,
      matchReason,
      fitScore: Math.min(100, Math.max(0, score)),
    };
  });

  scored.sort((a, b) => b.fitScore - a.fitScore);
  return scored.slice(0, 2);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function generateRecommendations(input: RecommendationInput): Recommendations {
  return {
    nextActions: buildNextActions(input),
    services: buildServiceRecommendations(input),
    content: buildContentRecommendations(input),
    roles: buildRoleRecommendations(input),
  };
}
