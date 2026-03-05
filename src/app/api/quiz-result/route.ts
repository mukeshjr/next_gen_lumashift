import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { confidence_score, recommended_roles, recommended_services, strengths, gaps, talk_to_coach, answers } = body;

  if (confidence_score == null) {
    return NextResponse.json({ error: 'confidence_score required' }, { status: 400 });
  }

  const { error } = await supabase.from('quiz_results').insert({
    user_id: user.id,
    confidence_score,
    recommended_roles: recommended_roles ?? [],
    recommended_services: recommended_services ?? [],
    strengths: strengths ?? [],
    gaps: gaps ?? [],
    talk_to_coach: talk_to_coach ?? false,
    answers: answers ?? {},
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity (awards 50 pts + possibly quiz_finisher badge)
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    event_type: 'quiz_attempt',
    item_id: `quiz-${Date.now()}`,
    item_title: 'Career Quiz',
    points_awarded: 50,
  });

  // Update points
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points')
    .eq('id', user.id)
    .single();

  await supabase
    .from('profiles')
    .update({ total_points: (profile?.total_points ?? 0) + 50 })
    .eq('id', user.id);

  // Award quiz_finisher badge if not already earned
  const { data: existing } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', user.id)
    .eq('badge_id', 'quiz_finisher')
    .maybeSingle();

  if (!existing) {
    await supabase.from('user_badges').insert({
      user_id: user.id,
      badge_id: 'quiz_finisher',
      badge_name: 'Quiz Finisher',
      badge_description: 'Completed the Cybersecurity Career Quiz',
      badge_icon: '🎯',
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ results: data ?? [] });
}
