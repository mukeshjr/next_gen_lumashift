'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MapPin,
  Briefcase,
  Award,
  Star,
  Zap,
  Calendar,
  Target,
  Shield,
  BookOpen,
  ExternalLink,
  TrendingUp,
  UserPlus,
  BarChart3,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { computeProfileCompletion } from '@/lib/profile-completion';
import type { AdminUserRow } from '@/app/admin/users/page';
import { Button } from '@/components/ui/button';

/* ─── Sort Configuration ──────────────────────────────────────────────────── */

type SortKey = 'name' | 'email' | 'career_stage' | 'total_points' | 'badge_count' | 'activity_count' | 'created_at';
type SortDir = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  dir: SortDir;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'total_points', label: 'Points' },
  { key: 'created_at', label: 'Joined' },
  { key: 'activity_count', label: 'Activities' },
  { key: 'name', label: 'Name' },
  { key: 'badge_count', label: 'Badges' },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0]?.toUpperCase() ?? '?';
}

const AVATAR_COLORS = [
  'bg-orange-500 text-white',
  'bg-cyan-500 text-white',
  'bg-violet-500 text-white',
  'bg-emerald-500 text-white',
  'bg-pink-500 text-white',
  'bg-amber-500 text-white',
  'bg-sky-500 text-white',
  'bg-rose-500 text-white',
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

/* ─── Stats Card ──────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-cyber-border bg-white/80 dark:bg-cyber-card/60 backdrop-blur-sm p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', accent)}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-3xl font-black text-gray-900 dark:text-white font-heading tabular-nums">
        {value}
      </p>
      {/* Decorative corner glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/5 to-cyan-500/5 blur-2xl pointer-events-none" />
    </div>
  );
}

/* ─── Tag Component ───────────────────────────────────────────────────────── */

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'orange' | 'cyan' }) {
  const styles = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    orange: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[variant])}>
      {children}
    </span>
  );
}

/* ─── Profile Completion Bar ──────────────────────────────────────────────── */

function CompletionBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-green-500' :
    score >= 40 ? 'bg-orange-500' :
    'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 min-w-[60px]">
        <div
          className={cn('h-2 rounded-full transition-all duration-500', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tabular-nums w-8 text-right">
        {score}%
      </span>
    </div>
  );
}

/* ─── Expanded User Detail ────────────────────────────────────────────────── */

