'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Trophy, Star, Lock, ChevronRight, ArrowLeft, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import {
  BADGES,
  MILESTONES,
  TIER_COLORS,
  getMilestoneProgress,
  type Badge,
  type Milestone,
  type MilestoneTier,
} from '@/lib/gamification';
import type { ActivityLog, UserBadge } from '@/types';

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface AchievementsClientProps {
  totalPoints: number;
  profileScore: number;
  activities: ActivityLog[];
  savedItemsCount: number;
  userBadges: UserBadge[];
  userName: string;
  hasCertPlanned: boolean;
}

/* ─── Circular Progress Ring ──────────────────────────────────────────────── */

const RING_SIZE = 180;
const STROKE_WIDTH = 14;
const RING_RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ProgressRing({
  progress,
  totalPoints,
  tier,
}: {
  progress: number;
  totalPoints: number;
  tier: MilestoneTier;
}) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);
  const [animatedPts, setAnimatedPts] = useState(0);

  const tierStyle = TIER_COLORS[tier];

  const strokeColor: Record<MilestoneTier, string> = {
    bronze: '#D97706',
    silver: '#9CA3AF',
    gold: '#EAB308',
    platinum: '#06B6D4',
    diamond: '#8B5CF6',
  };

  useEffect(() => {
    const targetOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
    requestAnimationFrame(() => setAnimatedOffset(targetOffset));

    const duration = 1200;
    const startTime = performance.now();
    let frameId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedPts(Math.round(eased * totalPoints));
      if (p < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [progress, totalPoints]);

  return (
    <div className={cn('relative rounded-full', tierStyle.glow)}>
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
          stroke={strokeColor[tier]}
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
        <span className={cn('text-4xl font-heading font-bold leading-none', tierStyle.text)}>
          {animatedPts}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">points</span>
      </div>
    </div>
  );
}

/* ─── Milestone Timeline ──────────────────────────────────────────────────── */

function MilestoneTimeline({
  totalPoints,
  currentMilestoneId,
}: {
  totalPoints: number;
  currentMilestoneId: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1"
    >
      {MILESTONES.map((m) => {
        const reached = totalPoints >= m.pointsRequired;
        const isCurrent = m.id === currentMilestoneId;
        const tierStyle = TIER_COLORS[m.tier];

        return (
          <div
            key={m.id}
            data-active={isCurrent}
            className={cn(
              'flex-shrink-0 w-28 rounded-xl border p-3 text-center transition-all duration-300',
              reached
                ? cn(tierStyle.bg, tierStyle.border, 'border')
                : 'bg-gray-100 dark:bg-cyber-midnight border-gray-200 dark:border-cyber-border opacity-50',
              isCurrent && cn('ring-2 ring-offset-2 ring-offset-white dark:ring-offset-cyber-midnight scale-105', tierStyle.border.replace('border-', 'ring-')),
            )}
          >
            <span className="text-2xl block mb-1">{m.icon}</span>
            <p className={cn(
              'text-[10px] font-bold uppercase tracking-wider mb-0.5',
              reached ? tierStyle.text : 'text-gray-400 dark:text-gray-500',
            )}>
              {m.tier}
            </p>
            <p className={cn(
              'text-xs font-semibold leading-tight',
              reached ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500',
            )}>
              {m.name}
            </p>
            <p className={cn(
              'text-[10px] mt-1',
              reached ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600',
            )}>
              {m.pointsRequired} pts
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Badge Card ──────────────────────────────────────────────────────────── */

function BadgeCard({
  badge,
  earned,
  earnedAt,
}: {
  badge: Badge;
  earned: boolean;
  earnedAt: string | null;
}) {
  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 text-center transition-all duration-300',
        earned
          ? 'bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border-gray-200 dark:border-cyber-border shadow-md hover:shadow-lg hover:-translate-y-0.5'
          : 'bg-gray-50 dark:bg-cyber-midnight/50 border-gray-100 dark:border-cyber-border/50 opacity-50',
      )}
    >
      {!earned && (
        <div className="absolute top-2 right-2">
          <Lock size={12} className="text-gray-300 dark:text-gray-600" />
        </div>
      )}
      <div
        className={cn(
          'w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-2',
          earned ? badge.color : 'bg-gray-200 dark:bg-gray-700',
        )}
      >
        {badge.icon}
      </div>
      <p className={cn(
        'text-sm font-bold leading-tight',
        earned ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500',
      )}>
        {badge.name}
      </p>
      <p className={cn(
        'text-[10px] mt-1 leading-snug',
        earned ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600',
      )}>
        {badge.description}
      </p>
      {earned && earnedAt && (
        <p className="text-[9px] text-orange-500 dark:text-orange-400 mt-2 font-semibold">
          Earned {formatDate(earnedAt)}
        </p>
      )}
    </div>
  );
}

/* ─── Points History Bar Chart ────────────────────────────────────────────── */

function PointsHistory({ activities }: { activities: ActivityLog[] }) {
  const recentWithPoints = activities
    .filter((a) => a.points_awarded > 0)
    .slice(0, 10)
    .reverse();

  if (recentWithPoints.length === 0) {
    return (
      <div className="text-center py-8">
        <Zap size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No point activity yet. Start exploring to earn points!</p>
      </div>
    );
  }

  const maxPts = Math.max(...recentWithPoints.map((a) => a.points_awarded), 1);

  const eventLabels: Record<string, string> = {
    blog_read: 'Blog',
    resource_saved: 'Save',
    quiz_attempt: 'Quiz',
    role_explored: 'Role',
    roles_compared: 'Compare',
    service_viewed: 'Service',
    service_requested: 'Request',
    first_login: 'Login',
    profile_updated: 'Profile',
    roadmap_viewed: 'Roadmap',
    skill_gap_viewed: 'Skills',
    profile_completed: 'Complete',
  };

  return (
    <div className="flex items-end gap-2 h-32">
      {recentWithPoints.map((a, i) => {
        const heightPct = Math.max((a.points_awarded / maxPts) * 100, 8);
        return (
          <div key={a.id} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-[9px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
              +{a.points_awarded}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-cyan-400 dark:from-orange-600 dark:to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
              style={{
                height: `${heightPct}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="absolute inset-0 progress-shimmer" />
            </div>
            <span className="text-[8px] text-gray-400 dark:text-gray-500 truncate w-full text-center">
              {eventLabels[a.event_type] ?? a.event_type.slice(0, 6)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AchievementsClient({
  totalPoints,
  profileScore,
  activities,
  savedItemsCount,
  userBadges,
  userName,
  hasCertPlanned,
}: AchievementsClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { current, next, progress } = getMilestoneProgress(totalPoints);

  const earnedBadgeMap = new Map<string, string>();
  for (const ub of userBadges) {
    earnedBadgeMap.set(ub.badge_id, ub.earned_at);
  }

  const earnedCount = BADGES.filter((b) => earnedBadgeMap.has(b.id)).length;

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-12 md:py-16 bg-gray-50 dark:bg-cyber-midnight border-b border-gray-100 dark:border-cyber-border">
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-[#0A0A0A]/80 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Ring */}
            <div className={cn('transition-opacity duration-700', mounted ? 'opacity-100' : 'opacity-0')}>
              <ProgressRing
                progress={progress}
                totalPoints={totalPoints}
                tier={current.tier}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Achievements
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {userName}&apos;s Journey
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border',
                  TIER_COLORS[current.tier].bg,
                  TIER_COLORS[current.tier].text,
                  TIER_COLORS[current.tier].border,
                )}>
                  <Star size={12} /> {current.tier} tier
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {current.icon} {current.name}
                </span>
              </div>

              {next ? (
                <div className="max-w-sm mx-auto md:mx-0">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500 dark:text-gray-400">
                      Next: <span className="font-semibold text-gray-700 dark:text-gray-200">{next.icon} {next.name}</span>
                    </span>
                    <span className="font-bold text-orange-500">{totalPoints}/{next.pointsRequired} pts</span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-gray-200 dark:bg-cyber-surface overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 transition-all duration-1000 ease-out"
                      style={{ width: mounted ? `${progress}%` : '0%' }}
                    >
                      <div className="absolute inset-0 progress-shimmer rounded-full" />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {next.pointsRequired - totalPoints} points to go
                  </p>
                </div>
              ) : (
                <p className="text-sm text-green-500 font-semibold">
                  All milestones achieved! You are a Career Master.
                </p>
              )}

              <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-orange-500">{earnedCount}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Badges</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-cyber-border" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-cyan-500">{totalPoints}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Points</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-cyber-border" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-violet-500">{profileScore}%</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── Milestone Timeline ── */}
        <section>
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" /> Milestone Timeline
          </h2>
          <div className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5">
            <MilestoneTimeline
              totalPoints={totalPoints}
              currentMilestoneId={current.id}
            />
          </div>
        </section>

        {/* ── Badges Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star size={20} className="text-orange-500" /> Badges
            </h2>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-semibold">
              {earnedCount} / {BADGES.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BADGES.map((badge) => {
              const earned = earnedBadgeMap.has(badge.id);
              const earnedAt = earnedBadgeMap.get(badge.id) ?? null;
              return (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={earned}
                  earnedAt={earnedAt}
                />
              );
            })}
          </div>
        </section>

        {/* ── Points History ── */}
        <section>
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-cyan-500" /> Recent Points Activity
          </h2>
          <div className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border border-gray-200 dark:border-cyber-border rounded-2xl p-5">
            <PointsHistory activities={activities} />
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section className="pb-4">
          <div className="bg-gradient-to-r from-orange-500/10 to-cyan-500/10 dark:from-orange-500/5 dark:to-cyan-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-3">
              Keep Going!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Earn more points and badges by exploring cybersecurity career tools.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/quiz', label: 'Take Quiz' },
                { href: '/blog', label: 'Read Blog' },
                { href: '/roadmap', label: 'Career Roadmap' },
                { href: '/skill-gap', label: 'Skill Gap Analysis' },
                { href: '/profile', label: 'Complete Profile' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-cyber-card border border-gray-200 dark:border-cyber-border text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 transition-all"
                >
                  {link.label} <ChevronRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
