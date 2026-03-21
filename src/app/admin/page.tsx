import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '@/lib/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — LumaShift',
  description: 'LumaShift admin analytics and command center',
};

/* ─── Types for aggregated data passed to the client ──────────────────────── */

export interface EventTypeCount {
  event_type: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  user_id: string;
  event_type: string;
  item_id: string | null;
  item_title: string | null;
  points_awarded: number;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
}

export interface SavedPostCount {
  item_id: string;
  item_title: string;
  count: number;
}

export interface ServiceInterestCount {
  service_id: string;
  count: number;
}

export interface AdminData {
  totalUsers: number;
  newUsersThisWeek: number;
  activitiesThisWeek: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  quizCompletions: number;
  topEventTypes: EventTypeCount[];
  recentActivities: RecentActivity[];
  mostSavedPosts: SavedPostCount[];
  serviceInterests: ServiceInterestCount[];
}

export default async function AdminPage() {
  const adminCheck = await checkAdmin();
  if (!adminCheck.userId) {
    redirect('/auth/login?redirectTo=/admin');
  }
  if (!adminCheck.authorized) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Run all queries in parallel
  const [
    totalUsersResult,
    newUsersResult,
    activitiesWeekResult,
    totalBlogResult,
    publishedBlogResult,
    quizResult,
    eventTypesRawResult,
    recentActivitiesResult,
    savedItemsRawResult,
    serviceInterestsRawResult,
  ] = await Promise.all([
    // 1. Total user count
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }),

    // 2. Users created this week
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo),

    // 3. Activities this week
    supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo),

    // 4. Total blog posts
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true }),

    // 5. Published blog posts
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true),

    // 6. Quiz completions
    supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true }),

    // 7. Activity logs this week for event_type grouping
    supabase
      .from('activity_logs')
      .select('event_type')
      .gte('created_at', oneWeekAgo),

    // 8. Recent activities with user info (last 20)
    supabase
      .from('activity_logs')
      .select('id, user_id, event_type, item_id, item_title, points_awarded, created_at')
      .order('created_at', { ascending: false })
      .limit(20),

    // 9. Saved blog posts for grouping
    supabase
      .from('saved_items')
      .select('item_id, item_title')
      .eq('item_type', 'blog_post'),

    // 10. Service interests for grouping
    supabase
      .from('service_interests')
      .select('service_id'),
  ]);

  // Aggregate event types in JS
  const eventTypeCounts = new Map<string, number>();
  if (eventTypesRawResult.data) {
    for (const row of eventTypesRawResult.data) {
      const et = row.event_type as string;
      eventTypeCounts.set(et, (eventTypeCounts.get(et) ?? 0) + 1);
    }
  }
  const topEventTypes: EventTypeCount[] = Array.from(eventTypeCounts.entries())
    .map(([event_type, count]) => ({ event_type, count }))
    .sort((a, b) => b.count - a.count);

  // Fetch user profiles for recent activities
  const recentRaw = recentActivitiesResult.data ?? [];
  const userIds = [...new Set(recentRaw.map((a) => a.user_id))];

  let userMap = new Map<string, { name: string | null; email: string | null }>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', userIds);
    if (profiles) {
      for (const p of profiles) {
        userMap.set(p.id, { name: p.name, email: p.email });
      }
    }
  }

  const recentActivities: RecentActivity[] = recentRaw.map((a) => {
    const userInfo = userMap.get(a.user_id);
    return {
      ...a,
      user_name: userInfo?.name ?? null,
      user_email: userInfo?.email ?? null,
    };
  });

  // Aggregate saved blog posts by item_id
  const savedCounts = new Map<string, { title: string; count: number }>();
  if (savedItemsRawResult.data) {
    for (const row of savedItemsRawResult.data) {
      const id = row.item_id as string;
      const title = (row.item_title as string) ?? id;
      const existing = savedCounts.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        savedCounts.set(id, { title, count: 1 });
      }
    }
  }
  const mostSavedPosts: SavedPostCount[] = Array.from(savedCounts.entries())
    .map(([item_id, { title, count }]) => ({ item_id, item_title: title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Aggregate service interests by service_id
  const serviceCounts = new Map<string, number>();
  if (serviceInterestsRawResult.data) {
    for (const row of serviceInterestsRawResult.data) {
      const sid = row.service_id as string;
      serviceCounts.set(sid, (serviceCounts.get(sid) ?? 0) + 1);
    }
  }
  const serviceInterests: ServiceInterestCount[] = Array.from(serviceCounts.entries())
    .map(([service_id, count]) => ({ service_id, count }))
    .sort((a, b) => b.count - a.count);

  const adminData: AdminData = {
    totalUsers: totalUsersResult.count ?? 0,
    newUsersThisWeek: newUsersResult.count ?? 0,
    activitiesThisWeek: activitiesWeekResult.count ?? 0,
    totalBlogPosts: totalBlogResult.count ?? 0,
    publishedBlogPosts: publishedBlogResult.count ?? 0,
    quizCompletions: quizResult.count ?? 0,
    topEventTypes,
    recentActivities,
    mostSavedPosts,
    serviceInterests,
  };

  return <AdminDashboard data={adminData} />;
}
