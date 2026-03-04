import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-security-threats-2025',
    title: 'AI Is Changing the Threat Landscape — Here\'s What Cybersecurity Professionals Need to Know',
    excerpt:
      'Generative AI isn\'t just a productivity tool — attackers are using it too. Here\'s a practical breakdown of AI-driven threats and what you should be learning right now.',
    category: 'AI Security',
    tags: ['AI', 'Threat Intelligence', 'Career Tips', 'Emerging Tech'],
    author: 'Mukesh Vijaiyan',
    date: '2025-02-15',
    readTime: '6 min read',
    published: true,
    content: `
## The AI threat landscape is shifting faster than most teams can track

Let's cut to it: AI hasn't just changed how defenders work — it's changed how attackers work too. If you're in cybersecurity and not thinking about this, you're already behind.

Here's what's actually happening on the ground.

## Key Takeaways

- **AI-generated phishing is undetectable by old rules** — grammar errors, awkward phrasing, suspicious domains — the traditional tells are gone. Attackers now generate highly personalised spear-phishing at scale.
- **Deepfake audio and video are operational** — vishing attacks using cloned CEO voices have already resulted in multi-million dollar wire fraud cases.
- **LLMs are being used to write malware** — the barrier to entry for attackers has dropped significantly. You don't need to code to create a decent piece of malware anymore.
- **AI-powered vulnerability discovery** — researchers (and attackers) are using LLMs to find logic flaws and misconfigurations faster than human analysts.

## What You Should Actually Do

**1. Upskill in AI-aware detection**
Learn to write detection rules that catch AI-enabled attacks — not just known signatures. Think behavioural analytics, anomaly detection, and ML-based SIEM rules.

**2. Understand prompt injection**
If your organisation is deploying AI tools internally, you need to understand prompt injection attacks. This is the SQL injection of the AI era.

**3. Get comfortable with LLM-assisted security work**
Use AI tools yourself — for log analysis, threat intelligence summarisation, report writing. This isn't cheating; it's levelling up.

**4. Focus on the human layer**
AI attacks often target humans first. Security awareness training needs a complete overhaul for the AI era. If you can build and deliver this, you're invaluable.

## Bottom Line

AI is neither your enemy nor your saviour — it's a force multiplier. The professionals who understand both sides of that equation will dominate the next decade of cybersecurity.

---

*Navigating where to focus your cybersecurity career in the AI era? That's exactly what we help with at LumaShift.*

**[Work with us →](/contact)**
    `,
  },
  {
    slug: 'cloud-security-career-guide',
    title: 'Cloud Security Is the Hottest Cybersecurity Career Right Now — Here\'s Your Entry Point',
    excerpt:
      'Cloud security roles pay significantly more than traditional security roles and have massive talent shortages. Here\'s a realistic path to get in, even without pure cloud experience.',
    category: 'Career Guide',
    tags: ['Cloud Security', 'AWS', 'Azure', 'Career Path', 'Certifications'],
    author: 'Mukesh Vijaiyan',
    date: '2025-01-28',
    readTime: '8 min read',
    published: true,
    content: `
## The opportunity is real — and it won't last forever

Cloud security engineers are among the highest-paid cybersecurity professionals globally. In Malaysia, senior cloud security engineers at MNCs and tech companies regularly command RM 12,000–18,000/month. Globally, USD 150K+ total compensation packages are not unusual.

The supply-demand gap is significant. Most organisations have moved workloads to cloud but haven't built the security expertise to match.

Here's how to get in.

## Key Takeaways

- **You don't need to start from scratch** — if you have any IT, cloud, or networking background, you're closer than you think.
- **AWS dominates enterprise** — learn AWS Security first; it's where most of the job postings are.
- **CSPM knowledge is the differentiator** — most candidates know IAM basics; Cloud Security Posture Management (CSPM) is where the real value is.
- **"Security engineer" is the goal, not just "cloud practitioner"** — aim for the right job title from the start.

## Realistic 6-Month Entry Plan

**Month 1–2: Foundations**
- AWS Solutions Architect Associate (SAA-C03) — learn the platform first
- Understand VPC, IAM, S3, EC2, CloudTrail fundamentals

**Month 3–4: Security Layer**
- AWS Security Specialty preparation begins
- Learn: GuardDuty, Security Hub, AWS Config, Macie, KMS
- Start with a free-tier AWS account — build and break things

**Month 5–6: Job-Ready**
- Build 2–3 security projects (e.g., automated compliance checker, CSPM dashboard)
- Get your resume positioned for cloud security roles
- Start applying while studying — the market needs you

## The Certifications That Actually Matter

1. **AWS Security Specialty** — the gold standard for AWS cloud security
2. **Microsoft AZ-500** — essential if targeting Azure-heavy organisations (common in Malaysia's banking sector)
3. **CCSP (ISC2)** — vendor-neutral, valued by compliance-heavy industries
4. **Wiz or Palo Alto PCNSE** — platform certifications that differentiate you

## Common Mistakes to Avoid

- Spending months on theory before touching actual cloud environments
- Getting only the Cloud Practitioner cert — it's not enough for security roles
- Ignoring Terraform and IaC — cloud security at scale requires infrastructure automation
- Not positioning your existing experience correctly on your resume

---

*Want a personalised cloud security career roadmap built for your specific background? That's what our Cloud Security Track is for.*

**[Explore Cloud Security Track →](/services)**
    `,
  },
  {
    slug: 'zero-trust-explained-simply',
    title: 'Zero Trust: What It Actually Means and Why Every Cybersecurity Professional Needs to Understand It',
    excerpt:
      'Zero trust is everywhere — job postings, vendor pitches, executive presentations. Here\'s what it actually means in practice, stripped of the marketing noise.',
    category: 'Technical Concepts',
    tags: ['Zero Trust', 'Architecture', 'Career Skills', 'Networking'],
    author: 'Lavanyah Prabu',
    date: '2025-01-10',
    readTime: '5 min read',
    published: true,
    content: `
## "Zero Trust" is not a product. It's an approach.

Walk into any cybersecurity interview in 2025 and you'll hear "zero trust" within the first five minutes. Vendors use it to sell firewalls. Executives use it in strategy decks. Most people can't explain what it actually means.

Let's fix that.

## Key Takeaways

- **Zero Trust = "Never trust, always verify"** — no user, device, or network segment is trusted by default, even inside the perimeter.
- **It's not new** — John Kindervag coined the term at Forrester in 2010. What's new is that cloud adoption makes it mandatory.
- **The old model is broken** — perimeter-based security assumed everything inside the firewall was safe. Cloud, remote work, and BYOD destroyed that assumption.
- **Identity is the new perimeter** — under zero trust, identity verification and least-privilege access are the core controls.

## The 5 Pillars of Zero Trust (CISA Model)

1. **Identity** — every user and service account must be verified continuously
2. **Devices** — only compliant, managed devices get access to sensitive resources
3. **Networks** — assume breach; segment and encrypt everything
4. **Applications** — apply least-privilege at the application layer, not just the network
5. **Data** — classify data and apply access controls based on sensitivity

## How This Applies to Your Role

**If you're in SOC:** Zero trust means more granular telemetry. IAM events, device compliance status, and lateral movement detection become central to your work.

**If you're in GRC:** Zero trust frameworks map directly to ISO 27001 controls. Understanding the NIST Zero Trust Architecture SP 800-207 is valuable for audits.

**If you're a cloud security engineer:** Implementing zero trust IS your job — think AWS IAM, Azure Conditional Access, BeyondCorp-style access proxies.

**In interviews:** When asked about zero trust, don't just define it. Describe a specific implementation you'd design for a given scenario. That's what separates average candidates from strong ones.

---

*Want to learn how to discuss technical concepts like zero trust confidently in interviews? Our mock interview sessions are built for exactly this.*

**[Book a Mock Interview →](/services)**
    `,
  },
  {
    slug: 'grc-career-malaysia',
    title: 'GRC Is Underrated and Underpaid — But It\'s Changing. Here\'s Why You Should Consider It.',
    excerpt:
      'Governance, Risk & Compliance used to be seen as the "boring" side of cybersecurity. Rising regulatory pressure and board-level risk visibility have changed everything.',
    category: 'Career Guide',
    tags: ['GRC', 'Compliance', 'Malaysia', 'Career Path', 'Risk Management'],
    author: 'Lavanyah Prabu',
    date: '2024-12-18',
    readTime: '7 min read',
    published: true,
    content: `
## GRC was boring. Now it's strategic.

A few years ago, GRC professionals were stuck writing policies nobody read and running audits nobody cared about. That era is ending.

DPDPA (Malaysia's updated personal data law), BNM's RMiT requirements, SEC cybersecurity disclosure rules, and the EU's NIS2 and DORA have made compliance a board-level issue. Organisations are hiring and paying accordingly.

## Key Takeaways

- **Regulatory complexity is driving demand** — Malaysia's DPDPA, BNM RMiT, and upcoming sector-specific frameworks mean GRC professionals are no longer optional.
- **GRC managers are being pulled into the C-suite** — Chief Risk Officers, VPs of Compliance, and Heads of GRC are regularly paid above equivalent technical managers.
- **The skills are transferable** — GRC expertise crosses industries (banking, healthcare, tech, energy) in a way that pure technical skills don't always.
- **AI + GRC = new opportunities** — AI governance, responsible AI frameworks, and AI risk management are creating entirely new GRC subspecialties.

## What GRC Actually Looks Like Day-to-Day

**In a bank or financial institution:**
- Managing ISO 27001 and BNM RMiT compliance programmes
- Running vendor risk assessments for third parties
- Drafting and maintaining information security policies
- Presenting risk reports to the board risk committee

**In a tech company:**
- SOC 2 Type II audit coordination
- Privacy impact assessments for new products
- Security review of new vendor onboarding

**In a consultancy:**
- Gap assessments for clients against various frameworks
- Policy writing and framework implementation
- Training and awareness programmes

## The Honest Challenges

- GRC roles can feel slow-moving compared to SOC or engineering roles
- The impact of your work isn't always immediately visible
- You need strong written communication — this is non-negotiable
- Business acumen matters more here than in pure technical roles

## Getting In

If you have a background in auditing, compliance, legal, finance, or IT operations, you're closer to GRC than you think. The technical knowledge can be learned; the business communication and analytical thinking are harder to teach.

---

*Our GRC Coaching Track is designed specifically for those entering or advancing in GRC roles in Malaysia and the region.*

**[Explore GRC Track →](/services)**
    `,
  },
  {
    slug: 'cybersecurity-awareness-starts-with-culture',
    title: 'Security Awareness Training Is Broken. Here\'s What Actually Works.',
    excerpt:
      'Most organisations run annual security awareness training that nobody remembers by March. The research on what actually changes human behaviour tells a different story.',
    category: 'Security Awareness',
    tags: ['Security Awareness', 'Culture', 'Human Risk', 'Leadership'],
    author: 'Lavanyah Prabu',
    date: '2024-11-30',
    readTime: '6 min read',
    published: true,
    content: `
## The $3 billion security awareness industry is largely failing

Here's the uncomfortable truth: annual mandatory security awareness training, followed by a phishing simulation, has a marginal impact on organisational security. The research consistently shows this.

Yet organisations continue to buy the same LMS modules every year, report completion rates to the board, and call it done.

## Why Traditional Training Fails

**It's divorced from context.** A generic video about password security watched in January is forgotten by March. People don't connect it to their actual work.

**It focuses on compliance, not behaviour.** Checking a box is not the same as changing how someone evaluates a suspicious email at 4:30 PM on a Friday.

**It treats humans as the problem, not as the solution.** When the training message is "humans are the weakest link," you've already lost the culture war.

## Key Takeaways

- **Psychological safety matters** — employees who fear punishment for mistakes hide them instead of reporting them. Reporting culture is everything.
- **Just-in-time training is more effective** — a teachable moment right after someone almost clicks a phishing link beats a 30-minute video taken months earlier.
- **Champions networks work** — security-aware employees embedded in every team drive more behaviour change than any centralised training programme.
- **Metrics should measure behaviour, not completion** — track phishing simulation click rates over time, incident report rates, policy compliance rates. Not who finished the video.

## What Actually Works

1. **Short, frequent touchpoints** — monthly 5-minute comms beat quarterly 60-minute modules
2. **Role-relevant content** — finance team gets wire fraud training; HR team gets recruitment phishing training
3. **Leadership modelling** — if the CISO doesn't practice what they preach, nobody will
4. **Positive reinforcement** — celebrate people who report phishing, not just those who don't click
5. **Measuring leading indicators** — near-miss reports, phishing report rates, and help desk security-related queries tell you more than completion rates

---

*If you're a cybersecurity professional looking to build or lead security awareness programmes — or advise clients on them — this is a high-value skill set. Let's talk.*

**[Contact Us →](/contact)**
    `,
  },
  {
    slug: 'malaysia-cybersecurity-jobs-2025',
    title: 'The State of Cybersecurity Jobs in Malaysia: 2025 Reality Check',
    excerpt:
      'What roles are actually hiring, what they\'re paying, and what skills Malaysian employers are actually asking for — based on what we see in the market.',
    category: 'Malaysia Market',
    tags: ['Malaysia', 'Jobs', 'Salary', 'Market Trends', 'Career Planning'],
    author: 'Mukesh Vijaiyan',
    date: '2025-02-01',
    readTime: '9 min read',
    published: true,
    content: `
## The market is real, but it's not equal

Malaysia's cybersecurity sector has been on an upward trajectory for years — CyberSecurity Malaysia, BNM's regulatory push, and the influx of global tech companies have all driven demand.

But here's what the job boards don't tell you: the market is bifurcated. There are lots of entry-level openings with modest pay, and there's a scarcity of experienced practitioners commanding premium salaries. The middle is thin.

## What's Actually Hiring

**High volume of openings:**
- SOC Analyst (Tier 1–2)
- Security Analyst (GRC and Operations)
- Vulnerability Assessment and Penetration Tester (VAPT)

**Scarcest and highest-paid:**
- Cloud Security Engineer
- Detection Engineer / Threat Hunter
- OT/ICS Security Specialist
- Security Architect

**Growing fast:**
- AI/ML security roles
- Privacy and data protection officer (DPO) roles
- Application security (AppSec) engineers

## Salary Reality Check (2025, Malaysia)

| Role | Entry | Mid | Senior |
|------|-------|-----|--------|
| SOC Analyst | RM 3,500–5,000 | RM 5,000–8,000 | RM 8,000–12,000 |
| Security Analyst | RM 4,000–6,000 | RM 6,000–10,000 | RM 10,000–15,000 |
| GRC Analyst | RM 4,500–6,500 | RM 6,500–11,000 | RM 11,000–16,000 |
| Cloud Security Eng. | RM 7,000–10,000 | RM 10,000–16,000 | RM 16,000–22,000 |
| Security Architect | — | RM 12,000–18,000 | RM 18,000–28,000+ |

*Note: MNCs and global tech companies typically pay 20–40% above local market rates.*

## The Honest Gaps We See

**What candidates lack:**
- Practical hands-on experience (not just certs)
- Ability to communicate technical concepts to non-technical stakeholders
- Understanding of business context and risk, not just technical controls
- Cloud security skills (huge demand, very limited supply)

**What hiring managers actually want:**
- Candidates who can hit the ground running (less hand-holding)
- People who ask good questions, not just give rehearsed answers
- Communication skills — especially for GRC and senior roles

## What This Means for Your Career

If you're early career: Focus on certifications that demonstrate practical skill (Security+, CySA+, BTL1), build a home lab, and apply broadly. Don't wait until you feel "ready."

If you're mid-career: The jump from RM 6K to RM 12K requires differentiation — cloud skills, specialist knowledge, or a senior track record. A generic "security analyst" profile at year 5 is a red flag.

---

*Want a brutally honest assessment of where you stand in the Malaysian market and what to do next? That's exactly what our career consultations are for.*

**[Book a Consultation →](/contact)**
    `,
  },
];

export const getPublishedPosts = () => blogPosts.filter((p) => p.published);
export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
export const getPostsByCategory = (category: string) =>
  blogPosts.filter((p) => p.category === category && p.published);
export const getAllCategories = () => [
  ...new Set(blogPosts.filter((p) => p.published).map((p) => p.category)),
];
export const getAllTags = () => [
  ...new Set(blogPosts.filter((p) => p.published).flatMap((p) => p.tags)),
];
