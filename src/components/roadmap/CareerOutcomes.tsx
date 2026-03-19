'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle2,
  Award,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoleById } from '@/data/roles';
import type { ReadinessAssessment, RoleData } from '@/types';

// ─── Props ───────────────────────────────────────────────────────────────────

interface CareerOutcomesProps {
  targetRoleId: string;
  readiness: ReadinessAssessment;
  yearsExperience: number;
  currentSkillsCount: number;
  requiredSkillsCount: number;
  certsObtained: number;
  certsRequired: number;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

function computeInterviewReadiness(
  overallScore: number,
  skillsCoverage: number,
  certCoverage: number,
): number {
  return clamp(
    Math.round(overallScore * 0.4 + skillsCoverage * 0.3 + certCoverage * 0.3),
  );
}

function getReadinessLabel(score: number) {
  if (score >= 85) return { text: 'Highly Competitive', color: '#22C55E' };
  if (score >= 70) return { text: 'Interview Ready', color: '#06B6D4' };
  if (score >= 50) return { text: 'Almost Ready', color: '#EAB308' };
  if (score >= 30) return { text: 'Getting There', color: '#F97316' };
  return { text: 'Not Ready', color: '#EF4444' };
}

function getReadinessGlow(score: number): string {
  if (score >= 85)
    return 'shadow-[0_0_30px_rgba(34,197,94,0.25),0_0_60px_rgba(34,197,94,0.1)]';
  if (score >= 70)
    return 'shadow-[0_0_30px_rgba(6,182,212,0.25),0_0_60px_rgba(6,182,212,0.1)]';
  if (score >= 50)
    return 'shadow-[0_0_30px_rgba(234,179,8,0.25),0_0_60px_rgba(234,179,8,0.1)]';
  if (score >= 30)
    return 'shadow-[0_0_30px_rgba(249,115,22,0.25),0_0_60px_rgba(249,115,22,0.1)]';
  return 'shadow-[0_0_30px_rgba(239,68,68,0.25),0_0_60px_rgba(239,68,68,0.1)]';
}

function getTimelineEstimate(score: number) {
  if (score >= 80) return { text: "You're interview-ready now", months: 0 };
  if (score >= 60) return { text: '~1-2 months to interview-ready', months: 1.5 };
  if (score >= 40) return { text: '~3-4 months to interview-ready', months: 3.5 };
  if (score >= 20) return { text: '~6-8 months to interview-ready', months: 7 };
  return { text: '~9-12 months to interview-ready', months: 10.5 };
}

const TIMELINE_MILESTONES = [
  { label: 'Profile Complete', position: 15 },
  { label: 'Skills Built', position: 45 },
  { label: 'Cert Achieved', position: 72 },
  { label: 'Interview Ready', position: 100 },
];

function parseSalaryRange(salary: string): { low: number; high: number } | null {
  const numbers = salary.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return null;
  return {
    low: parseInt(numbers[0].replace(/,/g, ''), 10),
    high: parseInt(numbers[1].replace(/,/g, ''), 10),
  };
}

function formatRM(value: number): string {
  return `RM ${value.toLocaleString()}`;
}

function getDemandLevels(): { level: string; index: number }[] {
  return [
    { level: 'High', index: 0 },
    { level: 'Very High', index: 1 },
    { level: 'Critical', index: 2 },
  ];
}

function getDemandText(level: string): string {
  switch (level) {
    case 'Critical':
      return 'Extreme shortage of qualified professionals. Employers are actively competing for talent with premium compensation.';
    case 'Very High':
      return 'Strong demand across industries. Multiple job openings per qualified candidate. Excellent negotiation leverage.';
    default:
      return 'Steady demand with good opportunities. Building niche skills can set you apart from other candidates.';
  }
}

function getQuickWins(
  readiness: ReadinessAssessment,
  skillsCoverage: number,
  certCoverage: number,
  role: RoleData | undefined,
): { action: string; impact: string; icon: React.ReactNode }[] {
  const wins: { action: string; impact: string; icon: React.ReactNode }[] = [];

  if (readiness.profileCompleteness < 70) {
    wins.push({
      action: 'Complete your profile',
      impact: '+15 readiness',
      icon: <UserCheck className="w-4 h-4" />,
    });
  }

  if (certCoverage < 50 && role && role.certifications.length > 0) {
    const nextCert = role.certifications[0];
    wins.push({
      action: `Get ${nextCert}`,
      impact: '+20 readiness',
      icon: <Award className="w-4 h-4" />,
    });
  }

  if (skillsCoverage < 60) {
    wins.push({
      action: 'Close your top 3 skill gaps',
      impact: '+18 readiness',
      icon: <Target className="w-4 h-4" />,
    });
  }

  if (readiness.quizConfidence < 50) {
    wins.push({
      action: 'Retake the career quiz',
      impact: '+10 readiness',
      icon: <CheckCircle2 className="w-4 h-4" />,
    });
  }

  if (readiness.activityEngagement < 40) {
    wins.push({
      action: 'Read 5 blog articles on your target role',
      impact: '+12 readiness',
      icon: <Briefcase className="w-4 h-4" />,
    });
  }

  return wins.slice(0, 3);
}

// ─── Animated Counter Hook ───────────────────────────────────────────────────

function useAnimatedNumber(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

// ─── Circular Gauge ──────────────────────────────────────────────────────────

const RING_SIZE = 140;
const STROKE_WIDTH = 10;
const RING_RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function InterviewGauge({ score }: { score: number }) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);
  const [mounted, setMounted] = useState(false);
  const animatedScore = useAnimatedNumber(score);
  const { text, color } = getReadinessLabel(score);
  const glow = getReadinessGlow(score);

