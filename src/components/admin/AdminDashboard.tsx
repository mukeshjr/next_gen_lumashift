'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Users, Activity, FileText, ClipboardCheck,
  TrendingUp, ExternalLink, Clock, Bookmark,
  BarChart3, Zap, ChevronRight, BookOpen,
  Settings, Eye, Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  AdminData,
  EventTypeCount,
  RecentActivity,
  SavedPostCount,
  ServiceInterestCount,
} from '@/app/admin/page';

/* ─── Animated Counter Hook ───────────────────────────────────────────────── */

function useAnimatedCounter(target: number, duration: number = 1200): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

/* ─── Event Type Display Map ──────────────────────────────────────────────── */

const EVENT_LABELS: Record<string, string> = {
  blog_read: 'Blog Reads',
  quiz_attempt: 'Quiz Attempts',
  role_explored: 'Roles Explored',
  roles_compared: 'Roles Compared',
  resource_view: 'Resources Viewed',
  resource_saved: 'Resources Saved',
  service_viewed: 'Services Viewed',
  service_requested: 'Service Requests',
  coaching_requested: 'Coaching Requests',
  first_login: 'New Signups',
};

const EVENT_COLORS: Record<string, string> = {
  blog_read: 'bg-orange-500',
  quiz_attempt: 'bg-cyan-500',
  role_explored: 'bg-violet-500',
  roles_compared: 'bg-indigo-500',
  resource_view: 'bg-blue-500',
  resource_saved: 'bg-sky-500',
  service_viewed: 'bg-emerald-500',
  service_requested: 'bg-green-500',
  coaching_requested: 'bg-teal-500',
  first_login: 'bg-amber-500',
};

/* ─── Service ID to Title Map ─────────────────────────────────────────────── */

const SERVICE_TITLES: Record<string, string> = {
  'resume-review': 'Resume Review',
  'linkedin-optimisation': 'LinkedIn Optimisation',
  'career-clarity-call': 'Career Clarity Call',
  'mock-interview': 'Mock Interview Prep',
  'career-roadmap': 'Career Roadmap',
  'mentorship-monthly': 'Monthly Mentorship',
  'cert-accelerator': 'Cert Accelerator',
  'executive-coaching': 'Executive Coaching',
  'team-training': 'Team Training',
};

/* ─── KPI Card ────────────────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  subtitle,
  icon,
  accentClass,
  glowClass,
}: {
  label: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  accentClass: string;
  glowClass: string;
}) {
  const animated = useAnimatedCounter(value);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6',
        'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
        'border-gray-200/60 dark:border-cyber-border/60',
        glowClass,
        'transition-all duration-300 hover:scale-[1.02]',
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center',
            accentClass === 'text-orange-500'
              ? 'bg-orange-100 dark:bg-orange-500/15'
              : 'bg-cyan-100 dark:bg-cyan-500/15',
          )}
        >
          {icon}
        </div>
        {subtitle && (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-cyber-surface px-2 py-1 rounded-lg">
            {subtitle}
          </span>
        )}
      </div>
      <p className={cn('text-4xl font-heading font-black tabular-nums', accentClass)}>
        {animated.toLocaleString()}
      </p>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </p>
    </div>
  );
}

/* ─── Horizontal Bar ──────────────────────────────────────────────────────── */

