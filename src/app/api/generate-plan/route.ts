import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { roles, getRoleById } from '@/data/roles';
import { getPathwayByRoleId } from '@/data/career-pathways';

/* ─── Types ───────────────────────────────────────────────────────── */

interface GeneratePlanBody {
  targetRole: string;
  timeCommitment: '5hrs/week' | '10hrs/week' | '20hrs/week' | 'full-time';
  budget: 'minimal' | 'moderate' | 'flexible';
}

const VALID_TIME = ['5hrs/week', '10hrs/week', '20hrs/week', 'full-time'] as const;
const VALID_BUDGET = ['minimal', 'moderate', 'flexible'] as const;

/* ─── System prompt ───────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are a senior cybersecurity career coach working for LumaShift, a Malaysian cybersecurity career coaching platform. You create highly specific, personalised career study plans.

Your style:
- Give SPECIFIC, ACTIONABLE advice — never generic filler
- Reference the user's ACTUAL skills, certifications, experience, and gaps
- Provide realistic timeframes adjusted to the user's stated time commitment
- Recommend specific certifications with a clear study order and estimated hours
- Suggest LumaShift services ONLY where they genuinely add value — not in every section
- Adjust resource recommendations based on budget:
  - "minimal" → free resources, open-source tools, community courses, YouTube, TryHackMe free tier
  - "moderate" → mix of free and affordable paid courses (Udemy, INE, TCM Security), budget certs first
  - "flexible" → premium training (SANS, Offensive Security), paid labs, multiple certifications in parallel
- Use clean markdown formatting for readability
- Be encouraging but honest about the effort required
- Include Malaysian context where relevant (job market, salaries, local employers)

Output format — always follow this structure exactly:

## Your Personalised Career Plan: [Role Name]

### Current Assessment
[2-3 sentences assessing where the user stands based on their profile, skills, certs, and quiz results. Be specific.]

### Phase 1: Foundation (Weeks 1-4)
**Focus:** [main focus area]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
**Certification Target:** [cert name if applicable, or "None — focus on skills first"]
**LumaShift Service:** [recommended service with brief reason, or "N/A for this phase"]

### Phase 2: Building (Weeks 5-12)
**Focus:** [main focus area]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
**Certification Target:** [cert name]
**LumaShift Service:** [recommended service or N/A]

### Phase 3: Job-Ready (Weeks 13-16+)
**Focus:** [main focus area]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
- [ ] [specific action item with timeframe]
**Certification Target:** [cert name]
**LumaShift Service:** [recommended service or N/A]

### Recommended Certifications Path
1. [cert] — [reason it fits this user] — [estimated study hours]
2. [cert] — [reason] — [estimated hours]
3. [cert] — [reason] — [estimated hours]

### Key Resources
- [specific resource, tool, or platform with URL if possible]
- [specific resource]
- [specific resource]
- [specific resource]
- [specific resource]

### Timeline Summary
[Brief paragraph describing the overall timeline, adjusted for the user's time commitment. Include milestone dates.]`;

/* ─── Build the user prompt ───────────────────────────────────────── */

