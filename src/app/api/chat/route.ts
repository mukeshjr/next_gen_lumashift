import { NextRequest, NextResponse } from 'next/server';

const LUMASHIFT_CONTEXT = `You are LumaShift's career coaching assistant. LumaShift is a Malaysian cybersecurity career coaching platform founded by Mukesh Vijaian and Lavanyah Prabu.

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
- Mukesh Vijaian — Co-Founder & Lead Career Coach. Expertise: SOC, Cloud Security, Threat Intelligence. LinkedIn: linkedin.com/in/mukeshvijaian/
- Lavanyah Prabu — Co-Founder & Career Strategy Coach. Expertise: GRC, Risk, Compliance, Soft Skills. LinkedIn: linkedin.com/in/lavanyahprabu/

CAREER PATHS COVERED:
Security Analyst, Security Engineer, GRC Analyst, Cloud Security Engineer, SOC Analyst, OT/ICS Security Specialist

CONTACT: lumashift@outlook.com — responds within 24 hours. Sessions via Google Meet/Zoom.

BLOG TOPICS: AI security threats, cloud security careers, zero trust architecture, GRC careers in Malaysia, cybersecurity awareness, Malaysian job market.

FREE RESOURCES: Cybersecurity resume template, top 50 interview questions guide, certification roadmap 2025, LinkedIn optimisation checklist.

YOUR ROLE:
- Help users understand which LumaShift services match their situation
- Provide honest, practical cybersecurity career advice
- Answer questions about certifications, salaries, career paths
- Recommend the Career Quiz at /quiz for personalised guidance
- For complex or sensitive decisions, encourage users to contact us at lumashift@outlook.com
- Keep responses concise, warm, direct, and practical
- If unsure about specific details, direct users to contact LumaShift directly
- Do NOT make up salary figures beyond what is stated above`;

