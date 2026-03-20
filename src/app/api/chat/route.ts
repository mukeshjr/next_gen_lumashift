import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const LUMASHIFT_CONTEXT = `You are LumaShift's AI Career Advisor — not just a chatbot. You are a knowledgeable, warm, direct cybersecurity career coach.

ABOUT LUMASHIFT:
LumaShift is a Malaysian cybersecurity career coaching platform founded by Mukesh Vijaian and Lavanyah Prabu. We help professionals break into and grow within cybersecurity.

SERVICES OFFERED:
- Resume Review (From RM 150) — ATS-optimised resume for cybersecurity roles
- LinkedIn Profile Optimisation (From RM 120) — Keyword-rich profile to attract recruiters
- Career Consultation 30 min (From RM 80) — Quick direction session
- Career Consultation 60 min (From RM 150) — Full roadmap, certs, salary strategy
- Mock Interview Technical (From RM 200) — Role-specific interview simulation
- Mock Interview Behavioural (From RM 180) — STAR-method, salary negotiation
- Starter Launch Package (From RM 320) — Resume + LinkedIn + 30-min consult
- Job-Ready Package (From RM 650) — Resume + LinkedIn + 60-min consult + 2 mock interviews (MOST POPULAR)
- Career Accelerator Package (From RM 1,800) — 4-week programme, 4 coaching sessions, 3 mock interviews
- GRC Coaching Track (From RM 1,200) — For GRC/compliance/audit professionals
- SOC/Blue Team Track (From RM 1,200) — For SOC analysts and incident responders
- Cloud Security Track (From RM 1,200) — For cloud engineers moving into security
- OT/ICS Security Track (From RM 1,400) — For industrial/SCADA security specialists
- Cybersecurity Workshop (From RM 800, group) — For universities and corporates

TEAM:
- Mukesh Vijaian — Co-Founder & Lead Career Coach. Expertise: SOC, Cloud Security, Threat Intelligence.
- Lavanyah Prabu — Co-Founder & Career Strategy Coach. Expertise: GRC, Risk, Compliance, Soft Skills.

CAREER PATHS COVERED:
Security Analyst, Security Engineer, GRC Analyst, Cloud Security Engineer, SOC Analyst, OT/ICS Security Specialist

SALARY BENCHMARKS (Malaysia, monthly):
- SOC Analyst: RM 3,500–9,000
- Security Analyst: RM 4,000–8,000
- GRC Analyst: RM 5,000–12,000
- Security Engineer: RM 7,000–15,000
- Cloud Security Engineer: RM 8,000–18,000
- OT/ICS Security: RM 8,000–20,000

PLATFORM FEATURES:
- Career Quiz (/quiz) — personalised role and service recommendations
- Career Roadmap (/roadmap) — stage-by-stage progression for each role
- Skill Gap Analysis (/skill-gap) — radar chart showing skills vs requirements
- Achievements (/achievements) — gamification with badges and milestones
- Compare Roles (/compare-roles) — side-by-side role comparison
- Free Resources (/resources) — resume templates, cert roadmaps, checklists

CONTACT: lumashift@outlook.com — responds within 24 hours. Sessions via Google Meet/Zoom.`;

const ADVISOR_INSTRUCTIONS = `YOUR ROLE AS AI CAREER ADVISOR:
- You have access to the user's profile data (if logged in). Use it to give PERSONALISED advice.
- Reference their specific skills, certifications, target roles, and gaps when relevant.
- Be specific: "Based on your interest in cloud security and your Python skills, I'd recommend..."
- Proactively suggest the Career Roadmap, Skill Gap Analysis, or Quiz when they'd benefit from them.
- For complex or sensitive decisions, encourage booking a human consultation.
- Keep responses concise (2-4 paragraphs max), warm, direct, and actionable.
- Use markdown formatting for readability (bold, bullets, links).
- When recommending services, explain WHY it fits their specific situation.
- If the user hasn't completed their profile, gently encourage them to do so.
- Do NOT make up information. If unsure, direct to lumashift@outlook.com.
- Always end with a clear next action the user can take.`;