function buildUserPrompt(
  profile: Record<string, unknown> | null,
  quizResult: Record<string, unknown> | null,
  targetRole: string,
  timeCommitment: string,
  budget: string,
): string {
  const role = getRoleById(targetRole);
  const pathway = getPathwayByRoleId(targetRole);

  const parts: string[] = [];

  parts.push(`Generate a personalised career plan for the target role: **${role?.title ?? targetRole}**`);
  parts.push(`Time commitment: ${timeCommitment}`);
  parts.push(`Budget level: ${budget}`);

  // User profile context
  if (profile) {
    parts.push('\n--- USER PROFILE ---');
    if (profile.name) parts.push(`Name: ${profile.name}`);
    if (profile.job_role) parts.push(`Current Role: ${profile.job_role}`);
    if (profile.career_stage) parts.push(`Career Stage: ${profile.career_stage}`);
    if (profile.years_experience != null) parts.push(`Years of Experience: ${profile.years_experience}`);
    if (profile.location) parts.push(`Location: ${profile.location}`);

    const skills = profile.current_skills as string[] | undefined;
    if (skills?.length) parts.push(`Current Skills: ${skills.join(', ')}`);

    const certsObtained = profile.certifications_obtained as string[] | undefined;
    if (certsObtained?.length) parts.push(`Certifications Obtained: ${certsObtained.join(', ')}`);

    const certsPlanned = profile.certifications_planned as string[] | undefined;
    if (certsPlanned?.length) parts.push(`Certifications Planned: ${certsPlanned.join(', ')}`);

    const targetRoles = profile.target_roles as string[] | undefined;
    if (targetRoles?.length) parts.push(`Other Target Roles: ${targetRoles.join(', ')}`);
  } else {
    parts.push('\n--- USER PROFILE ---');
    parts.push('No profile data available. Provide a general plan for someone new to cybersecurity.');
  }

  // Quiz results
  if (quizResult) {
    parts.push('\n--- QUIZ RESULTS ---');
    if (quizResult.confidence_score != null) parts.push(`Confidence Score: ${quizResult.confidence_score}/5`);
    const recRoles = quizResult.recommended_roles as string[] | undefined;
    if (recRoles?.length) parts.push(`Quiz Recommended Roles: ${recRoles.join(', ')}`);
    const strengths = quizResult.strengths as string[] | undefined;
    if (strengths?.length) parts.push(`Strengths: ${strengths.join(', ')}`);
    const gaps = quizResult.gaps as string[] | undefined;
    if (gaps?.length) parts.push(`Gaps to Address: ${gaps.join(', ')}`);
  }

  // Target role details
  if (role) {
    parts.push('\n--- TARGET ROLE REQUIREMENTS ---');
    parts.push(`Title: ${role.title}`);
    parts.push(`Required Skills: ${role.skills.join(', ')}`);
    parts.push(`Key Tools: ${role.tools.join(', ')}`);
    parts.push(`Recommended Certifications: ${role.certifications.join(', ')}`);
    parts.push(`Background Fit: ${role.backgroundFit.join(', ')}`);
    parts.push(`Growth Path: ${role.growthPath.join(' → ')}`);
    parts.push(`Demand Level: ${role.demandLevel}`);
    if (role.avgSalaryMY) parts.push(`Malaysia Salary: ${role.avgSalaryMY}`);
    if (role.avgSalaryGlobal) parts.push(`Global Salary: ${role.avgSalaryGlobal}`);
  }

  // Career pathway stages
  if (pathway) {
    parts.push('\n--- CAREER PATHWAY STAGES ---');
    for (const stage of pathway.stages) {
      parts.push(`\n[${stage.name}] (${stage.timeframe})`);
      parts.push(`Description: ${stage.description}`);
      parts.push(`Skills: ${stage.skills.join(', ')}`);
      parts.push(`Certifications: ${stage.certifications.join(', ')}`);
      parts.push(`Milestones: ${stage.milestones.map((m) => m.title).join(', ')}`);
    }
  }

  return parts.join('\n');
}

/* ─── Fallback template plan ──────────────────────────────────────── */

