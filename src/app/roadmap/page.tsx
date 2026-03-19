import { createClient } from '@/lib/supabase/server';
import { roles } from '@/data/roles';
import { careerPathways } from '@/data/career-pathways';
import { RoadmapClient } from '@/components/roadmap/RoadmapClient';
import type { Metadata } from 'next';
import type { UserProfile, QuizResultRecord, RoleData, CareerPathway } from '@/types';

export const metadata: Metadata = {
  title: 'Career Roadmap — LumaShift',
  description:
    'Visualise your cybersecurity career path. See the skills, certifications, and milestones for every stage — personalised to your profile.',
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: UserProfile | null = null;
  let quizResult: QuizResultRecord | null = null;

  if (user) {
    const [profileRes, quizRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    profile = (profileRes.data as UserProfile) ?? null;
    quizResult = (quizRes.data?.[0] as QuizResultRecord) ?? null;
  }

  return (
    <RoadmapClient
      profile={profile}
      quizResult={quizResult}
      allRoles={roles as RoleData[]}
      allPathways={careerPathways as CareerPathway[]}
    />
  );
}
