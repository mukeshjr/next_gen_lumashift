import type { ReadinessAssessment } from '@/types';

interface ReadinessInput {
  profileScore: number;          // 0-100
  quizConfidence: number | null; // 0-5 scale (will be normalized to 0-100)
  skillsCoverage: number;        // 0-100 (matched skills / required skills)
  certProgress: number;          // 0-100 (obtained / stage certs)
  activitiesCount: number;       // total activity events
  savedItemsCount: number;       // total saved items
}

const WEIGHTS = {
  profileCompleteness: 0.20,
  quizConfidence: 0.15,
  skillsCoverage: 0.25,
  certProgress: 0.15,
  activityEngagement: 0.10,
  resourceConsumption: 0.15,
} as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function computeReadinessScore(input: ReadinessInput): ReadinessAssessment {
  const profileCompleteness = clamp(input.profileScore);
  const quizConfidence = input.quizConfidence != null
    ? clamp((input.quizConfidence / 5) * 100)
    : 0;
  const skillsCoverage = clamp(input.skillsCoverage);
  const certProgress = clamp(input.certProgress);
  const activityEngagement = clamp(Math.min(input.activitiesCount * 5, 100));
  const resourceConsumption = clamp(Math.min(input.savedItemsCount * 15, 100));

  const overallScore = Math.round(
    profileCompleteness * WEIGHTS.profileCompleteness +
    quizConfidence * WEIGHTS.quizConfidence +
    skillsCoverage * WEIGHTS.skillsCoverage +
    certProgress * WEIGHTS.certProgress +
    activityEngagement * WEIGHTS.activityEngagement +
    resourceConsumption * WEIGHTS.resourceConsumption,
  );

  const label =
    overallScore >= 80 ? 'Expert' :
    overallScore >= 60 ? 'Advanced' :
    overallScore >= 35 ? 'Building' :
                         'Foundation';

  const nextMilestone =
    overallScore >= 80 ? 'You\'re career-ready! Consider leadership roles.' :
    overallScore >= 60 ? 'Push past 80 to reach Expert readiness.' :
    overallScore >= 35 ? 'Build skills and certifications to reach Advanced.' :
                         'Complete your profile and take the quiz to get started.';

  return {
    overallScore,
    profileCompleteness,
    quizConfidence,
    skillsCoverage,
    certProgress,
    activityEngagement,
    resourceConsumption,
    label,
    nextMilestone,
  };
}
