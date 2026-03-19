import { createClient } from '@/lib/supabase/server';
import { roles } from '@/data/roles';
import { careerPathways } from '@/data/career-pathways';
import { computeProfileCompletion } from '@/lib/profile-completion';
import SkillGapClient from '@/components/skill-gap/SkillGapClient';
import type { Metadata } from 'next';
import type { UserProfile, QuizResultRecord, RoleData, CareerPathway } from '@/types';

export const metadata: Metadata = {
  title: 'Skill Gap Analysis — LumaShift',
  description:
    'Identify skill gaps in your cybersecurity career. Get a personalised radar view of where you stand versus where you need to be — with actionable next steps.',
  openGraph: {
    title: 'Skill Gap Analysis — LumaShift',
    description:
      'Identify skill gaps in your cybersecurity career with personalised radar analysis and readiness scoring.',
  },
};

export default async function SkillGapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: UserProfile | null = null;
  let latestQuiz: QuizResultRecord | null = null;
  let totalActivities = 0;
  let totalSavedItems = 0;
  let profileCompletionScore = 0;

  if (user) {
    const [profileRes, quizRes, activityRes, savedRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('activity_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('saved_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    profile = (profileRes.data as UserProfile) ?? null;
    latestQuiz = (quizRes.data?.[0] as QuizResultRecord) ?? null;
    totalActivities = activityRes.count ?? 0;
    totalSavedItems = savedRes.count ?? 0;

    if (profile) {
      const completion = computeProfileCompletion(profile);
      profileCompletionScore = completion.score;
    }
  }

  return (
    <SkillGapClient
      profile={profile}
      latestQuiz={latestQuiz}
      totalActivities={totalActivities}
      totalSavedItems={totalSavedItems}
      profileCompletionScore={profileCompletionScore}
      allRoles={roles as RoleData[]}
      allPathways={careerPathways as CareerPathway[]}
    />
  );
}
