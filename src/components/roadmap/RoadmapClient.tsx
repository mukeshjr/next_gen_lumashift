'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Award,
  Target,
  Sparkles,
  LogIn,
  ArrowRight,
  MapPin,
  BookOpen,
  ShieldCheck,
  Layers,
  Zap,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStageIndex } from '@/data/career-pathways';
import { getServiceById } from '@/data/services';
import { PlanGenerator } from '@/components/roadmap/PlanGenerator';
import type {
  UserProfile,
  QuizResultRecord,
  RoleData,
  CareerPathway,
  PathwayStage,
} from '@/types';

/* ────────────────────────────── props ────────────────────────────── */

interface RoadmapClientProps {
  profile: UserProfile | null;
  quizResult: QuizResultRecord | null;
  allRoles: RoleData[];
  allPathways: CareerPathway[];
}

/* ────────────────────────────── constants ─────────────────────────── */

const STAGE_COLORS: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  foundation: {
    border: 'border-l-blue-400',
    bg: 'bg-blue-400',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  building: {
    border: 'border-l-orange-400',
    bg: 'bg-orange-400',
    text: 'text-orange-400',
    dot: 'bg-orange-400',
  },
  advanced: {
    border: 'border-l-cyan-400',
    bg: 'bg-cyan-400',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
  expert: {
    border: 'border-l-purple-400',
    bg: 'bg-purple-400',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
  },
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  foundation: <Layers size={18} />,
  building: <BookOpen size={18} />,
  advanced: <ShieldCheck size={18} />,
  expert: <Award size={18} />,
};

/* ────────────────────────────── component ─────────────────────────── */

export function RoadmapClient({
  profile,
  quizResult,
  allRoles,
  allPathways,
}: RoadmapClientProps) {
  /* ---------- derived defaults ---------- */
  const defaultRoleId = useMemo(() => {
    if (profile?.target_roles?.length) return profile.target_roles[0];
    if (quizResult?.recommended_roles?.length) return quizResult.recommended_roles[0];
    return 'security-analyst';
  }, [profile, quizResult]);

  /* ---------- state ---------- */
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  /* ---------- derived data ---------- */
  const selectedRole = useMemo(
    () => allRoles.find((r) => r.id === selectedRoleId) ?? allRoles[0],
    [allRoles, selectedRoleId],
  );

  const pathway = useMemo(
    () => allPathways.find((p) => p.roleId === selectedRoleId),
    [allPathways, selectedRoleId],
  );

  const stages = pathway?.stages ?? [];

  const currentStageIndex = useMemo(() => {
    if (!profile?.years_experience) return 0;
    return getStageIndex(selectedRoleId, profile.years_experience);
  }, [profile, selectedRoleId]);

  /* ---------- skills analysis ---------- */
  const skillsAnalysis = useMemo(() => {
    if (!profile?.current_skills?.length || !stages[currentStageIndex]) return null;
    const currentStage = stages[currentStageIndex];
    const userSkillsLower = profile.current_skills.map((s) => s.toLowerCase());

    const matched: string[] = [];
    const missing: string[] = [];
    currentStage.skills.forEach((skill) => {
      const isMatched = userSkillsLower.some(
        (us) => skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase()),
      );
      if (isMatched) matched.push(skill);
      else missing.push(skill);
    });

    const coverage = currentStage.skills.length
      ? Math.round((matched.length / currentStage.skills.length) * 100)
      : 0;

    return { matched, missing, coverage };
  }, [profile, stages, currentStageIndex]);

  /* ---------- next steps ---------- */
  const nextSteps = useMemo(() => {
    const steps: string[] = [];
    const currentStage = stages[currentStageIndex];
    const nextStage = stages[currentStageIndex + 1];

    if (currentStage) {
      if (skillsAnalysis && skillsAnalysis.missing.length > 0) {
        steps.push(`Build skills: ${skillsAnalysis.missing.slice(0, 2).join(', ')}`);
      }
      if (currentStage.certifications.length > 0) {
        const userCerts = profile?.certifications_obtained ?? [];
        const pendingCerts = currentStage.certifications.filter(
          (c) => !userCerts.some((uc) => uc.toLowerCase() === c.toLowerCase()),
        );
        if (pendingCerts.length > 0) {
          steps.push(`Pursue certification: ${pendingCerts[0]}`);
        }
      }
      if (currentStage.milestones.length > 0) {
        steps.push(`Complete milestone: ${currentStage.milestones[0].title}`);
      }
    }
    if (nextStage) {
      steps.push(`Prepare for ${nextStage.name} stage (${nextStage.timeframe})`);
    }
    return steps;
  }, [stages, currentStageIndex, skillsAnalysis, profile]);

  /* ---------- recommended services ---------- */
  const recommendedServices = useMemo(() => {
    const currentStage = stages[currentStageIndex];
    if (!currentStage) return [];
    return currentStage.recommendedServices
      .map((id) => getServiceById(id))
      .filter(Boolean);
  }, [stages, currentStageIndex]);

  /* ---------- handlers ---------- */
  const toggleStage = useCallback(
    (stageId: string) => {
      setExpandedStageId((prev) => (prev === stageId ? null : stageId));
    },
    [],
  );

  const handleStageKeyDown = useCallback(
    (e: React.KeyboardEvent, stageId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleStage(stageId);
      }
    },
    [toggleStage],
  );

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <div className="cyber-grid min-h-screen bg-white dark:bg-cyber-midnight">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-transparent dark:from-cyber-midnight dark:via-cyber-surface dark:to-cyber-midnight">
        {/* Decorative radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/10" />
          <div className="absolute top-40 right-0 h-[300px] w-[400px] rounded-full bg-cyan-500/5 blur-3xl dark:bg-cyan-500/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-tag mx-auto mb-6 w-fit">
              <MapPin size={14} />
              <span>Career Roadmap</span>
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Your{' '}
              <span className="gradient-text">Career Roadmap</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              See the skills, certifications, and milestones you need at every
              stage of your cybersecurity career — personalised to your profile.
            </p>

            {/* CTA if not logged in */}
            {!profile && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/auth/login?redirectTo=/roadmap" className="btn-primary">
                  <LogIn size={16} />
                  Log in to personalise
                </Link>
                <Link href="/quiz" className="btn-secondary">
                  <Sparkles size={16} />
                  Take the Quiz first
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Role Selector ─── */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-cyber-border dark:bg-cyber-midnight/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="no-scrollbar -mb-px flex gap-2 overflow-x-auto py-3"
            aria-label="Career role selector"
          >
            {allRoles.map((role) => {
              const isActive = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setExpandedStageId(null);
                  }}
                  className={cn(
                    'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-cyber-card dark:text-gray-400 dark:hover:bg-cyber-surface dark:hover:text-gray-200',
                  )}
                  aria-pressed={isActive}
                >
                  <span className="text-base" aria-hidden="true">
                    {role.icon}
                  </span>
                  <span>{role.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Role intro */}
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            <span className="mr-2 text-2xl" aria-hidden="true">
              {selectedRole.icon}
            </span>
            {selectedRole.title} Pathway
          </h2>
          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            {selectedRole.summary}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ─── Timeline ─── */}
          <div className="relative">
            {/* Vertical gradient line */}
            <div
              className="roadmap-line absolute left-5 top-2 hidden w-[3px] rounded-full sm:block"
              style={{ height: 'calc(100% - 16px)' }}
              aria-hidden="true"
            />

            <div className="space-y-6">
              {stages.map((stage, index) => {
                const colors = STAGE_COLORS[stage.id] ?? STAGE_COLORS.foundation;
                const isCurrent = profile ? index === currentStageIndex : false;
                const isExpanded = expandedStageId === stage.id;
                const isPast = profile ? index < currentStageIndex : false;

                return (
                  <div
                    key={stage.id}
                    className={cn(
                      'animate-fade-in',
                      `stagger-${(index % 4) + 1}`,
                    )}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`${stage.name} stage — ${stage.timeframe}. ${isCurrent ? 'This is your current stage.' : ''} Click to ${isExpanded ? 'collapse' : 'expand'}.`}
                      onClick={() => toggleStage(stage.id)}
                      onKeyDown={(e) => handleStageKeyDown(e, stage.id)}
                      className={cn(
                        'group relative cursor-pointer rounded-2xl border-l-4 p-5 transition-all duration-300 sm:ml-10 sm:p-6',
                        'bg-white/80 backdrop-blur-sm border border-gray-200',
                        'dark:bg-cyber-card/80 dark:border-cyber-border',
                        colors.border,
                        isCurrent && 'stage-active glow-orange ring-1 ring-orange-400/30',
                        isPast && 'opacity-75',
                        isExpanded
                          ? 'shadow-lg dark:shadow-orange-900/10'
                          : 'hover:shadow-md dark:hover:shadow-cyan-900/5',
                      )}
                    >
                      {/* Timeline dot (visible on sm+) */}
                      <div
                        className={cn(
                          'absolute -left-[calc(2.5rem+10px)] top-6 hidden h-5 w-5 rounded-full border-[3px] border-white dark:border-cyber-midnight sm:block',
                          colors.dot,
                          isCurrent && 'ring-4 ring-orange-400/30',
                        )}
                        aria-hidden="true"
                      />

                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                              'bg-gray-100 dark:bg-cyber-surface',
                              colors.text,
                            )}
                          >
                            {STAGE_ICONS[stage.id] ?? <Layers size={18} />}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                                {stage.name}
                              </h3>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                                  <Zap size={10} /> You are here
                                </span>
                              )}
                              {isPast && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-500/20 dark:text-green-400">
                                  <CheckCircle2 size={10} /> Completed
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                              <Clock size={12} />
                              {stage.timeframe}
                            </div>
                          </div>
                        </div>

                        <ChevronDown
                          size={20}
                          className={cn(
                            'shrink-0 text-gray-400 transition-transform duration-300 dark:text-gray-500',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      </div>

                      {/* Description (always visible) */}
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {stage.description}
                      </p>

                      {/* Expanded content */}
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-500 ease-in-out',
                          isExpanded ? 'mt-5 max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
                        )}
                      >
                        <div className="space-y-6 border-t border-gray-100 pt-5 dark:border-cyber-border">
                          {/* Skills */}
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              <Target size={13} /> Skills Required
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {stage.skills.map((skill) => {
                                const userHas =
                                  isCurrent &&
                                  skillsAnalysis?.matched.some(
                                    (m) => m.toLowerCase() === skill.toLowerCase(),
                                  );
                                return (
                                  <span
                                    key={skill}
                                    className={cn(
                                      'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                      userHas
                                        ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-600 dark:bg-cyber-surface dark:text-gray-400',
                                    )}
                                  >
                                    {userHas && <CheckCircle2 size={11} className="shrink-0" />}
                                    {skill}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Certifications */}
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              <Award size={13} /> Certifications
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {stage.certifications.map((cert) => {
                                const userHas = profile?.certifications_obtained?.some(
                                  (uc) => uc.toLowerCase() === cert.toLowerCase(),
                                );
                                return (
                                  <span
                                    key={cert}
                                    className={cn(
                                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                                      userHas
                                        ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400'
                                        : 'border-gray-200 bg-white text-gray-700 dark:border-cyber-border dark:bg-cyber-surface dark:text-gray-300',
                                    )}
                                  >
                                    {userHas ? (
                                      <CheckCircle2 size={12} className="text-green-500" />
                                    ) : (
                                      <Award size={12} className="text-gray-400" />
                                    )}
                                    {cert}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Milestones */}
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              <Sparkles size={13} /> Milestones
                            </h4>
                            <div className="space-y-3">
                              {stage.milestones.map((milestone) => (
                                <div
                                  key={milestone.title}
                                  className="flex gap-3 rounded-xl bg-gray-50 p-3 dark:bg-cyber-surface/50"
                                >
                                  <div
                                    className={cn(
                                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                                      'border-gray-300 dark:border-cyber-border',
                                    )}
                                  >
                                    <CheckCircle2
                                      size={12}
                                      className="text-gray-300 dark:text-gray-600"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                      {milestone.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                                      {milestone.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Services */}
                          {stage.recommendedServices.length > 0 && (
                            <div>
                              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                <Zap size={13} /> Recommended Services
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {stage.recommendedServices.map((serviceId) => {
                                  const svc = getServiceById(serviceId);
                                  if (!svc) return null;
                                  return (
                                    <Link
                                      key={serviceId}
                                      href="/services"
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                                    >
                                      {svc.title}
                                      <ArrowRight size={11} />
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Insights Panel ─── */}
          {profile ? (
            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              {/* Skills Match */}
              {skillsAnalysis && (
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 backdrop-blur-sm dark:border-cyber-border dark:bg-cyber-card/80">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-gray-900 dark:text-white">
                    <Target size={16} className="text-orange-500" />
                    Skills Match — {stages[currentStageIndex]?.name}
                  </h3>

                  {/* Coverage bar */}
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        Skills Coverage
                      </span>
                      <span className="font-bold text-orange-500">
                        {skillsAnalysis.coverage}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-cyber-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-all duration-700"
                        style={{ width: `${skillsAnalysis.coverage}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched */}
                  {skillsAnalysis.matched.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-green-500">
                        You have ({skillsAnalysis.matched.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsAnalysis.matched.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[11px] font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400"
                          >
                            <CheckCircle2 size={10} /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing */}
                  {skillsAnalysis.missing.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-orange-500">
                        To develop ({skillsAnalysis.missing.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsAnalysis.missing.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          >
                            <Target size={10} /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Next Steps */}
              {nextSteps.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 backdrop-blur-sm dark:border-cyber-border dark:bg-cyber-card/80">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-gray-900 dark:text-white">
                    <Sparkles size={16} className="text-cyan-500" />
                    Next Steps
                  </h3>
                  <div className="space-y-3">
                    {nextSteps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400">
                          {i + 1}
                        </div>
                        <p className="text-sm leading-snug text-gray-700 dark:text-gray-300">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Services */}
              {recommendedServices.length > 0 && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 dark:border-orange-500/20 dark:bg-orange-500/5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-gray-900 dark:text-white">
                    <Zap size={16} className="text-orange-500" />
                    Recommended Services
                  </h3>
                  <div className="space-y-2.5">
                    {recommendedServices.map((svc) => {
                      if (!svc) return null;
                      return (
                        <Link
                          key={svc.id}
                          href="/services"
                          className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-orange-300 hover:shadow-sm dark:border-cyber-border dark:bg-cyber-card dark:hover:border-orange-500/30"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-500/10">
                            <Award size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800 group-hover:text-orange-500 dark:text-gray-200">
                              {svc.title}
                            </p>
                            {svc.price && (
                              <p className="text-[11px] text-gray-400">{svc.price}</p>
                            )}
                          </div>
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-gray-300 dark:text-gray-600"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quiz nudge */}
              {!quizResult && (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 text-center dark:border-cyan-500/20 dark:bg-cyan-500/5">
                  <Sparkles size={24} className="mx-auto mb-2 text-cyan-500" />
                  <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Take the Career Quiz
                  </p>
                  <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    Get personalised role recommendations and see where you stand.
                  </p>
                  <Link href="/quiz" className="btn-primary w-full justify-center text-sm">
                    Start Quiz <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </aside>
          ) : (
            /* ─── Locked Insights (not logged in) ─── */
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-center backdrop-blur-sm dark:border-cyber-border dark:bg-cyber-card/80">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-cyber-surface">
                  <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                  Personalised Insights
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                  Log in and complete your profile to see skills match, next
                  steps, and personalised service recommendations.
                </p>
                <div className="mt-6 space-y-2">
                  <Link
                    href="/auth/login?redirectTo=/roadmap"
                    className="btn-primary w-full justify-center text-sm"
                  >
                    <LogIn size={14} /> Log in
                  </Link>
                  <Link
                    href="/quiz"
                    className="btn-ghost w-full justify-center text-sm"
                  >
                    <Sparkles size={14} /> Take the Quiz
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* AI Plan Generator */}
        {profile && (
          <section className="mt-16">
            <div className="mb-8 text-center">
              <span className="section-tag mx-auto w-fit">
                <Sparkles size={14} />
                <span>AI-Powered</span>
              </span>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mt-2">
                Generate Your <span className="gradient-text">Personalised Plan</span>
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-gray-500 dark:text-gray-400">
                Get an AI-generated study plan tailored to your skills, timeline, and budget.
              </p>
            </div>
            <PlanGenerator />
          </section>
        )}
      </div>
    </div>
  );
}