function buildUserContext(profile: Record<string, unknown> | null, quizResult: Record<string, unknown> | null): string {
  if (!profile) return '\n\nUSER CONTEXT: This user is not logged in. Encourage them to create an account and complete their profile for personalised guidance.';

  const parts: string[] = ['\n\nUSER CONTEXT (use this to personalise your responses):'];

  if (profile.name) parts.push(`- Name: ${profile.name}`);
  if (profile.job_role) parts.push(`- Current Role: ${profile.job_role}`);
  if (profile.career_stage) parts.push(`- Career Stage: ${profile.career_stage}`);
  if (profile.years_experience != null) parts.push(`- Years of Experience: ${profile.years_experience}`);
  if (profile.location) parts.push(`- Location: ${profile.location}`);

  const targetRoles = profile.target_roles as string[] | undefined;
  if (targetRoles?.length) parts.push(`- Target Roles: ${targetRoles.join(', ')}`);

  const currentSkills = profile.current_skills as string[] | undefined;
  if (currentSkills?.length) parts.push(`- Current Skills: ${currentSkills.join(', ')}`);

  const certsObtained = profile.certifications_obtained as string[] | undefined;
  if (certsObtained?.length) parts.push(`- Certifications Obtained: ${certsObtained.join(', ')}`);

  const certsPlanned = profile.certifications_planned as string[] | undefined;
  if (certsPlanned?.length) parts.push(`- Certifications Planned: ${certsPlanned.join(', ')}`);

  if (quizResult) {
    parts.push('');
    parts.push('QUIZ RESULTS:');
    if (quizResult.confidence_score != null) parts.push(`- Confidence Score: ${quizResult.confidence_score}/5`);
    const recRoles = quizResult.recommended_roles as string[] | undefined;
    if (recRoles?.length) parts.push(`- Recommended Roles: ${recRoles.join(', ')}`);
    const strengths = quizResult.strengths as string[] | undefined;
    if (strengths?.length) parts.push(`- Strengths: ${strengths.join(', ')}`);
    const gaps = quizResult.gaps as string[] | undefined;
    if (gaps?.length) parts.push(`- Gaps to Address: ${gaps.join(', ')}`);
    if (quizResult.talk_to_coach) parts.push('- Flag: User should speak with a human coach');
  }

  // Missing profile fields
  const missing: string[] = [];
  if (!profile.name) missing.push('name');
  if (!profile.job_role) missing.push('current role');
  if (!targetRoles?.length) missing.push('target roles');
  if (!currentSkills?.length) missing.push('current skills');
  if (missing.length > 0) {
    parts.push(`\nProfile Incomplete — missing: ${missing.join(', ')}. Gently encourage them to complete their profile at /profile.`);
  }

  return parts.join('\n');
}

