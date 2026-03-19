'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Lock,
  LogIn,
  Radar,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPathwayByRoleId, getStageIndex } from '@/data/career-pathways';
import { computeReadinessScore } from '@/lib/readiness';
import SkillRadar from '@/components/roadmap/SkillRadar';
import ReadinessScore from '@/components/roadmap/ReadinessScore';
import CareerOutcomes from '@/components/roadmap/CareerOutcomes';
import type {
  UserProfile,
  QuizResultRecord,
  RoleData,
  CareerPathway,
  PathwayStage,
} from '@/types';

/* ────────────────────────────── types ─────────────────────────────── */

interface SkillGapClientProps {
  profile: UserProfile | null;
  latestQuiz: QuizResultRecord | null;
  totalActivities: number;
  totalSavedItems: number;
  profileCompletionScore: number;
  allRoles: RoleData[];
  allPathways: CareerPathway[];
}

interface GapRow {
  skill: string;
  hasSkill: boolean;
  priority: 'Critical' | 'High' | 'Medium';
  action: string;
}

/* ────────────────────────────── helpers ───────────────────────────── */

/** Deterministic pseudo-random between min and max based on a seed string */
function seededRandom(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000;
  return Math.round(min + normalized * (max - min));
}

function getSkillPriority(index: number): 'Critical' | 'High' | 'Medium' {
  if (index < 2) return 'Critical';
  if (index < 4) return 'High';
  return 'Medium';
}

function getSuggestedAction(skill: string, hasSkill: boolean): string {
  if (hasSkill) return 'Keep practicing and stay up to date';
  const lower = skill.toLowerCase();
  if (lower.includes('cert') || lower.includes('iso') || lower.includes('cis'))
    return 'Enroll in a certification prep course';
  if (lower.includes('script') || lower.includes('python') || lower.includes('code'))
    return 'Complete hands-on coding labs and projects';
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure'))
    return 'Set up a cloud lab and practice deployments';
  if (lower.includes('siem') || lower.includes('splunk') || lower.includes('sentinel'))
    return 'Build a home SIEM lab for hands-on practice';
  if (lower.includes('network') || lower.includes('firewall'))
    return 'Study network protocols and use packet capture tools';
  if (lower.includes('risk') || lower.includes('audit') || lower.includes('compliance'))
    return 'Study framework documentation and create sample reports';
  if (lower.includes('leadership') || lower.includes('communication') || lower.includes('stakeholder'))
    return 'Seek mentorship and take on presentation opportunities';
  return 'Explore LumaShift resources and book a coaching session';
}

function getGapWhyItMatters(skill: string): string {
  const lower = skill.toLowerCase();
  if (lower.includes('network') || lower.includes('firewall'))
    return 'Foundational for all security domains';
  if (lower.includes('siem') || lower.includes('log') || lower.includes('detection'))
    return 'Core detection and monitoring capability';
  if (lower.includes('script') || lower.includes('python') || lower.includes('automation'))
    return 'Enables efficiency and advanced analysis';
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure'))
    return 'Fastest-growing area in cybersecurity';
  if (lower.includes('risk') || lower.includes('compliance') || lower.includes('governance'))
    return 'Essential for organizational security posture';
  if (lower.includes('incident') || lower.includes('response'))
    return 'Critical for minimizing breach impact';
  if (lower.includes('threat') || lower.includes('hunting') || lower.includes('mitre'))
    return 'Key to proactive defense strategy';
  return 'Important for role readiness and career growth';
}

/* ────────────────────────────── sample data for guest view ────────── */

const SAMPLE_RADAR_SKILLS = [
  { name: 'Network Fundamentals', current: 25, required: 80 },
  { name: 'SIEM Platforms', current: 15, required: 80 },
  { name: 'Incident Response', current: 20, required: 80 },
  { name: 'Log Analysis', current: 30, required: 80 },
  { name: 'Basic Scripting', current: 10, required: 80 },
  { name: 'Vuln Scanning', current: 18, required: 80 },
];

/* ────────────────────────────── component ─────────────────────────── */