function UserDetail({ user }: { user: AdminUserRow }) {
  const completion = computeProfileCompletion({
    name: user.name,
    location: user.location,
    job_role: user.job_role,
    years_experience: user.years_experience,
    career_stage: user.career_stage,
    target_roles: user.target_roles,
    current_skills: user.current_skills,
    certifications_obtained: user.certifications_obtained,
    certifications_planned: user.certifications_planned,
  });

  return (
    <div className="px-4 pb-5 pt-2 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6 p-5 rounded-xl bg-gray-50/80 dark:bg-cyber-surface/50 border border-gray-100 dark:border-cyber-border">
        {/* Column 1: Personal Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Profile Info
          </h4>
          <div className="space-y-2.5">
            <InfoRow icon={<Briefcase size={13} />} label="Job Role" value={user.job_role ?? 'Not set'} />
            <InfoRow icon={<MapPin size={13} />} label="Location" value={user.location ?? 'Not set'} />
            <InfoRow icon={<BarChart3 size={13} />} label="Experience" value={user.years_experience != null ? `${user.years_experience} years` : 'Not set'} />
            <InfoRow icon={<Target size={13} />} label="Career Stage" value={user.career_stage ?? 'Not set'} />
          </div>

          {/* Profile Completion */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Profile Completion</span>
              <span className="text-xs font-bold text-orange-500">{completion.label}</span>
            </div>
            <CompletionBar score={completion.score} />
          </div>
        </div>

        {/* Column 2: Skills & Targets */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Skills & Goals
          </h4>

          {user.target_roles.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Target Roles</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.target_roles.map((role) => (
                  <Tag key={role} variant="orange">{role.replace(/-/g, ' ')}</Tag>
                ))}
              </div>
            </div>
          )}

          {user.current_skills.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Current Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.current_skills.map((skill) => (
                  <Tag key={skill} variant="cyan">{skill}</Tag>
                ))}
              </div>
            </div>
          )}

          {user.target_roles.length === 0 && user.current_skills.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">No skills or target roles set yet.</p>
          )}
        </div>

        {/* Column 3: Certifications & Activity */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Certifications & Activity
          </h4>

          {user.certifications_obtained.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Obtained</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.certifications_obtained.map((cert) => (
                  <Tag key={cert} variant="orange">{cert}</Tag>
                ))}
              </div>
            </div>
          )}

          {user.certifications_planned.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Planned</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.certifications_planned.map((cert) => (
                  <Tag key={cert}>{cert}</Tag>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <InfoRow icon={<Star size={13} />} label="Total Points" value={String(user.total_points)} />
            <InfoRow icon={<Award size={13} />} label="Badges" value={String(user.badge_count)} />
            <InfoRow icon={<Zap size={13} />} label="Activities" value={String(user.activity_count)} />
            <InfoRow
              icon={<Calendar size={13} />}
              label="Last Active"
              value={user.last_activity_at ? formatDate(user.last_activity_at) : 'Never'}
            />
          </div>

          <div className="pt-3">
            <Link
              href={`/dashboard`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ExternalLink size={12} />
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const isNotSet = value === 'Not set' || value === 'Never';
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-20 shrink-0">{label}</span>
      <span className={cn('text-sm font-medium truncate', isNotSet ? 'text-gray-300 dark:text-gray-600 italic' : 'text-gray-700 dark:text-gray-200')}>
        {value}
      </span>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

interface UserManagementProps {
  users: AdminUserRow[];
}

export default function UserManagement({ users }: UserManagementProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig>({ key: 'created_at', dir: 'desc' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ─── Computed Stats ──────────────────────────────────────────────────── */

  const stats = useMemo(() => {
    const total = users.length;
    const newThisWeek = users.filter((u) => isWithinDays(u.created_at, 7)).length;
    const avgPoints = total > 0 ? Math.round(users.reduce((sum, u) => sum + u.total_points, 0) / total) : 0;

    // Most common career stage
    const stageCounts = new Map<string, number>();
    for (const u of users) {
      if (u.career_stage) {
        stageCounts.set(u.career_stage, (stageCounts.get(u.career_stage) ?? 0) + 1);
      }
    }
    let topStage = 'N/A';
    let topCount = 0;
    for (const [stage, count] of stageCounts) {
      if (count > topCount) {
        topStage = stage;
        topCount = count;
      }
    }

    return { total, newThisWeek, avgPoints, topStage };
  }, [users]);

  /* ─── Filtered & Sorted Users ─────────────────────────────────────────── */

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    let result = users;

    if (q) {
      result = result.filter(
        (u) =>
          (u.name?.toLowerCase().includes(q)) ||
          u.email.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;

      switch (sort.key) {
        case 'name': {
          const aName = (a.name ?? '').toLowerCase();
          const bName = (b.name ?? '').toLowerCase();
          return aName.localeCompare(bName) * dir;
        }
        case 'email':
          return a.email.localeCompare(b.email) * dir;
        case 'career_stage': {
          const aStage = (a.career_stage ?? '').toLowerCase();
          const bStage = (b.career_stage ?? '').toLowerCase();
          return aStage.localeCompare(bStage) * dir;
        }
        case 'total_points':
          return (a.total_points - b.total_points) * dir;
        case 'badge_count':
          return (a.badge_count - b.badge_count) * dir;
        case 'activity_count':
          return (a.activity_count - b.activity_count) * dir;
        case 'created_at':
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
        default:
          return 0;
      }
    });

    return result;
  }, [users, search, sort]);

  /* ─── Sort Toggle ─────────────────────────────────────────────────────── */

  function toggleSort(key: SortKey) {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  }

  function SortIcon({ columnKey }: { columnKey: SortKey }) {
    if (sort.key !== columnKey) {
      return <ArrowUpDown size={12} className="text-gray-300 dark:text-gray-600" />;
    }
    return sort.dir === 'desc'
      ? <ChevronDown size={12} className="text-orange-500" />
      : <ChevronUp size={12} className="text-orange-500" />;
  }

  /* ─── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-white dark:bg-cyber-midnight cyber-grid">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 dark:border-cyber-border bg-gray-50/80 dark:bg-cyber-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white font-heading tracking-tight">
                User Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stats.total} registered {stats.total === 1 ? 'user' : 'users'}
              </p>
            </div>
            <Link href="/admin/blog">
              <Button variant="brandGhost" size="brand-sm">
                <BookOpen size={15} /> Blog Admin
              </Button>
            </Link>
          </div>

          {/* ── Stats Row ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={stats.total}
              icon={<Users size={18} className="text-orange-500" />}
              accent="bg-orange-100 dark:bg-orange-500/15"
            />
            <StatCard
              label="New This Week"
              value={stats.newThisWeek}
              icon={<UserPlus size={18} className="text-cyan-500" />}
              accent="bg-cyan-100 dark:bg-cyan-500/15"
            />
            <StatCard
              label="Avg Points"
              value={stats.avgPoints}
              icon={<TrendingUp size={18} className="text-green-500" />}
              accent="bg-green-100 dark:bg-green-500/15"
            />
            <StatCard
              label="Top Career Stage"
              value={stats.topStage}
              icon={<Shield size={18} className="text-violet-500" />}
              accent="bg-violet-100 dark:bg-violet-500/15"
            />
          </div>
        </div>
      </section>

      {/* ── Search & Sort Bar ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Sort Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mr-1">
              Sort:
            </span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => toggleSort(opt.key)}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                  sort.key === opt.key
                    ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                    : 'bg-white dark:bg-cyber-card text-gray-500 dark:text-gray-400 border-gray-200 dark:border-cyber-border hover:border-orange-300 dark:hover:border-orange-500/30'
                )}
              >
                {opt.label}
                <SortIcon columnKey={opt.key} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ─────────────────────────────────────────────────── */}
        {search && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        )}

        {/* ── Desktop Table ─────────────────────────────────────────────────── */}
        <div className="hidden lg:block rounded-2xl border border-gray-100 dark:border-cyber-border overflow-hidden bg-white/80 dark:bg-cyber-card/40 backdrop-blur-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-cyber-border bg-gray-50/50 dark:bg-cyber-surface/30">
                {[
                  { key: 'name' as SortKey, label: 'User' },
                  { key: 'career_stage' as SortKey, label: 'Career Stage' },
                  { key: 'total_points' as SortKey, label: 'Points' },
                  { key: 'badge_count' as SortKey, label: 'Badges' },
                  { key: 'activity_count' as SortKey, label: 'Activities' },
                  { key: 'created_at' as SortKey, label: 'Joined' },
                ].map((col) => (
                  <th key={col.key} className="text-left px-4 py-3">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    >
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </button>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isExpanded = expandedId === user.id;
                return (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedId(isExpanded ? null : user.id)}
                  />
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Users size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {search ? 'No users match your search.' : 'No users found.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ──────────────────────────────────────────────────── */}
        <div className="lg:hidden space-y-3">
          {filteredUsers.map((user) => {
            const isExpanded = expandedId === user.id;
            return (
              <UserMobileCard
                key={user.id}
                user={user}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : user.id)}
              />
            );
          })}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <Users size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {search ? 'No users match your search.' : 'No users found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Table Row (Desktop) ─────────────────────────────────────────────────── */

interface UserRowProps {
  user: AdminUserRow;
  isExpanded: boolean;
  onToggle: () => void;
}

function UserTableRow({ user, isExpanded, onToggle }: UserRowProps) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={cn(
          'cursor-pointer transition-colors border-b border-gray-50 dark:border-cyber-border/50',
          isExpanded
            ? 'bg-orange-50/50 dark:bg-orange-500/5'
            : 'hover:bg-gray-50/50 dark:hover:bg-cyber-surface/30'
        )}
      >
        {/* User */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', getAvatarColor(user.id))}>
              {getInitials(user.name, user.email)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name ?? 'Unnamed'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </td>

        {/* Career Stage */}
        <td className="px-4 py-3.5">
          {user.career_stage ? (
            <Tag>{user.career_stage}</Tag>
          ) : (
            <span className="text-xs text-gray-300 dark:text-gray-600 italic">-</span>
          )}
        </td>

        {/* Points */}
        <td className="px-4 py-3.5">
          <span className="text-sm font-bold text-orange-500 tabular-nums">{user.total_points}</span>
        </td>

        {/* Badges */}
        <td className="px-4 py-3.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">{user.badge_count}</span>
        </td>

        {/* Activities */}
        <td className="px-4 py-3.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">{user.activity_count}</span>
        </td>

        {/* Joined */}
        <td className="px-4 py-3.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(user.created_at)}</span>
        </td>

        {/* Expand chevron */}
        <td className="px-3 py-3.5">
          {isExpanded ? (
            <ChevronUp size={16} className="text-orange-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-300 dark:text-gray-600" />
          )}
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-white dark:bg-cyber-card/20">
            <UserDetail user={user} />
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Mobile Card ─────────────────────────────────────────────────────────── */

function UserMobileCard({ user, isExpanded, onToggle }: UserRowProps) {
  return (
    <div className={cn(
      'rounded-2xl border transition-all overflow-hidden',
      isExpanded
        ? 'border-orange-200 dark:border-orange-500/20 bg-white dark:bg-cyber-card/60'
        : 'border-gray-100 dark:border-cyber-border bg-white/80 dark:bg-cyber-card/40'
    )}>
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-3"
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0', getAvatarColor(user.id))}>
          {getInitials(user.name, user.email)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user.name ?? 'Unnamed'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-bold text-orange-500 tabular-nums">{user.total_points} pts</span>
          {user.career_stage && <Tag>{user.career_stage}</Tag>}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-orange-500 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
        )}
      </button>

      {/* Quick stats row */}
      <div className="px-4 pb-3 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <Award size={11} /> {user.badge_count} badges
        </span>
        <span className="flex items-center gap-1">
          <Zap size={11} /> {user.activity_count} activities
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {formatDate(user.created_at)}
        </span>
      </div>

      {isExpanded && <UserDetail user={user} />}
    </div>
  );
}