// Rule-based fallback responses when no Anthropic API key
const FALLBACK_RULES: { patterns: string[]; response: string }[] = [
  {
    patterns: ['resume', 'cv', 'curriculum'],
    response: `**Resume help** is one of our most popular services! Here's what we offer:\n\n- **Resume Review (From RM 150)** — ATS-optimised, with keyword strategy and rewrite suggestions within 3 business days\n- **Starter Launch Package (From RM 320)** — Resume + LinkedIn + 30-min consult bundle\n\nFor a cybersecurity resume, the most important things are: quantified achievements, ATS keywords per role, and clearly articulated technical projects.\n\n👉 Want to get started? [Contact us](/contact?service=resume-review) or [take our quiz](/quiz) to find the right package.`,
  },
  {
    patterns: ['linkedin', 'profile', 'recruiter'],
    response: `**LinkedIn optimisation** is crucial for cybersecurity job hunting. Our **LinkedIn Profile Optimisation service (From RM 120)** covers:\n\n- Keyword-rich headline that ranks in recruiter searches\n- Compelling About section that tells your story\n- Skills section aligned with target roles\n- Moving your profile strength to "All-Star"\n\nMost clients see 3x more recruiter messages within 30 days.\n\n👉 [Enquire about LinkedIn Optimisation](/contact?service=linkedin-optimisation)`,
  },
  {
    patterns: ['interview', 'mock', 'prepare', 'preparation'],
    response: `**Interview preparation** is where we see the biggest impact. We offer:\n\n- **Technical Mock Interview (From RM 200)** — Role-specific questions, realistic pressure, detailed written feedback\n- **Behavioural Mock Interview (From RM 180)** — STAR method, salary negotiation scripts, HR question handling\n\nMost clients need 2-3 sessions to feel truly confident. Our **Job-Ready Package (From RM 650)** includes both types plus resume + LinkedIn.\n\n👉 [Book a Mock Interview](/contact?service=mock-interview-technical)`,
  },
  {
    patterns: ['grc', 'governance', 'risk', 'compliance', 'audit', 'iso 27001', 'pdpa'],
    response: `**GRC (Governance, Risk & Compliance)** is one of the fastest-growing areas in Malaysian cybersecurity, especially in banking and finance.\n\nOur **GRC Coaching Track (From RM 1,200)** covers:\n- ISO 27001, NIST CSF, PDPA/DPDPA frameworks\n- GRC portfolio with sample risk registers and policies\n- Interview prep for analyst and manager roles\n- Certification guidance (CISA, CRISC, ISO Lead Auditor)\n\nCoached by **Lavanyah Prabu**, who has hands-on GRC experience.\n\n👉 [Explore GRC Track](/services#grc-coaching-track) | [Contact Us](/contact)`,
  },
  {
    patterns: ['soc', 'blue team', 'incident response', 'siem', 'splunk', 'threat hunt'],
    response: `**SOC/Blue Team** roles are the most common entry point into cybersecurity. Our **SOC/Blue Team Track (From RM 1,200)** covers:\n\n- Alert triage methodology and SIEM queries (Splunk/Sentinel/QRadar)\n- Incident response playbook walkthroughs\n- MITRE ATT&CK framework applied to real scenarios\n- Interview prep for Tier 1-3 SOC roles\n- Certification path: Security+ → CySA+ → GCIH\n\n👉 [Explore SOC Track](/services#soc-blue-team-track)`,
  },
  {
    patterns: ['cloud', 'aws', 'azure', 'gcp', 'cloud security'],
    response: `**Cloud Security** is the highest-paying cybersecurity specialisation right now. Our **Cloud Security Track (From RM 1,200)** covers:\n\n- Cloud-native security architecture (AWS, Azure, GCP)\n- IAM, CSPM, network security deep-dives\n- Interview preparation for cloud security engineer roles\n- Certification path: AWS SAA → AWS Security Specialty / AZ-500\n\nIn Malaysia, senior cloud security engineers earn RM 12,000–18,000/month.\n\n👉 [Explore Cloud Security Track](/services#cloud-security-track)`,
  },
  {
    patterns: ['salary', 'pay', 'wage', 'earn', 'compensation', 'rm', 'ringgit'],
    response: `**Malaysian Cybersecurity Salary Benchmarks (2025):**\n\n| Role | Entry | Mid | Senior |\n|------|-------|-----|--------|\n| SOC Analyst | RM 3,500–5,000 | RM 5,000–8,000 | RM 8,000–12,000 |\n| Security Analyst | RM 4,000–6,000 | RM 6,000–10,000 | RM 10,000–15,000 |\n| GRC Analyst | RM 4,500–6,500 | RM 6,500–11,000 | RM 11,000–16,000 |\n| Cloud Security Eng. | RM 7,000–10,000 | RM 10,000–16,000 | RM 16,000–22,000 |\n\nMNCs typically pay 20–40% above local market. Our **Career Consultation** includes salary benchmarking for your target role.\n\n👉 [Book a Consultation](/contact?service=career-consultation-60)`,
  },
  {
    patterns: ['certification', 'cert', 'comptia', 'cissp', 'ceh', 'oscp', 'study'],
    response: `**Best cybersecurity certifications by experience level:**\n\n**Entry Level (0-2 years):**\n- CompTIA Security+ — industry standard, widely recognised\n- ISC2 CC (Certified in Cybersecurity) — free to sit, great starter\n- Google Cybersecurity Certificate — good for career switchers\n\n**Mid Level (2-5 years):**\n- CySA+ (Blue Team) / PNPT (Pentest) / CISA (GRC)\n- AWS Security Specialty / AZ-500 (Cloud Security)\n\n**Senior:**\n- CISSP, CISM, CCSP — leadership and architecture roles\n\nOur coaching includes a personalised certification roadmap. 👉 [Download our free cert roadmap](/resources) or [get a consultation](/contact).`,
  },
  {
    patterns: ['price', 'cost', 'how much', 'fee', 'package', 'affordable'],
    response: `**LumaShift Service Pricing:**\n\n| Service | Starting Price |\n|---------|---------------|\n| Resume Review | RM 150 |\n| LinkedIn Optimisation | RM 120 |\n| Career Consultation (30 min) | RM 80 |\n| Career Consultation (60 min) | RM 150 |\n| Mock Interview | RM 180–200 |\n| Starter Launch Package | RM 320 |\n| **Job-Ready Package** ⭐ | **RM 650** |\n| Career Accelerator (4 weeks) | RM 1,800 |\n| Specialist Tracks (GRC/SOC/Cloud) | RM 1,200 |\n\nThe **Job-Ready Package** is our most popular — it bundles resume, LinkedIn, consultation, and 2 mock interviews.\n\n👉 [View all services](/services) | [Contact us](/contact)`,
  },
  {
    patterns: ['quiz', 'test', 'assess', 'which service', 'right for me', 'recommend'],
    response: `Not sure which service is right for you? Take our **3-minute Career Quiz** at [/quiz](/quiz) — it gives you:\n\n- A personalised confidence score (0–5)\n- Ranked service recommendations based on your answers\n- Role matches for your background\n- A suggested journey pathway\n\nNo email required to see results. 👉 [Take the Quiz](/quiz)`,
  },
  {
    patterns: ['contact', 'reach', 'email', 'talk', 'speak', 'call', 'book'],
    response: `**Get in touch with LumaShift:**\n\n📧 **Email:** [lumashift@outlook.com](mailto:lumashift@outlook.com)\n⏱ **Response time:** Within 24 hours on business days\n📍 **Sessions via:** Google Meet or Zoom\n🌍 **Coverage:** Malaysia + Global\n\nWe don't do high-pressure sales. You'll get an honest assessment of your situation and a clear recommendation.\n\n👉 [Send us a message](/contact)`,
  },
  {
    patterns: ['team', 'mukesh', 'lavanyah', 'founder', 'coach', 'who'],
    response: `**The LumaShift Team:**\n\n**Mukesh Vijaian** — Co-Founder & Lead Career Coach\nExpertise: SOC, Cloud Security, Threat Intelligence, Technical Interview Coaching\n🔗 [LinkedIn](https://www.linkedin.com/in/mukeshvijaian/)\n\n**Lavanyah Prabu** — Co-Founder & Career Strategy Coach\nExpertise: GRC, Risk Management, Soft Skills, Career Transitions\n🔗 [LinkedIn](https://www.linkedin.com/in/lavanyahprabu/)\n\nWhen you work with LumaShift, you work directly with the co-founders — no junior consultants.\n\n👉 [Meet the team](/team)`,
  },
  {
    patterns: ['fresh grad', 'student', 'entry level', 'beginner', 'start', 'no experience', 'zero experience'],
    response: `**For fresh grads and students, here's the honest path:**\n\n1. **Get your resume right first** — most entry-level resumes are badly structured for ATS systems. Start with a Resume Review.\n\n2. **LinkedIn matters more than you think** — 70% of our client's interviews come from recruiters finding them on LinkedIn, not from job applications.\n\n3. **Certs help, but aren't everything** — CompTIA Security+ or ISC2 CC are good for entry-level. Don't cert-chase without a plan.\n\n4. **Our Starter Launch Package (RM 320)** bundles resume + LinkedIn + career direction consultation — ideal starting point.\n\n👉 [Explore the Starter Package](/services#starter-launch-package) | [Take the Quiz](/quiz)`,
  },
  {
    patterns: ['career change', 'switch', 'transition', 'different field', 'non-it', 'not technical'],
    response: `**Career switching into cybersecurity is very doable — but it needs strategy.**\n\nThe key is positioning your existing experience correctly:\n- Finance/accounting background → GRC, risk management roles\n- Engineering background → OT/ICS security, or cloud security\n- Legal/compliance background → GRC, DPO, privacy roles\n- IT support/helpdesk → SOC analyst, security analyst\n\nDon't start from scratch — leverage what you already have.\n\nOur coaches have helped many career changers navigate this. A **Career Consultation (RM 80–150)** is usually the best first step.\n\n👉 [Book a Consultation](/contact?service=career-consultation-30)`,
  },
];

function getRuleBasedResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of FALLBACK_RULES) {
    if (rule.patterns.some((p) => lower.includes(p))) {
      return rule.response;
    }
  }
  return `Thanks for reaching out! I'm LumaShift's career assistant.\n\nI can help you with:\n- 🎯 **Which service is right for you**\n- 💼 **Career paths in cybersecurity** (SOC, GRC, Cloud, OT/ICS)\n- 📜 **Certification guidance**\n- 💰 **Malaysian salary benchmarks**\n- 📄 **Resume and LinkedIn tips**\n- 👥 **About our team and services**\n\nOr take our **[3-minute Career Quiz](/quiz)** for a personalised recommendation.\n\nFor complex questions, email us directly at **lumashift@outlook.com** — we respond within 24 hours.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content ?? '';

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // ── WITH ANTHROPIC API ────────────────────────────────────────────────────
    if (apiKey) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey });

      const stream = await client.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: LUMASHIFT_CONTEXT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        },
      });

      return new NextResponse(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // ── RULE-BASED FALLBACK ───────────────────────────────────────────────────
    const response = getRuleBasedResponse(lastMessage);
    return NextResponse.json({ response });
  } catch (err) {
    console.error('[Chat API]', err);
    return NextResponse.json(
      { response: 'Sorry, something went wrong. Please email lumashift@outlook.com directly.' },
      { status: 500 }
    );
  }
}