  useEffect(() => {
    setMounted(true);
    const raf = requestAnimationFrame(() => {
      setAnimatedOffset(CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE);
    });
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative rounded-full transition-shadow duration-700', mounted && glow)}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="transform -rotate-90"
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            className="stroke-gray-200 dark:stroke-cyber-border"
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animatedOffset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-heading font-bold leading-none" style={{ color }}>
            {animatedScore}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <span
        className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}18` }}
      >
        {text}
      </span>
    </div>
  );
}

// ─── Card Wrapper ────────────────────────────────────────────────────────────

function OutcomeCard({
  title,
  icon,
  children,
  className: extraClass,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500/40',
        extraClass,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
          {icon}
        </div>
        <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CareerOutcomes({
  targetRoleId,
  readiness,
  yearsExperience,
  currentSkillsCount,
  requiredSkillsCount,
  certsObtained,
  certsRequired,
  className,
}: CareerOutcomesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = useMemo(() => getRoleById(targetRoleId), [targetRoleId]);

  // ── Derived values ──

  const skillsCoverage = requiredSkillsCount > 0
    ? clamp(Math.round((currentSkillsCount / requiredSkillsCount) * 100))
    : 0;

  const certCoverage = certsRequired > 0
    ? clamp(Math.round((certsObtained / certsRequired) * 100))
    : 0;

  const interviewScore = computeInterviewReadiness(
    readiness.overallScore,
    skillsCoverage,
    certCoverage,
  );

  const timeline = getTimelineEstimate(interviewScore);

  // Position on the timeline bar (0-100): higher score = further along
  const timelinePosition = clamp(interviewScore);

  // Salary estimation
  const salaryRange = role?.avgSalaryMY ? parseSalaryRange(role.avgSalaryMY) : null;
  const salaryPosition = useMemo(() => {
    // Blend readiness and experience into 0-1
    const experienceFactor = clamp(yearsExperience * 10, 0, 50); // up to 50 from exp
    const readinessFactor = interviewScore * 0.5; // up to 50 from readiness
    return clamp(Math.round(experienceFactor + readinessFactor));
  }, [yearsExperience, interviewScore]);

  const estimatedSalary = salaryRange
    ? Math.round(salaryRange.low + (salaryRange.high - salaryRange.low) * (salaryPosition / 100))
    : null;

  const demandLevel = role?.demandLevel ?? 'High';
  const quickWins = useMemo(
    () => getQuickWins(readiness, skillsCoverage, certCoverage, role),
    [readiness, skillsCoverage, certCoverage, role],
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
          Predictive Career Outcomes
        </h2>
      </div>

      {/* Grid: 2x2 desktop, stacked mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── 1. Interview Readiness ── */}
        <OutcomeCard title="Interview Readiness" icon={<Target className="w-4 h-4" />}>
          <InterviewGauge score={interviewScore} />

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Skills coverage</span>
              <span className="font-semibold tabular-nums">{skillsCoverage}%</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-gray-100 dark:bg-cyber-midnight overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-cyan-500 transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${skillsCoverage}%` : '0%', transitionDelay: '0.3s' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Certifications</span>
              <span className="font-semibold tabular-nums">{certCoverage}%</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-gray-100 dark:bg-cyber-midnight overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-orange-500 transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${certCoverage}%` : '0%', transitionDelay: '0.5s' }}
              />
            </div>
          </div>
        </OutcomeCard>

        {/* ── 2. Timeline Estimation ── */}
        <OutcomeCard title="Timeline Estimation" icon={<Clock className="w-4 h-4" />}>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {timeline.text}
          </p>

          {/* Timeline bar */}
          <div className="relative mb-2">
            {/* Track */}
            <div className="h-2 rounded-full bg-gray-100 dark:bg-cyber-midnight relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${timelinePosition}%` : '0%',
                  background: 'linear-gradient(90deg, #F97316, #06B6D4, #22C55E)',
                  transitionDelay: '0.4s',
                }}
              />
            </div>

            {/* User marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-cyber-card bg-orange-500 transition-all duration-1000 ease-out z-10"
              style={{
                left: mounted ? `calc(${timelinePosition}% - 8px)` : '0%',
                transitionDelay: '0.4s',
              }}
            />
          </div>

          {/* Milestone labels */}
          <div className="relative h-16 mt-3">
            {TIMELINE_MILESTONES.map((ms, i) => {
              const isReached = timelinePosition >= ms.position;
              return (
                <div
                  key={ms.label}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${ms.position}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mb-1 transition-colors duration-500',
                      isReached
                        ? 'bg-cyan-500'
                        : 'bg-gray-300 dark:bg-gray-600',
                    )}
                    style={{ transitionDelay: `${0.5 + i * 0.15}s` }}
                  />
                  <span
                    className={cn(
                      'text-[10px] leading-tight text-center max-w-[70px]',
                      isReached
                        ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                        : 'text-gray-400 dark:text-gray-500',
                    )}
                  >
                    {ms.label}
                  </span>
                </div>
              );
            })}
          </div>
        </OutcomeCard>

        {/* ── 3. Salary Projection ── */}
        <OutcomeCard title="Salary Projection" icon={<BarChart3 className="w-4 h-4" />}>
          {salaryRange ? (
            <>
              {/* MYR range bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{formatRM(salaryRange.low)}</span>
                  <span>{formatRM(salaryRange.high)}/mo</span>
                </div>
                <div className="relative h-3 rounded-full bg-gray-100 dark:bg-cyber-midnight overflow-hidden">
                  {/* Full range background gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/30 via-cyan-400/30 to-green-400/30" />
                  {/* User marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white dark:border-cyber-card bg-cyan-500 flex items-center justify-center transition-all duration-1000 ease-out z-10"
                    style={{
                      left: mounted
                        ? `calc(${salaryPosition}% - 10px)`
                        : '0%',
                      transitionDelay: '0.6s',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                {estimatedSalary !== null && (
                  <p className="text-center mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Estimated:{' '}
                    </span>
                    <span className="text-sm font-bold font-heading text-cyan-600 dark:text-cyan-400">
                      {formatRM(estimatedSalary)}/mo
                    </span>
                  </p>
                )}
              </div>

              {/* Global reference */}
              {role?.avgSalaryGlobal && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-cyber-border/50">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  <span>
                    Global range:{' '}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {role.avgSalaryGlobal}
                    </span>
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              Salary data not available for this role.
            </p>
          )}
        </OutcomeCard>

        {/* ── 4. Market Demand ── */}
        <OutcomeCard title="Market Demand" icon={<TrendingUp className="w-4 h-4" />}>
          {/* 3-level bar indicator */}
          <div className="flex items-end gap-2 mb-3">
            {getDemandLevels().map(({ level, index }) => {
              const isActive =
                (demandLevel === 'High' && index === 0) ||
                (demandLevel === 'Very High' && index <= 1) ||
                (demandLevel === 'Critical' && index <= 2);
              const isExact =
                (demandLevel === 'High' && index === 0) ||
                (demandLevel === 'Very High' && index === 1) ||
                (demandLevel === 'Critical' && index === 2);

              const heights = ['h-6', 'h-10', 'h-14'];
              const activeColors = [
                'bg-orange-400',
                'bg-cyan-500',
                'bg-green-500',
              ];

              return (
                <div key={level} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all duration-700',
                      heights[index],
                      isActive
                        ? activeColors[index]
                        : 'bg-gray-200 dark:bg-cyber-midnight',
                      isExact && 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-cyber-card',
                      isExact && index === 0 && 'ring-orange-400',
                      isExact && index === 1 && 'ring-cyan-500',
                      isExact && index === 2 && 'ring-green-500',
                    )}
                    style={{
                      opacity: mounted ? 1 : 0,
                      transitionDelay: `${0.3 + index * 0.15}s`,
                    }}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      isExact
                        ? 'text-gray-900 dark:text-white font-bold'
                        : 'text-gray-400 dark:text-gray-500',
                    )}
                  >
                    {level}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {getDemandText(demandLevel)}
          </p>
        </OutcomeCard>
      </div>

      {/* ── 5. Quick Win Recommendations (full-width below the grid) ── */}
      {quickWins.length > 0 && (
        <div className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-white">
              Quick Win Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickWins.map((win, i) => (
              <div
                key={win.action}
                className={cn(
                  'flex items-start gap-3 rounded-xl border border-gray-100 dark:border-cyber-border/50 p-3 transition-all duration-500',
                  'hover:bg-gray-50 dark:hover:bg-cyber-surface/30',
                )}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transitionDelay: `${0.6 + i * 0.15}s`,
                }}
              >
                <div className="mt-0.5 p-1 rounded-md bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                  {win.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white leading-snug">
                    {win.action}
                  </p>
                  <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                    {win.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
