import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { computeProfileCompletion } from '@/lib/profile-completion';
import { BADGES, checkEarnedBadges } from '@/lib/gamification';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const completion = computeProfileCompletion(profile);
  return NextResponse.json({ profile, completion });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Only allow safe fields
  const allowed = [
    'name', 'location', 'avatar_url',
    'job_role', 'years_experience', 'career_stage',
    'target_roles', 'current_skills', 'certifications_obtained', 'certifications_planned',
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recompute profile score and award points/badges
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    const { score } = computeProfileCompletion(profile);

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

    const logs = activityCounts ?? [];
    const savedCount = (savedCounts ?? []).length;
    const ctx = {
      profileScore: score,
      rolesExplored: logs.filter((l) => l.event_type === 'role_explored').length,
      blogsRead: logs.filter((l) => l.event_type === 'blog_read').length,
      quizzesTaken: (quizCounts ?? []).length,
      rolesCompared: logs.filter((l) => l.event_type === 'roles_compared').length,
      resourcesSaved: savedCount,
      servicesViewed: logs.filter((l) => l.event_type === 'service_viewed').length,
      roadmapViewed: logs.some((l) => l.event_type === 'roadmap_viewed'),
      skillGapViewed: logs.some((l) => l.event_type === 'skill_gap_viewed'),
      hasSavedItem: savedCount > 0,
      hasCertPlanned: (profile?.certifications_planned?.length ?? 0) > 0,
      profileComplete: score >= 100,
      streakDays: 0, // Streak calculation is handled separately
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
  }

  return NextResponse.json({ success: true });
}