function buildFallbackPlan(targetRole: string, timeCommitment: string, budget: string): string {
  const role = getRoleById(targetRole);
  const pathway = getPathwayByRoleId(targetRole);

  if (!role || !pathway) {
    return JSON.stringify({
      error: false,
      plan: `## Career Plan: ${targetRole}\n\nWe don't have detailed pathway data for this role yet. Please contact us at lumashift@outlook.com for a personalised consultation.`,
    });
  }

  const foundation = pathway.stages[0];
  const building = pathway.stages[1];
  const advanced = pathway.stages[2];

  const budgetNote =
    budget === 'minimal'
      ? 'Focus on free resources: TryHackMe free tier, YouTube tutorials, official documentation, and community labs.'
      : budget === 'moderate'
        ? 'Mix of free and affordable resources: Udemy courses, TCM Security, and budget-friendly certification vouchers.'
        : 'Invest in premium training: SANS courses, official vendor training, paid lab environments, and multiple certifications.';

  const timeNote =
    timeCommitment === '5hrs/week'
      ? 'At 5 hours per week, expect each phase to take roughly 2x the listed timeframe. Consistency is more important than speed.'
      : timeCommitment === '10hrs/week'
        ? 'At 10 hours per week, you can follow the standard timeline. Dedicate focused blocks of 2-3 hours for deep learning.'
        : timeCommitment === '20hrs/week'
          ? 'At 20 hours per week, you can accelerate through the phases. Consider pursuing certifications in parallel with hands-on labs.'
          : 'Full-time commitment allows aggressive timelines. You can aim to be job-ready within 3-4 months with intensive study.';

  const plan = `## Your Personalised Career Plan: ${role.title}

### Current Assessment
This plan is based on the ${role.title} career pathway. For a more personalised assessment, complete your profile and take our career quiz.

${timeNote}

${budgetNote}

### Phase 1: Foundation (Weeks 1-4)
**Focus:** ${foundation?.description ?? 'Build core fundamentals'}
${(foundation?.skills ?? []).slice(0, 4).map((s) => `- [ ] Learn: ${s}`).join('\n')}
- [ ] Set up a home lab environment
**Certification Target:** ${foundation?.certifications?.[0] ?? 'CompTIA Security+'}
**LumaShift Service:** Resume Review — get your CV cybersecurity-ready from day one

### Phase 2: Building (Weeks 5-12)
**Focus:** ${building?.description ?? 'Develop hands-on skills'}
${(building?.skills ?? []).slice(0, 4).map((s) => `- [ ] Develop: ${s}`).join('\n')}
- [ ] Build a portfolio project demonstrating your skills
**Certification Target:** ${building?.certifications?.[0] ?? 'Role-specific certification'}
**LumaShift Service:** Mock Interview (Technical) — practice role-specific interview questions

### Phase 3: Job-Ready (Weeks 13-16+)
**Focus:** ${advanced?.description ?? 'Specialise and prepare for job applications'}
${(advanced?.skills ?? []).slice(0, 3).map((s) => `- [ ] Master: ${s}`).join('\n')}
- [ ] Apply to ${role.title} positions
- [ ] Prepare for technical and behavioural interviews
**Certification Target:** ${advanced?.certifications?.[0] ?? 'Advanced certification'}
**LumaShift Service:** Career Accelerator Package — intensive 4-week coaching programme

### Recommended Certifications Path
${role.certifications.map((c, i) => `${i + 1}. ${c} — Essential for ${role.title} roles — ~60-120 study hours`).join('\n')}

### Key Resources
- TryHackMe or HackTheBox — hands-on labs
- Official certification study guides
- LumaShift Career Roadmap (/roadmap) — track your progress
- LumaShift Skill Gap Analysis (/skill-gap) — identify priority areas
- Professor Messer (YouTube) — free certification prep videos

### Timeline Summary
With ${timeCommitment} commitment and a ${budget} budget, aim to complete the foundation phase in 4 weeks, build practical skills over weeks 5-12, and be actively job-hunting by week 13-16. The ${role.title} role has ${role.demandLevel.toLowerCase()} demand in the market, with Malaysian salaries around ${role.avgSalaryMY ?? 'competitive rates'}.`;

  return JSON.stringify({ error: false, plan });
}

/* ─── POST handler ────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse and validate body
    const body = (await req.json()) as GeneratePlanBody;
    const { targetRole, timeCommitment, budget } = body;

    if (!targetRole || !timeCommitment || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: targetRole, timeCommitment, budget' },
        { status: 400 },
      );
    }

    if (!VALID_TIME.includes(timeCommitment as (typeof VALID_TIME)[number])) {
      return NextResponse.json(
        { error: `Invalid timeCommitment. Must be one of: ${VALID_TIME.join(', ')}` },
        { status: 400 },
      );
    }

    if (!VALID_BUDGET.includes(budget as (typeof VALID_BUDGET)[number])) {
      return NextResponse.json(
        { error: `Invalid budget. Must be one of: ${VALID_BUDGET.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate role exists
    const role = getRoleById(targetRole);
    if (!role) {
      const validIds = roles.map((r) => r.id).join(', ');
      return NextResponse.json(
        { error: `Unknown targetRole "${targetRole}". Valid roles: ${validIds}` },
        { status: 400 },
      );
    }

    // Fetch user profile and quiz results
    const [profileRes, quizRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    const profile = profileRes.data;
    const quizResult = quizRes.data?.[0] ?? null;

    // Check for Anthropic API key
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback: return a template plan from career pathway data
      const fallback = buildFallbackPlan(targetRole, timeCommitment, budget);
      return new NextResponse(fallback, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build prompt and call Claude
    const userPrompt = buildUserPrompt(profile, quizResult, targetRole, timeCommitment, budget);

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Stream the response as text/plain
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('[Generate Plan] Stream error:', err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('[Generate Plan API]', err);
    return NextResponse.json(
      { error: 'Failed to generate career plan. Please try again.' },
      { status: 500 },
    );
  }
}