export default function SkillGapClient({
  profile,
  latestQuiz,
  totalActivities,
  totalSavedItems,
  profileCompletionScore,
  allRoles,
  allPathways,
}: SkillGapClientProps) {
  const isLoggedIn = !!profile;

  /* ---------- derived defaults ---------- */
  const defaultRoleId = useMemo(() => {
    if (profile?.target_roles?.length) return profile.target_roles[0];
    if (latestQuiz?.recommended_roles?.length) return latestQuiz.recommended_roles[0];
    return 'security-analyst';
  }, [profile, latestQuiz]);

  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);

  /* ---------- selected role & pathway ---------- */
  const selectedRole = useMemo(
    () => allRoles.find((r) => r.id === selectedRoleId) ?? allRoles[0],
    [allRoles, selectedRoleId],
  );

  const pathway = useMemo(
    () => getPathwayByRoleId(selectedRoleId),
    [selectedRoleId],
  );

  const currentStageIndex = useMemo(() => {
    if (!profile?.years_experience) return 0;
    return getStageIndex(selectedRoleId, profile.years_experience);
  }, [selectedRoleId, profile]);

  const currentStage: PathwayStage | null = useMemo(
    () => pathway?.stages[currentStageIndex] ?? null,
    [pathway, currentStageIndex],
  );

  /* ---------- skill gap analysis ---------- */
  const userSkillsLower = useMemo(
    () => (profile?.current_skills ?? []).map((s) => s.toLowerCase()),
    [profile],
  );

  const gapRows: GapRow[] = useMemo(() => {
    if (!currentStage) return [];
    return currentStage.skills.map((skill, i) => {
      const hasSkill = userSkillsLower.some(
        (us) => skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase()),
      );
      return {
        skill,
        hasSkill,
        priority: getSkillPriority(i),
        action: getSuggestedAction(skill, hasSkill),
      };
    });
  }, [currentStage, userSkillsLower]);

  const matchedCount = gapRows.filter((r) => r.hasSkill).length;
  const totalSkillsInStage = gapRows.length;
  const matchedPercentage = totalSkillsInStage > 0 ? Math.round((matchedCount / totalSkillsInStage) * 100) : 0;

  /* ---------- cert progress ---------- */
  const certProgressPercentage = useMemo(() => {
    if (!currentStage) return 0;
    const obtainedLower = (profile?.certifications_obtained ?? []).map((c) => c.toLowerCase());
    const stageCerts = currentStage.certifications;
    if (stageCerts.length === 0) return 0;
    const matched = stageCerts.filter((cert) =>
      obtainedLower.some((o) => cert.toLowerCase().includes(o) || o.includes(cert.toLowerCase())),
    ).length;
    return Math.round((matched / stageCerts.length) * 100);
  }, [currentStage, profile]);

  /* ---------- radar data ---------- */
  const radarSkills = useMemo(() => {
    if (!currentStage) return [];
    const stageSkills = currentStage.skills.slice(0, 6);
    return stageSkills.map((skill) => {
      const hasSkill = userSkillsLower.some(
        (us) => skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase()),
      );
      return {
        name: skill.length > 25 ? skill.slice(0, 23) + '...' : skill,
        current: hasSkill ? 80 : seededRandom(skill + selectedRoleId, 10, 30),
        required: 80,
      };
    });
  }, [currentStage, userSkillsLower, selectedRoleId]);

  /* ---------- readiness score ---------- */
  const readiness = useMemo(() => {
    return computeReadinessScore({
      profileScore: profileCompletionScore,
      quizConfidence: latestQuiz?.confidence_score ?? null,
      skillsCoverage: matchedPercentage,
      certProgress: certProgressPercentage,
      activitiesCount: totalActivities,
      savedItemsCount: totalSavedItems,
    });
  }, [profileCompletionScore, latestQuiz, matchedPercentage, certProgressPercentage, totalActivities, totalSavedItems]);

  /* ---------- gap priorities (top gaps) ---------- */
  const topGaps = useMemo(
    () => gapRows.filter((r) => !r.hasSkill).slice(0, 5),
    [gapRows],
  );

  /* ---------- profile completeness flags ---------- */
  const profileIncomplete = profileCompletionScore < 70;
  const noQuizResults = !latestQuiz;

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */

  return (
    <main className="min-h-screen">
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-cyan-50 dark:from-cyber-midnight dark:via-cyber-surface dark:to-cyber-midnight" />
        <div className="absolute inset-0 cyber-grid opacity-40" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
          <div
            className="inline-flex items-center gap-2 section-tag mb-6 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <Radar size={14} />
            <span>Skill Gap Analysis</span>
          </div>

          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Find Your{' '}
            <span className="gradient-text">Skill Gaps</span>
          </h1>

          <p
            className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            See exactly where you stand versus where you need to be. Get a personalised
            radar view of your skills, identify critical gaps, and get actionable next steps.
          </p>

          {!isLoggedIn && (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 animate-fade-in"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              <LogIn size={18} />
              Log In for Personalised Analysis
            </Link>
          )}
        </div>
      </section>

      {/* ─── Role Selector ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div
          className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-4 animate-fade-in"
          style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
            Select Target Role
          </p>
          <div className="flex flex-wrap gap-2">
            {allRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  selectedRoleId === role.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-gray-100 dark:bg-cyber-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-cyber-border',
                )}
              >
                <span className="mr-1.5">{role.icon}</span>
                {role.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {isLoggedIn ? (
          /* ===== LOGGED IN VIEW ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left Column (2/3) ──────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stage context */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Analysing for
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedRole.title}{' '}
                  <span className="text-lg text-gray-400 dark:text-gray-500 font-normal">
                    / {currentStage?.name ?? 'Foundation'} Stage
                  </span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentStage?.timeframe ?? '0-12 months'} &middot;{' '}
                  {matchedCount} of {totalSkillsInStage} skills matched
                </p>
              </div>

              {/* Skill Radar Card */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Radar size={18} className="text-cyan-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Skill Radar
                  </h3>
                </div>

                {radarSkills.length > 0 ? (
                  <SkillRadar skills={radarSkills} className="mx-auto" />
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No pathway data available for this role yet.
                  </p>
                )}
              </div>

              {/* Detailed Gap Table */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck size={18} className="text-orange-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Detailed Skill Analysis
                  </h3>
                </div>

                {gapRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-cyber-border">
                          <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                            Skill
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                            Priority
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            Suggested Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-cyber-border/50">
                        {gapRows.map((row, i) => (
                          <tr
                            key={row.skill}
                            className="hover:bg-gray-50/50 dark:hover:bg-cyber-surface/50 transition-colors"
                          >
                            <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">
                              {row.skill}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {row.hasSkill ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 size={16} />
                                  <span className="hidden sm:inline text-xs">You have this</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-orange-500">
                                  <AlertTriangle size={16} />
                                  <span className="hidden sm:inline text-xs">Gap</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center hidden sm:table-cell">
                              <span
                                className={cn(
                                  'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                  row.priority === 'Critical'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : row.priority === 'High'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                )}
                              >
                                {row.priority}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 text-xs hidden md:table-cell">
                              {row.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No skills data available for this stage.
                  </p>
                )}

                {/* Mobile: show actions in cards below table */}
                <div className="md:hidden mt-4 space-y-2">
                  {gapRows
                    .filter((r) => !r.hasSkill)
                    .slice(0, 3)
                    .map((row) => (
                      <div
                        key={row.skill + '-mobile'}
                        className="bg-orange-50/60 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-800/30 rounded-lg px-3 py-2"
                      >
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                          {row.skill}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {row.action}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* ─── Right Column (1/3 sidebar) ─────────────────────────── */}
            <div className="space-y-6">
              {/* Readiness Score */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-cyan-500" />
                  <h3 className="font-heading text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Readiness Score
                  </h3>
                </div>
                <ReadinessScore
                  score={readiness.overallScore}
                  label={readiness.label}
                  breakdown={[
                    { label: 'Profile', value: readiness.profileCompleteness, max: 100 },
                    { label: 'Quiz Confidence', value: readiness.quizConfidence, max: 100 },
                    { label: 'Skills Coverage', value: readiness.skillsCoverage, max: 100 },
                    { label: 'Cert Progress', value: readiness.certProgress, max: 100 },
                    { label: 'Engagement', value: readiness.activityEngagement, max: 100 },
                    { label: 'Resources', value: readiness.resourceConsumption, max: 100 },
                  ]}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {readiness.nextMilestone}
                </p>
              </div>

              {/* Gap Priorities */}
              {topGaps.length > 0 && (
                <div
                  className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5 animate-fade-in"
                  style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert size={18} className="text-orange-500" />
                    <h3 className="font-heading text-sm font-semibold text-gray-900 dark:text-white">
                      Top Gap Priorities
                    </h3>
                  </div>

                  <ol className="space-y-4">
                    {topGaps.map((gap, i) => (
                      <li key={gap.skill} className="flex gap-3">
                        <span
                          className={cn(
                            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                            i === 0
                              ? 'bg-red-500'
                              : i === 1
                                ? 'bg-orange-500'
                                : 'bg-amber-500',
                          )}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {gap.skill}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {getGapWhyItMatters(gap.skill)}
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                            <ChevronRight size={12} />
                            {gap.action}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Actions Card */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5 animate-fade-in"
                style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-cyan-500" />
                  <h3 className="font-heading text-sm font-semibold text-gray-900 dark:text-white">
                    Recommended Actions
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {profileIncomplete && (
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <User size={16} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Complete Profile
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {profileCompletionScore}% complete
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-orange-500 transition-colors"
                      />
                    </Link>
                  )}

                  {noQuizResults && (
                    <Link
                      href="/quiz"
                      className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200/50 dark:border-cyan-800/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/20 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                        <Target size={16} className="text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Take Career Quiz
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Boost your readiness score
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-cyan-500 transition-colors"
                      />
                    </Link>
                  )}

                  <Link
                    href="/resources"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-cyber-surface/50 border border-gray-200/50 dark:border-cyber-border/50 hover:bg-gray-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-cyber-midnight flex items-center justify-center">
                      <BookOpen size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Browse Resources
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Guides, templates & checklists
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    />
                  </Link>

                  <Link
                    href="/services"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-cyan-500/10 border border-orange-200/30 dark:border-orange-800/20 hover:from-orange-500/20 hover:to-cyan-500/20 transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp size={16} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Book Coaching
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Accelerate with expert guidance
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-orange-500 transition-colors"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ===== GUEST / NOT LOGGED IN VIEW ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: sample radar */}
            <div className="lg:col-span-2 space-y-8">
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              >
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedRole.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sample analysis &middot; Log in for personalised results
                </p>
              </div>

              {/* Sample Radar */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Radar size={18} className="text-cyan-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Sample Skill Radar
                  </h3>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 italic">
                    Sample data
                  </span>
                </div>
                <SkillRadar skills={SAMPLE_RADAR_SKILLS} className="mx-auto" />
              </div>

              {/* Sample gap table */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck size={18} className="text-orange-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Skill Breakdown
                  </h3>
                </div>

                <div className="space-y-3">
                  {SAMPLE_RADAR_SKILLS.map((skill, i) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-cyber-surface/50"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-orange-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-full',
                          i < 2
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                        )}
                      >
                        {i < 2 ? 'Critical' : 'High'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Login overlay prompt */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/5 to-cyan-500/5 border border-dashed border-orange-300/50 dark:border-orange-700/30 text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                    This is sample data. Log in to see your real skill gaps.
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                  >
                    <LogIn size={14} />
                    Log in to unlock
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right sidebar: locked readiness + CTAs */}
            <div className="space-y-6">
              {/* Locked Readiness Score */}
              <div
                className="relative animate-fade-in"
                style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
              >
                <div className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-cyan-500" />
                    <h3 className="font-heading text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Readiness Score
                    </h3>
                  </div>

                  {/* Blurred placeholder */}
                  <div className="relative">
                    <div className="filter blur-md select-none pointer-events-none" aria-hidden="true">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-200 to-orange-200 dark:from-cyan-900 dark:to-orange-900" />
                        <div className="mt-2 h-4 w-20 bg-gray-200 dark:bg-cyber-border rounded" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n}>
                            <div className="h-3 w-24 bg-gray-200 dark:bg-cyber-border rounded mb-1" />
                            <div className="h-2 w-full bg-gray-100 dark:bg-cyber-midnight rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-cyber-card/90 border border-gray-200 dark:border-cyber-border flex items-center justify-center shadow-lg mb-3">
                        <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Readiness Score Locked
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[200px]">
                        Log in and complete your profile to unlock your personalised score
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign-up CTA */}
              <div
                className="bg-gradient-to-br from-orange-500/10 to-cyan-500/10 dark:from-orange-900/20 dark:to-cyan-900/20 border border-orange-200/50 dark:border-orange-800/30 rounded-2xl p-5 text-center animate-fade-in"
                style={{ animationDelay: '0.65s', animationFillMode: 'both' }}
              >
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Get Your Full Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Create a free account to unlock personalised skill gap analysis,
                  readiness scoring, and tailored recommendations.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
                >
                  <LogIn size={16} />
                  Sign Up Free
                </Link>
              </div>

              {/* Browse services link */}
              <div
                className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5 animate-fade-in"
                style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-cyan-500" />
                  <h3 className="font-heading text-sm font-semibold text-gray-900 dark:text-white">
                    Explore LumaShift
                  </h3>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/quiz"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-cyber-surface/50 hover:bg-gray-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <Target size={16} className="text-cyan-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Take Career Quiz
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-gray-400 group-hover:text-cyan-500 transition-colors"
                    />
                  </Link>
                  <Link
                    href="/resources"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-cyber-surface/50 hover:bg-gray-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <BookOpen size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Browse Resources
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-gray-400 group-hover:text-orange-500 transition-colors"
                    />
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-cyber-surface/50 hover:bg-gray-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      View Services
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Career Outcomes - Predictive Analysis */}
      {profile && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="section-tag mx-auto w-fit">
              <TrendingUp size={14} />
              <span>Career Predictions</span>
            </span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mt-2">
              Your <span className="gradient-text">Career Outlook</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-500 dark:text-gray-400">
              Predictions based on your profile, skills, and readiness score.
            </p>
          </div>
          <CareerOutcomes
            targetRoleId={selectedRoleId}
            readiness={readiness}
            yearsExperience={profile.years_experience ?? 0}
            currentSkillsCount={radarSkills.filter((s) => s.current >= 60).length}
            requiredSkillsCount={radarSkills.length}
            certsObtained={profile.certifications_obtained?.length ?? 0}
            certsRequired={currentStage?.certifications.length ?? 3}
          />
        </section>
      )}
    </main>
  );
}