function HorizontalBar({
  label,
  value,
  maxValue,
  colorClass,
}: {
  label: string;
  value: number;
  maxValue: number;
  colorClass: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-300 w-36 truncate font-medium">
        {label}
      </span>
      <div className="flex-1 h-7 bg-gray-100 dark:bg-cyber-surface rounded-lg overflow-hidden relative">
        <div
          className={cn('h-full rounded-lg transition-all duration-700 ease-out', colorClass)}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 dark:text-gray-300 tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ─── Timestamp Formatter ─────────────────────────────────────────────────── */

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString('en-MY', {
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AdminDashboard({ data }: { data: AdminData }) {
  const {
    totalUsers,
    newUsersThisWeek,
    activitiesThisWeek,
    totalBlogPosts,
    publishedBlogPosts,
    quizCompletions,
    topEventTypes,
    recentActivities,
    mostSavedPosts,
    serviceInterests,
  } = data;

  const maxEventCount = topEventTypes.length > 0
    ? Math.max(...topEventTypes.map((e) => e.count))
    : 1;

  const maxServiceCount = serviceInterests.length > 0
    ? Math.max(...serviceInterests.map((s) => s.count))
    : 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cyber-midnight cyber-grid">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-200/60 dark:border-cyber-border/60 bg-white/80 dark:bg-cyber-surface/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 dark:text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {formatCurrentDate()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/blog"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                  'border border-gray-200 dark:border-cyber-border',
                  'text-gray-700 dark:text-gray-300',
                  'hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500',
                  'bg-white dark:bg-cyber-card',
                )}
              >
                <FileText size={15} />
                Manage Blog
              </Link>
              <Link
                href="/"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                  'bg-orange-500 hover:bg-orange-600 text-white',
                  'shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40',
                )}
              >
                <ExternalLink size={15} />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <KpiCard
            label="Total Users"
            value={totalUsers}
            subtitle={newUsersThisWeek > 0 ? `+${newUsersThisWeek} this week` : undefined}
            icon={<Users size={20} className="text-orange-500" />}
            accentClass="text-orange-500"
            glowClass="glow-orange"
          />
          <KpiCard
            label="Active This Week"
            value={activitiesThisWeek}
            icon={<Activity size={20} className="text-cyan-500" />}
            accentClass="text-cyan-500"
            glowClass="glow-cyan"
          />
          <KpiCard
            label="Blog Posts"
            value={totalBlogPosts}
            subtitle={`${publishedBlogPosts} published`}
            icon={<FileText size={20} className="text-orange-500" />}
            accentClass="text-orange-500"
            glowClass="glow-orange"
          />
          <KpiCard
            label="Quiz Completions"
            value={quizCompletions}
            icon={<ClipboardCheck size={20} className="text-cyan-500" />}
            accentClass="text-cyan-500"
            glowClass="glow-cyan"
          />
        </div>

        {/* ── Charts Row (2-column on desktop) ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Activity This Week */}
          <div
            className={cn(
              'rounded-2xl border p-6',
              'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
              'border-gray-200/60 dark:border-cyber-border/60',
            )}
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-orange-500" />
              <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                Activity This Week
              </h2>
            </div>
            {topEventTypes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <Activity size={32} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">No activity recorded this week</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topEventTypes.map((et) => (
                  <HorizontalBar
                    key={et.event_type}
                    label={EVENT_LABELS[et.event_type] ?? et.event_type.replace(/_/g, ' ')}
                    value={et.count}
                    maxValue={maxEventCount}
                    colorClass={EVENT_COLORS[et.event_type] ?? 'bg-gray-500'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Popular Services */}
          <div
            className={cn(
              'rounded-2xl border p-6',
              'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
              'border-gray-200/60 dark:border-cyber-border/60',
            )}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-cyan-500" />
              <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                Popular Services
              </h2>
            </div>
            {serviceInterests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <Heart size={32} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">No service interests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {serviceInterests.map((si, idx) => (
                  <div key={si.service_id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-500/15 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-40 truncate font-medium">
                      {SERVICE_TITLES[si.service_id] ?? si.service_id.replace(/-/g, ' ')}
                    </span>
                    <div className="flex-1 h-7 bg-gray-100 dark:bg-cyber-surface rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.max((si.count / maxServiceCount) * 100, 4)}%`,
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 dark:text-gray-300 tabular-nums">
                        {si.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Activity Feed ──────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-2xl border',
            'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
            'border-gray-200/60 dark:border-cyber-border/60',
          )}
        >
          <div className="flex items-center gap-2 p-6 pb-0">
            <Clock size={18} className="text-orange-500" />
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">
              Last 20 events
            </span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <Zap size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No activities logged yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-cyber-border/40">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, idx) => (
                    <tr
                      key={activity.id}
                      className={cn(
                        'border-b border-gray-50 dark:border-cyber-border/20 last:border-0',
                        'hover:bg-gray-50/50 dark:hover:bg-cyber-surface/50 transition-colors',
                        idx % 2 === 1 && 'bg-gray-50/30 dark:bg-cyber-surface/20',
                      )}
                    >
                      <td className="px-6 py-3.5 text-gray-400 dark:text-gray-500 whitespace-nowrap font-medium">
                        {formatRelativeTime(activity.created_at)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {activity.user_name ?? activity.user_email ?? activity.user_id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold',
                            'bg-gray-100 dark:bg-cyber-surface text-gray-600 dark:text-gray-300',
                          )}
                        >
                          {EVENT_LABELS[activity.event_type] ?? activity.event_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {activity.item_title ?? '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        {activity.points_awarded > 0 ? (
                          <span className="text-orange-500 font-bold tabular-nums">
                            +{activity.points_awarded}
                          </span>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Popular Content ───────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-2xl border p-6',
            'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
            'border-gray-200/60 dark:border-cyber-border/60',
          )}
        >
          <div className="flex items-center gap-2 mb-6">
            <Bookmark size={18} className="text-orange-500" />
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Most Saved Blog Posts
            </h2>
          </div>

          {mostSavedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <BookOpen size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No blog saves recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mostSavedPosts.map((post, idx) => (
                <div
                  key={post.item_id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl',
                    'bg-gray-50/50 dark:bg-cyber-surface/50',
                    'border border-gray-100/60 dark:border-cyber-border/40',
                    'hover:border-orange-300 dark:hover:border-orange-500/40 transition-all group',
                  )}
                >
                  <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center text-sm font-bold text-orange-500 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${post.item_id}`}
                      className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-orange-500 transition-colors truncate block"
                    >
                      {post.item_title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Bookmark size={14} className="text-orange-400" />
                    <span className="text-sm font-bold text-orange-500 tabular-nums">
                      {post.count}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {post.count === 1 ? 'save' : 'saves'}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.item_id}`}
                    className="text-gray-300 dark:text-gray-600 hover:text-orange-500 transition-colors shrink-0"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick Links ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {[
            {
              href: '/admin/blog',
              label: 'Blog Admin',
              description: 'Create, edit, and manage blog posts',
              icon: <FileText size={22} className="text-orange-500" />,
              accentBg: 'bg-orange-100 dark:bg-orange-500/15',
            },
            {
              href: '/admin/users',
              label: 'Users',
              description: 'View registered users and profiles',
              icon: <Users size={22} className="text-cyan-500" />,
              accentBg: 'bg-cyan-100 dark:bg-cyan-500/15',
            },
            {
              href: '/admin/resources',
              label: 'Resources',
              description: 'Manage downloadable resources',
              icon: <Settings size={22} className="text-violet-500" />,
              accentBg: 'bg-violet-100 dark:bg-violet-500/15',
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group rounded-2xl border p-6',
                'bg-white/60 dark:bg-cyber-card/60 backdrop-blur-xl',
                'border-gray-200/60 dark:border-cyber-border/60',
                'hover:border-orange-300 dark:hover:border-orange-500/40',
                'transition-all duration-200 hover:scale-[1.02]',
              )}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', link.accentBg)}>
                {link.icon}
              </div>
              <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1">
                {link.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {link.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
                Open <ChevronRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