// Rule-based fallback responses when no Anthropic API key
const FALLBACK_RULES: { patterns: string[]; response: string }[] = [
  {
    patterns: ['resume', 'cv', 'curriculum'],
    response: `**Resume help** is one of our most popular services! Here's what we offer:\n\n- **Resume Review (From RM 150)** — ATS-optimised, with keyword strategy and rewrite suggestions within 3 business days\n- **Starter Launch Package (From RM 320)** — Resume + LinkedIn + 30-min consult bundle\n\nFor a cybersecurity resume, the most important things are: quantified achievements, ATS keywords per role, and clearly articulated technical projects.\n\n[Contact us](/contact?service=resume-review) or [take our quiz](/quiz) to find the right package.`,
  },
  {
    patterns: ['linkedin', 'profile', 'recruiter'],
    response: `**LinkedIn optimisation** is crucial for cybersecurity job hunting. Our **LinkedIn Profile Optimisation service (From RM 120)** covers:\n\n- Keyword-rich headline that ranks in recruiter searches\n- Compelling About section that tells your story\n- Skills section aligned with target roles\n\nMost clients see 3x more recruiter messages within 30 days.\n\n[Enquire about LinkedIn Optimisation](/contact?service=linkedin-optimisation)`,
  },
  {
    patterns: ['interview', 'mock', 'prepare', 'preparation'],
    response: `**Interview preparation** is where we see the biggest impact. We offer:\n\n- **Technical Mock Interview (From RM 200)** — Role-specific questions, realistic pressure, detailed written feedback\n- **Behavioural Mock Interview (From RM 180)** — STAR method, salary negotiation scripts, HR question handling\n\nOur **Job-Ready Package (From RM 650)** includes both types plus resume + LinkedIn.\n\n[Book a Mock Interview](/contact?service=mock-interview-technical)`,
  },
  {
    patterns: ['grc', 'governance', 'risk', 'compliance', 'audit', 'iso 27001', 'pdpa'],
    response: `**GRC (Governance, Risk & Compliance)** is one of the fastest-growing areas in Malaysian cybersecurity.\n\nOur **GRC Coaching Track (From RM 1,200)** covers ISO 27001, NIST CSF, PDPA/DPDPA, portfolio building, and interview prep.\n\nCoached by **Lavanyah Prabu**, who has hands-on GRC experience.\n\n[Explore GRC Track](/services) | [Contact Us](/contact)`,
  },
  {
    patterns: ['soc', 'blue team', 'incident response', 'siem', 'splunk', 'threat hunt'],
    response: `**SOC/Blue Team** roles are the most common entry point. Our **SOC/Blue Team Track (From RM 1,200)** covers alert triage, SIEM queries, IR playbooks, and interview prep.\n\nCertification path: Security+ → CySA+ → GCIH\n\n[Explore SOC Track](/services)`,
  },
  {
    patterns: ['cloud', 'aws', 'azure', 'gcp', 'cloud security'],
    response: `**Cloud Security** is the highest-paying specialisation. Our **Cloud Security Track (From RM 1,200)** covers cloud-native security, IAM, CSPM, and interview prep.\n\nIn Malaysia, senior cloud security engineers earn RM 12,000–18,000/month.\n\n[Explore Cloud Security Track](/services)`,
  },
  {
    patterns: ['salary', 'pay', 'wage', 'earn', 'compensation', 'rm', 'ringgit'],
    response: `**Malaysian Cybersecurity Salary Benchmarks (2025):**\n\n| Role | Entry | Mid | Senior |\n|------|-------|-----|--------|\n| SOC Analyst | RM 3,500–5,000 | RM 5,000–8,000 | RM 8,000–12,000 |\n| Security Analyst | RM 4,000–6,000 | RM 6,000–10,000 | RM 10,000–15,000 |\n| GRC Analyst | RM 4,500–6,500 | RM 6,500–11,000 | RM 11,000–16,000 |\n| Cloud Security Eng. | RM 7,000–10,000 | RM 10,000–16,000 | RM 16,000–22,000 |\n\nMNCs typically pay 20–40% above local market.\n\n[Book a Consultation](/contact?service=career-consultation-60)`,
  },
  {
    patterns: ['certification', 'cert', 'comptia', 'cissp', 'ceh', 'oscp', 'study'],
    response: `**Best cybersecurity certifications by level:**\n\n**Entry (0-2 years):** CompTIA Security+, ISC2 CC, Google Cybersecurity Certificate\n**Mid (2-5 years):** CySA+, CISA (GRC), AWS Security Specialty\n**Senior:** CISSP, CISM, CCSP\n\nCheck your personalised cert path on our [Career Roadmap](/roadmap) or [get a consultation](/contact).`,
  },
  {
    patterns: ['price', 'cost', 'how much', 'fee', 'package', 'affordable'],
    response: `**LumaShift Pricing:**\n\n| Service | From |\n|---------|------|\n| Resume Review | RM 150 |\n| LinkedIn Optimisation | RM 120 |\n| Career Consultation (30 min) | RM 80 |\n| Mock Interview | RM 180–200 |\n| **Job-Ready Package** | **RM 650** |\n| Career Accelerator | RM 1,800 |\n| Specialist Tracks | RM 1,200 |\n\n[View all services](/services) | [Contact us](/contact)`,
  },
  {
    patterns: ['quiz', 'test', 'assess', 'which service', 'right for me', 'recommend'],
    response: `Take our **3-minute Career Quiz** at [/quiz](/quiz) — it gives you a personalised confidence score, role recommendations, and service matches.\n\nOr check your [Career Roadmap](/roadmap) for a stage-by-stage progression plan, or run a [Skill Gap Analysis](/skill-gap) to see exactly where you stand.`,
  },
  {
    patterns: ['roadmap', 'path', 'pathway', 'progression', 'what to do next'],
    response: `Great question! Our **Career Roadmap** at [/roadmap](/roadmap) shows you the exact skills, certifications, and milestones for each stage of your career — personalised to your profile.\n\nCombine it with our [Skill Gap Analysis](/skill-gap) to see exactly which skills you need to develop.\n\nIf you want a human expert to walk you through it, book a [Career Consultation](/contact).`,
  },
  {
    patterns: ['skill', 'gap', 'missing', 'need to learn', 'weak'],
    response: `Check your personalised **Skill Gap Analysis** at [/skill-gap](/skill-gap) — it shows a radar chart of your skills vs. role requirements, a readiness score, and prioritised gaps to close.\n\nIf you haven't set up your profile yet, [complete it here](/profile) to get accurate results.`,
  },
  {
    patterns: ['contact', 'reach', 'email', 'talk', 'speak', 'call', 'book'],
    response: `**Get in touch with LumaShift:**\n\nEmail: lumashift@outlook.com\nResponse time: Within 24 hours\nSessions via Google Meet or Zoom\n\n[Send us a message](/contact)`,
  },
  {
    patterns: ['fresh grad', 'student', 'entry level', 'beginner', 'start', 'no experience'],
    response: `**For fresh grads:**\n\n1. **Resume** — Get it ATS-optimised (Resume Review, RM 150)\n2. **LinkedIn** — 70% of interviews come from recruiter searches\n3. **Certs** — CompTIA Security+ or ISC2 CC as a starter\n4. **Direction** — Our [Career Quiz](/quiz) helps you pick the right path\n\nOur **Starter Launch Package (RM 320)** is the ideal first step.\n\n[View your Career Roadmap](/roadmap) for a step-by-step plan.`,
  },
  {
    patterns: ['career change', 'switch', 'transition', 'different field', 'non-it'],
    response: `**Career switching into cybersecurity:**\n\n- Finance/accounting → GRC, risk management\n- Engineering → OT/ICS security, cloud security\n- Legal/compliance → GRC, DPO, privacy\n- IT support → SOC analyst, security analyst\n\nDon't start from scratch — leverage what you have. A **Career Consultation (RM 80–150)** is the best first step.\n\n[Book a Consultation](/contact?service=career-consultation-30)`,
  },
];

function getRuleBasedResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of FALLBACK_RULES) {
    if (rule.patterns.some((p) => lower.includes(p))) {
      return rule.response;
    }
  }
  return `I can help you with:\n\n- **Which service fits you** — or take our [Career Quiz](/quiz)\n- **Career paths** — SOC, GRC, Cloud, OT/ICS\n- **Certification guidance** — personalised to your level\n- **Salary benchmarks** — Malaysia + global\n- **Your roadmap** — [Career Roadmap](/roadmap) | [Skill Gap Analysis](/skill-gap)\n\nFor personalised advice, [complete your profile](/profile) and I'll tailor my guidance to your situation.\n\nFor detailed questions, email us at **lumashift@outlook.com**.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content ?? '';

    const apiKey = process.env.GROQ_API_KEY;

    // Fetch user profile for context-aware responses
    let userContext = '';
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const [profileRes, quizRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('quiz_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        ]);
        userContext = buildUserContext(profileRes.data, quizRes.data?.[0] ?? null);
      } else {
        userContext = buildUserContext(null, null);
      }
    } catch {
      // If profile fetch fails, continue without user context
      userContext = '';
    }

    if (apiKey) {
      const Groq = (await import('groq-sdk')).default;
      const client = new Groq({ apiKey });

      const stream = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        stream: true,
        messages: [
          { role: 'system', content: LUMASHIFT_CONTEXT + '\n\n' + ADVISOR_INSTRUCTIONS + userContext },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new NextResponse(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Rule-based fallback
    const response = getRuleBasedResponse(lastMessage);
    return NextResponse.json({ response });
  } catch (err) {
    console.error('[Chat API]', err);
    return NextResponse.json(
      { response: 'Sorry, something went wrong. Please email lumashift@outlook.com directly.' },
      { status: 500 },
    );
  }
}
