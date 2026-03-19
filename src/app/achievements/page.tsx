import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { computeProfileCompletion } from '@/lib/profile-completion';
import AchievementsClient from '@/components/achievements/AchievementsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievements | LumaShift',
  description: 'Track your badges, milestones, and progress on your cybersecurity career journey.',
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirectTo=/achievements');

  const [
    profileResult,
    activityResult,
    savedResult,
    badgesResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('saved_items').select('*').eq('user_id', user.id),
    supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const activities = activityResult.data ?? [];
  const savedItems = savedResult.data ?? [];
  const userBadges = badgesResult.data ?? [];

  const completion = profile
    ? computeProfileCompletion(profile)
    : { score: 0, label: 'Beginner', missingFields: [], completedFields: [] };

  const totalPoints = profile?.total_points ?? 0;

  return (
    <AchievementsClient
      totalPoints={totalPoints}
      profileScore={completion.score}
      activities={activities}
      savedItemsCount={savedItems.length}
      userBadges={userBadges}
      userName={profile?.name ?? user.email?.split('@')[0] ?? 'Explorer'}
      hasCertPlanned={(profile?.certifications_planned?.length ?? 0) > 0}
    />
  );
}
