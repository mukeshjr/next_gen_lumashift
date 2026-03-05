export interface ProfileData {
  name?: string | null;
  location?: string | null;
  current_role?: string | null;
  years_experience?: number | null;
  career_stage?: string | null;
  target_roles?: string[] | null;
  current_skills?: string[] | null;
  certifications_obtained?: string[] | null;
  certifications_planned?: string[] | null;
}

interface FieldWeight {
  label: string;
  weight: number;
  check: (p: ProfileData) => boolean;
}

const FIELDS: FieldWeight[] = [
  { label: 'Name',                  weight: 15, check: (p) => !!p.name?.trim() },
  { label: 'Current Role',          weight: 15, check: (p) => !!p.current_role?.trim() },
  { label: 'Target Roles',          weight: 20, check: (p) => (p.target_roles?.length ?? 0) > 0 },
  { label: 'Current Skills',        weight: 20, check: (p) => (p.current_skills?.length ?? 0) > 0 },
  { label: 'Years of Experience',   weight: 10, check: (p) => p.years_experience != null },
  { label: 'Career Stage',          weight: 10, check: (p) => !!p.career_stage },
  { label: 'Location',              weight:  5, check: (p) => !!p.location?.trim() },
  { label: 'Certifications Earned', weight:  5, check: (p) => (p.certifications_obtained?.length ?? 0) > 0 },
];

export function computeProfileCompletion(profile: ProfileData): {
  score: number;
  label: string;
  missingFields: string[];
  completedFields: string[];
} {
  let score = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  for (const field of FIELDS) {
    if (field.check(profile)) {
      score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  }

  const label =
    score <= 20 ? 'Beginner' :
    score <= 40 ? 'Exploring' :
    score <= 70 ? 'Developing' :
    score <= 90 ? 'Career Ready' :
                  'Cyber Ready';

  return { score, label, missingFields, completedFields };
}
