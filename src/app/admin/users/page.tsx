import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '@/lib/admin';
import UserManagement from '@/components/admin/UserManagement';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management — LumaShift',
  description: 'Manage users and view engagement metrics',
};

/* ─── Types for the data we pass to the client ────────────────────────────── */

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  location: string | null;
  job_role: string | null;
  years_experience: number | null;
  career_stage: string | null;
  target_roles: string[];
  current_skills: string[];
  certifications_obtained: string[];
  certifications_planned: string[];
  total_points: number;
  created_at: string;
  updated_at: string;
  activity_count: number;
  badge_count: number;
  last_activity_at: string | null;
}

export default async function AdminUsersPage() {
  const adminCheck = await checkAdmin();
  if (!adminCheck.userId) {
    redirect('/auth/login?redirectTo=/admin/users');
  }
  if (!adminCheck.authorized) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  /* ─── Fetch all profiles ───────────────────────────────────────────────── */

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Failed to fetch profiles:', profilesError);
  }

  const allProfiles = profiles ?? [];
  const userIds = allProfiles.map((p) => p.id as string);

  /* ─── Parallel queries for activity counts, badge counts, last activity ─ */

  const [activityCountResult, badgeCountResult, lastActivityResult] = await Promise.all([
    supabase
      .from('activity_logs')
      .select('user_id', { count: 'exact', head: false })
      .in('user_id', userIds.length > 0 ? userIds : ['__none__']),
    supabase
      .from('user_badges')
      .select('user_id', { count: 'exact', head: false })
      .in('user_id', userIds.length > 0 ? userIds : ['__none__']),
    supabase
      .from('activity_logs')
      .select('user_id, created_at')
      .in('user_id', userIds.length > 0 ? userIds : ['__none__'])
      .order('created_at', { ascending: false }),
  ]);

  /* ─── Build lookup maps ────────────────────────────────────────────────── */

  const activityCountMap = new Map<string, number>();
  for (const row of activityCountResult.data ?? []) {
    const uid = row.user_id as string;
    activityCountMap.set(uid, (activityCountMap.get(uid) ?? 0) + 1);
  }

  const badgeCountMap = new Map<string, number>();
  for (const row of badgeCountResult.data ?? []) {
    const uid = row.user_id as string;
    badgeCountMap.set(uid, (badgeCountMap.get(uid) ?? 0) + 1);
  }

  const lastActivityMap = new Map<string, string>();
  for (const row of lastActivityResult.data ?? []) {
    const uid = row.user_id as string;
    if (!lastActivityMap.has(uid)) {
      lastActivityMap.set(uid, row.created_at as string);
    }
  }

  /* ─── Merge into AdminUserRow[] ────────────────────────────────────────── */

  const users: AdminUserRow[] = allProfiles.map((p) => ({
    id: p.id as string,
    name: (p.name as string | null) ?? null,
    email: (p.email as string) ?? '',
    avatar_url: (p.avatar_url as string | null) ?? null,
    location: (p.location as string | null) ?? null,
    job_role: (p.job_role as string | null) ?? null,
    years_experience: (p.years_experience as number | null) ?? null,
    career_stage: (p.career_stage as string | null) ?? null,
    target_roles: (p.target_roles as string[]) ?? [],
    current_skills: (p.current_skills as string[]) ?? [],
    certifications_obtained: (p.certifications_obtained as string[]) ?? [],
    certifications_planned: (p.certifications_planned as string[]) ?? [],
    total_points: (p.total_points as number) ?? 0,
    created_at: p.created_at as string,
    updated_at: p.updated_at as string,
    activity_count: activityCountMap.get(p.id as string) ?? 0,
    badge_count: badgeCountMap.get(p.id as string) ?? 0,
    last_activity_at: lastActivityMap.get(p.id as string) ?? null,
  }));

  return <UserManagement users={users} />;
}
