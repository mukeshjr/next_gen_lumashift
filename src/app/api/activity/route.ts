import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pointsForEvent, BADGES, checkEarnedBadges, type EventType } from '@/lib/gamification';

const ALLOWED_EVENTS: EventType[] = [
  'blog_read',
  'resource_view',
  'resource_saved',
  'quiz_attempt',
  'role_explored',
  'roles_compared',
  'service_viewed',
  'service_requested',
  'profile_updated',
  'first_login',
];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { event_type, item_id, item_title, metadata } = body;

  if (!event_type || !ALLOWED_EVENTS.includes(event_type)) {
    return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 });
  }

  // Deduplicate: don't log same blog read / role explored more than once
  const deduplicatedEvents = ['blog_read', 'role_explored'];
  if (deduplicatedEvents.includes(event_type) && item_id) {
    const { data: existing } = await supabase
      .from('activity_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_type', event_type)
      .eq('item_id', item_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, duplicate: true, points: 0 });
    }
  }

  const points = pointsForEvent(event_type);

  // Insert activity log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    event_type,
    item_id: item_id ?? null,
    item_title: item_title ?? null,
    metadata: metadata ?? {},
    points_awarded: points,
  });

  // Update total_points in profile
  if (points > 0) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({ total_points: (profileData?.total_points ?? 0) + points })
      .eq('id', user.id);
  }

  // Check for new badges
  const { data: activityCounts } = await supabase
    .from('activity_logs')
    .select('event_type')
    .eq('user_id', user.id);

  const { data: savedCounts } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id);

  const { data: quizCounts } = await supabase
    .from('quiz_results')
    .select('id')
    .eq('user_id', user.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, current_role, years_experience, career_stage, target_roles, current_skills')
    .eq('id', user.id)
    .single();

  const { computeProfileCompletion } = await import('@/lib/profile-completion');
  const { score: profileScore } = computeProfileCompletion(profile ?? {});

  const logs = activityCounts ?? [];
  const ctx = {
    profileScore,
    rolesExplored: logs.filter((l) => l.event_type === 'role_explored').length,
    blogsRead: logs.filter((l) => l.event_type === 'blog_read').length,
    quizzesTaken: (quizCounts ?? []).length,
    rolesCompared: logs.filter((l) => l.event_type === 'roles_compared').length,
    resourcesSaved: (savedCounts ?? []).length,
  };

  const earned = checkEarnedBadges(ctx);
  const { data: existingBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', user.id);

  const existing = new Set((existingBadges ?? []).map((b) => b.badge_id));
  const newBadges = earned.filter((id) => !existing.has(id));

  if (newBadges.length > 0) {
    const badgeRows = newBadges.map((id) => {
      const badge = BADGES.find((b) => b.id === id)!;
      return {
        user_id: user.id,
        badge_id: id,
        badge_name: badge.name,
        badge_description: badge.description,
        badge_icon: badge.icon,
      };
    });
    await supabase.from('user_badges').insert(badgeRows);
  }

  return NextResponse.json({ success: true, points, newBadges });
}
