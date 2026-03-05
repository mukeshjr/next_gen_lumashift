import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-security-threats-2025',
    title: 'AI Is Changing the Threat Landscape — Here\'s What Cybersecurity Professionals Need to Know',
    excerpt:
      'Generative AI isn\'t just a productivity tool — attackers are using it too. Here\'s a practical breakdown of AI-driven threats and what you should be learning right now.',
    category: 'AI Security',
    tags: ['AI', 'Threat Intelligence', 'Career Tips', 'Emerging Tech'],
    author: 'Mukesh Vijaian',
    date: '2025-02-15',
    readTime: '6 min read',
    published: true,
    visualType: 'threat-landscape',
    keyTakeaways: [
      'AI-generated phishing bypasses traditional detection — grammar errors and suspicious tells are gone',
      'Deepfake audio and video vishing attacks have already caused multi-million dollar fraud cases',
      'LLMs lower the barrier for attackers — no coding skills needed to create functional malware',
      'AI-powered vulnerability discovery is accelerating both offensive and defensive timelines',
      'Professionals who master both sides of AI security will dominate the next decade',
    ],
    content: `
## The AI threat landscape is shifting faster than most teams can track

Let's cut to it: AI hasn't just changed how defenders work — it's changed how attackers work too. If you're in cybersecurity and not thinking about this, you're already behind.

Here's what's actually happening on the ground.

## What Attackers Are Actually Doing With AI

**AI-generated phishing at scale**

The old tells are gone. Typos, awkward phrasing, suspicious sender domains — these were the training wheels of phishing detection, and attackers have removed them. Modern AI-generated spear-phishing is personalised, grammatically perfect, and contextually relevant to the target.

Security awareness trainers who still teach "look for grammar errors" are teaching outdated material.

**Deepfake audio and video vishing**

This is no longer theoretical. Cloned CEO voice attacks have resulted in successful wire fraud cases. Video deepfakes are increasingly used in fake job interviews and executive verification calls. If your company relies on voice recognition for authentication, that's a risk worth evaluating.

**LLMs writing malware**

You don't need to code to create functional malware anymore. Publicly available LLMs, with the right prompting, can generate exploit code, obfuscated scripts, and reconnaissance tools. The technical barrier for low-sophistication attackers has dropped significantly.

**AI-powered vulnerability discovery**

Researchers and attackers alike are using LLMs to find logic flaws, analyse open-source code for vulnerabilities, and speed up reconnaissance. What used to take weeks of manual analysis is being compressed into hours.

## What You Should Actually Do

**1. Upskill in behavioural detection**

Move beyond signature-based thinking. Learn to write detection rules that catch anomalous behaviour patterns — lateral movement, unusual data access, identity anomalies. AI-generated attacks often evade known-bad signatures.

**2. Understand prompt injection**

If your organisation is deploying AI tools internally (Copilot, custom GPTs, AI assistants), you need to understand prompt injection attacks. This is the SQL injection of the AI era — attackers embed malicious instructions in content that your AI system processes.

**3. Use AI tools yourself**

AI-assisted log analysis, threat intelligence summarisation, incident report drafting — these aren't shortcuts, they're force multipliers. The analyst who uses AI effectively covers more ground than one who doesn't.

**4. Rebuild security awareness training**

The "recognise phishing by its grammar" era is over. Modern training needs to focus on verification processes, reporting culture, and decision-making under pressure — not spotting obvious tells.

## The Career Opportunity

Here's the flip side: every new attack technique creates demand for defenders who understand it. AI security is an emerging specialisation with almost no experienced practitioners yet. Getting there early pays off.

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
    author: 'Mukesh Vijaian',
    date: '2025-01-28',
    readTime: '8 min read',
    published: true,
    visualType: 'career-path',
    keyTakeaways: [
      'Cloud security engineers earn RM 12,000–22,000/month in Malaysia — highest in the field',
      'Most organisations moved to cloud faster than they built security expertise, creating a gap you can fill',
      'AWS Security Specialty is the most valued cert for cloud security roles in Malaysia',
      'CSPM (Cloud Security Posture Management) knowledge is the differentiator most candidates lack',
      'A 6-month structured plan can take you from cloud basics to job-ready cloud security candidate',
    ],
    content: `
## The opportunity is real — and it won't last forever

Cloud security engineers are among the highest-paid cybersecurity professionals globally. In Malaysia, senior cloud security engineers at MNCs and tech companies regularly command RM 12,000–18,000/month. Globally, USD 150K+ total compensation packages are not unusual.

The supply-demand gap is significant. Most organisations have moved workloads to cloud but haven't built the security expertise to match. This mismatch creates real opportunity for professionals willing to develop cloud security expertise.

## Why Cloud Security Pays More

Think of it this way: cloud security sits at the intersection of cloud engineering and cybersecurity — two already-scarce skill sets. Professionals who can do both are genuinely rare, and organisations know it.

In traditional on-premises security, misconfiguration is a risk. In cloud, misconfiguration is the #1 breach cause. A single IAM policy mistake, one open S3 bucket, one unrestricted security group — these have caused some of the largest data breaches of the past five years.

## Your 6-Month Entry Plan

**Month 1–2: Cloud Foundations**

Start with AWS Solutions Architect Associate (SAA-C03). This is not a security certification — it's the platform foundation. You need to understand VPC networking, IAM basics, S3, EC2, and how services connect before you can secure them.

Create a free-tier AWS account. Build things. Break things. This hands-on time is non-negotiable.

**Month 3–4: Security Layer**

Now layer security on top of your platform knowledge:
- GuardDuty (threat detection)
- Security Hub (centralised findings)
- AWS Config (compliance and drift detection)
- Macie (data classification and S3 security)
- KMS (encryption key management)
- CloudTrail (audit logging)

Start your AWS Security Specialty preparation. This certification validates exactly the skills employers are hiring for.

**Month 5–6: Job-Ready Positioning**

Build 2–3 security projects you can talk about in interviews:
- Automated S3 bucket compliance checker using Lambda
- CSPM dashboard pulling Security Hub findings
- Least-privilege IAM audit tool

Get your resume positioned correctly. "Cloud security engineer" is the target title — not "cloud practitioner" or "security analyst who knows AWS."

## The Certifications That Matter

1. **AWS Security Specialty** — gold standard for AWS-focused cloud security roles
2. **Microsoft AZ-500** — essential for Azure-heavy environments (common in Malaysian banking)
3. **CCSP (ISC2)** — vendor-neutral, valued in compliance-driven industries
4. **HashiCorp Terraform Associate** — IaC knowledge is increasingly required; security at scale needs automation

## Common Mistakes to Avoid

Getting only the Cloud Practitioner certification. It signals entry-level cloud awareness, not security expertise. Hiring managers for security roles know the difference.

Spending months on theory before touching actual cloud environments. The practical skill gap between someone who's built things and someone who's only studied is obvious in interviews.

Ignoring Terraform and infrastructure-as-code. Cloud security at scale requires automation. If you can't review a Terraform module for security misconfigurations, you're missing a critical skill.

Not positioning existing experience correctly. If you've worked in networking, Linux administration, or software development, you're closer to cloud security than you think. Frame it correctly.

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
    visualType: 'concept-diagram',
    keyTakeaways: [
      '"Never trust, always verify" — no user or device is trusted by default, even inside the corporate network',
      'Zero trust is a strategy, not a product — vendors selling "zero trust firewalls" are using the term loosely',
      'Identity is the new perimeter — continuous verification and least-privilege access are the core controls',
      'CISA\'s five pillars (Identity, Devices, Networks, Applications, Data) give you a practical implementation framework',
      'Understanding zero trust architecture is expected knowledge for mid-to-senior cybersecurity roles in 2025',
    ],
    content: `
## "Zero Trust" is not a product. It's an approach.

Walk into any cybersecurity interview in 2025 and you'll hear "zero trust" within the first five minutes. Vendors use it to sell firewalls. Executives use it in strategy decks. Most people can't explain what it actually means.

Let's fix that — starting from first principles.

## The Old Model (And Why It Broke)

Traditional network security was built on a simple idea: put a strong wall around the castle, and trust everything inside.

The "castle" was your corporate network. The "wall" was a perimeter firewall. Once you were inside — connected to the office network, VPN'd in — you were implicitly trusted to access resources.

This worked when everyone worked in an office, data lived on-premises, and the perimeter was clear.

It stopped working when:
- Employees started working from home (and coffee shops, and hotels)
- Applications moved to the cloud (AWS, Microsoft 365, Salesforce)
- BYOD became standard in most organisations
- Attackers figured out that breaching the perimeter once gave them access to everything inside

The 2020 SolarWinds attack is a perfect example: once attackers were inside the perimeter, they moved laterally through the network almost unchallenged.

## What Zero Trust Actually Means

The core principle: **never trust, always verify.**

Under zero trust:
- No user is trusted just because they're on the corporate network
- No device is trusted just because it's managed by IT
- No application is assumed safe just because it's internal
- Every access request is evaluated based on identity, device health, context, and least-privilege rules

Think of it less like a castle with a wall, and more like a building with key card access on every door — including the internal ones.

## The 5 Pillars (CISA Model)

The US Cybersecurity and Infrastructure Security Agency (CISA) breaks zero trust into five pillars. This framework is widely used in job interviews and enterprise implementations.

**1. Identity**
Every user, service account, and API must be authenticated and authorised continuously — not just at login. Multi-factor authentication (MFA) is table stakes. Conditional access policies (e.g., "block access from untrusted locations") are the next layer.

**2. Devices**
Only devices that meet compliance standards (current OS patches, MDM enrolment, security agent running) should access sensitive resources. Unmanaged personal devices should have limited access, if any.

**3. Networks**
Segment the network aggressively. East-west traffic (within the network) should be as controlled as north-south traffic (in/out). Micro-segmentation limits blast radius when a breach occurs.

**4. Applications**
Apply least-privilege at the application layer. Users get access only to the specific applications and data their role requires — nothing more. Application proxies (like Cloudflare Access or Zscaler) can enforce this without VPN.

**5. Data**
Classify data by sensitivity and apply access controls accordingly. Knowing where your most sensitive data lives — and limiting who can touch it — is foundational to data protection.

## How This Applies to Your Role

**If you're in SOC:** Zero trust creates richer telemetry. IAM events, device compliance alerts, and anomalous access patterns become your detection signals. Learn to build detection logic around identity and access behaviour.

**If you're in GRC:** Zero trust architecture maps directly to ISO 27001 (access control, A.9) and NIST CSF. NIST SP 800-207 is the authoritative zero trust architecture framework — read it.

**If you're a cloud security engineer:** Implementing zero trust is your job. IAM policies, Azure Conditional Access, service mesh security, and BeyondCorp-style access proxies are your tools.

**In interviews:** When asked about zero trust, describe an actual implementation scenario. "I'd apply least-privilege IAM roles, enforce MFA with conditional access, and use micro-segmentation to limit lateral movement in the event of a breach" is a stronger answer than a definition.

---

*Want to learn how to discuss technical concepts like zero trust confidently in interviews? Our mock interview sessions are built for exactly this.*

**[Book a Mock Interview →](/services)**
    `,
  },
  {
    slug: 'grc-career-malaysia',
    title: 'GRC Is Underrated — But It\'s Changing. Here\'s Why You Should Consider It.',
    excerpt:
      'Governance, Risk & Compliance used to be seen as the "boring" side of cybersecurity. Rising regulatory pressure and board-level risk visibility have changed everything.',
    category: 'Career Guide',
    tags: ['GRC', 'Compliance', 'Malaysia', 'Career Path', 'Risk Management'],
    author: 'Lavanyah Prabu',
    date: '2024-12-18',
    readTime: '7 min read',
    published: true,
    visualType: 'career-path',
    keyTakeaways: [
      'Malaysia\'s DPDPA, BNM RMiT, and sector-specific frameworks are driving massive GRC hiring',
      'GRC skills transfer across industries — banking, healthcare, tech, energy all need the same expertise',
      'Strong written communication and business acumen matter more in GRC than technical depth',
      'AI governance is creating a new GRC subspecialty with almost no experienced practitioners yet',
      'Finance, legal, audit, and compliance backgrounds all translate naturally into GRC roles',
    ],
    content: `
## GRC was "box-ticking." Now it's strategic risk management.

A few years ago, GRC professionals were known for writing policies nobody read and running audits nobody cared about. Compliance was a cost centre, not a strategic function.

That era is ending — rapidly.

Malaysia's DPDPA amendment, BNM's Risk Management in Technology (RMiT) requirements, SEC cybersecurity disclosure rules, and the EU's NIS2 and DORA directives have made risk and compliance a board-level issue. Boards are now asking direct questions about cyber risk exposure. Organisations without credible GRC functions are failing audits, losing enterprise clients, and facing regulatory fines.

GRC professionals who can navigate this complexity are being pulled into strategic roles.

## What Changed, and Why

**Regulatory complexity increased dramatically.** A Malaysian financial institution now manages compliance across: BNM RMiT, BNM JIS (Joint IT Standards), PDPA/DPDPA, Bank Negara's CPS (Cyber Policy Standards), potentially MAS Technology Risk Management Guidelines if they operate in Singapore, and ISO 27001 if they pursue certification. Each has different requirements, timelines, and evidence standards.

**Boards got serious about cyber risk.** Post-pandemic breaches, ransomware waves, and regulatory enforcement actions made cybersecurity a board agenda item, not just an IT problem. GRC professionals who can translate technical risk into business language are now presenting to audit committees.

**Third-party risk became unmanageable at scale.** Supply chain attacks (SolarWinds, MOVEit) demonstrated that organisations' risk extends to every vendor, supplier, and cloud provider. Vendor risk management is a growing GRC subspecialty.

## What GRC Actually Looks Like Day-to-Day

The reality of GRC work varies significantly by sector:

**In a bank or financial institution (most common in Malaysia):**
Managing ISO 27001 and BNM RMiT compliance programmes takes the majority of your time. This involves maintaining evidence libraries, coordinating control assessments across IT teams, preparing for regulatory examinations, and running quarterly risk committee meetings. Vendor risk reviews for significant outsourcing arrangements are a constant.

**In a tech company:**
SOC 2 Type II audit coordination, PDPA privacy impact assessments for new product features, and security review of new vendor onboarding. The pace is faster and the scope is broader than in banking.

**In a consultancy:**
Client-facing work — gap assessments against frameworks, policy drafting, framework implementation support, awareness training. You see a wider variety of industries and maturity levels.

## The Skills That Actually Matter

GRC is the cybersecurity domain where soft skills matter as much as technical ones. This isn't a weakness — it's a differentiation.

You need: strong analytical writing, the ability to translate technical concepts for non-technical audiences, structured thinking for complex regulatory requirements, and attention to detail that a controls evidence file demands.

You don't need: penetration testing skills, advanced coding ability, or deep protocol-level networking knowledge (though a working understanding helps).

## The AI Governance Opportunity

AI governance is creating an entirely new GRC subspecialty. As organisations deploy AI systems, they need professionals who can assess AI risk, design AI governance frameworks, manage AI model inventories, and comply with emerging AI regulations (EU AI Act, Malaysia's proposed AI governance framework).

Almost no one has this experience yet. Getting in early is valuable.

## If You Have a Non-IT Background

Finance and accounting professionals: your risk assessment and audit skills map directly to GRC. You understand control testing, evidence standards, and how to present risk in business terms.

Legal and compliance professionals: regulatory interpretation, policy drafting, and compliance programme management are core GRC competencies. Your skills transfer.

IT operations and helpdesk professionals: you understand the operational technology environment. Building on that with GRC framework knowledge (ISO 27001, NIST) is a clear path into security GRC.

---

*Our GRC Coaching Track is designed specifically for those entering or advancing in GRC roles in Malaysia and the region. Coached by Lavanyah Prabu, who has hands-on GRC experience across financial services.*

**[Explore GRC Track →](/services)**
    `,
  },
  {
    slug: 'soc-analyst-day-in-the-life',
    title: 'A Day in the Life of a SOC Analyst — What the Job Is Really Like',
    excerpt:
      'SOC analyst is the most common entry point into cybersecurity. Here\'s an honest, hour-by-hour look at what the job actually involves, the good and the hard parts.',
    category: 'Career Guide',
    tags: ['SOC', 'Blue Team', 'Entry Level', 'Career Path', 'Security Operations'],
    author: 'Mukesh Vijaian',
    date: '2025-01-20',
    readTime: '7 min read',
    published: true,
    visualType: 'timeline',
    keyTakeaways: [
      'SOC Tier 1 is primarily alert triage — most alerts are false positives, pattern recognition develops fast',
      'SIEM tools (Splunk, Microsoft Sentinel, QRadar) are the core skill — hands-on lab experience is essential before interviews',
      'Shift work is common in 24/7 SOCs — factor this into your career planning and wellbeing',
      'The fastest way to progress from Tier 1 to Tier 2 is building threat hunting and investigation skills',
      'SOC experience is foundational — it opens paths to incident response, threat intelligence, and cloud security',
    ],
    content: `
## The honest picture of SOC work

SOC Analyst is the most common entry point into cybersecurity. Job boards are full of openings. Certifications point toward it. Career guides recommend it.

But most guides don't tell you what the job actually feels like day-to-day. Here's the unfiltered version — the rewarding parts, the hard parts, and what the best analysts do to grow fast.

## The Structure of a SOC

Most SOCs are organised in tiers:

**Tier 1 — Alert Triage**
This is where most new analysts start. Your job is to monitor the SIEM (Security Information and Event Management) dashboard, review alerts as they come in, and triage them: is this a real threat or a false positive? If real, escalate to Tier 2. If false positive, document why and close.

The volume can be overwhelming. A busy SOC might generate hundreds of alerts per shift. Most will be false positives — this is normal and expected. Your job is to develop the pattern recognition to tell them apart efficiently.

**Tier 2 — Investigation**
Tier 2 analysts take escalated alerts from Tier 1 and investigate them in depth. This involves pulling logs, tracing attack chains, identifying affected systems, and determining scope and severity. You're building the incident picture.

**Tier 3 — Threat Hunting and Response**
Tier 3 analysts proactively hunt for threats that bypassed automated detection. They build detection rules, develop threat hunting playbooks, and lead incident response for major events.

## An Honest Look at a Shift

**08:00 — Handover**
You arrive and get briefed by the outgoing shift. What happened overnight? Any ongoing incidents? Any alerts pending escalation? This handover is critical — context from the previous shift shapes your first decisions.

**08:30–11:00 — Alert Queue**
You work through the alert queue. Each alert requires: read the alert, pull related logs, determine if it's a genuine threat or a false positive, and document your decision.

A typical Tier 1 alert might look like: "Suspicious outbound connection to flagged IP from user workstation." You check: Is the IP known bad (threat intel lookup)? Is the connection pattern unusual for this user? Does it match any known malware behaviour? Is there related activity in nearby time window? 90% of the time, you'll close it as benign with documentation. 10% of the time, you'll escalate.

**11:00–12:00 — Incident Follow-up**
If yesterday's shift escalated an incident, you might be following up — checking if remediation was completed, whether the affected system is clean, whether the ticket can be closed.

**12:00–13:00 — Lunch. (This matters more than it sounds.)**
Alert fatigue is real. Taking a proper break is part of performing well in the afternoon.

**13:00–16:00 — Continued Alert Triage + Knowledge Building**
More triage. If it's a quieter afternoon, the best analysts use this time to read threat intelligence reports, review playbooks, or work through training labs.

**16:00–17:00 — Documentation and Handover Prep**
You document the shift — what you saw, what you closed, what's pending. A good handover note means the incoming shift can hit the ground running.

## The Hard Parts (That Nobody Talks About)

**Alert fatigue.** Reviewing hundreds of alerts per shift, most of which are false positives, is mentally taxing. The best analysts develop strong pattern recognition early and build playbooks that make common cases faster to process.

**Repetition.** Tier 1 work is repetitive. The same types of alerts come up again and again. This is both a feature (you get fast at recognising patterns) and a frustration (it can feel monotonous).

**Shift work.** 24/7 SOCs mean rotating shifts — including nights, weekends, and holidays. This is a real lifestyle consideration, especially for those with families or other commitments.

**The escalation/response gap.** You might triage an alert, escalate it as a genuine threat, and then never hear what happened next. Closing the loop is important for learning, but it doesn't always happen systematically.

## The Rewarding Parts

When you catch something real — a genuine intrusion attempt, a compromised account, a piece of malware that bypassed the endpoint agent — it's genuinely satisfying. You're the first line of defence.

SOC work builds pattern recognition and instincts that transfer everywhere in cybersecurity. The analysts who treat Tier 1 as a learning platform and not just a job develop intuition that's hard to get any other way.

## How to Progress Fast

The analysts who move from Tier 1 to Tier 2 fastest do these things:

- Build a personal threat hunting playbook based on real alerts they've seen
- Learn to write SIEM queries beyond what the default rules cover (custom Splunk SPL, KQL)
- Study MITRE ATT&CK and map it to alerts they're seeing daily
- Ask Tier 2 analysts to walk them through investigations
- Build a home lab to practice in — TryHackMe and HackTheBox blue team paths are excellent

---

*If you're heading toward a SOC role and want interview preparation and a structured certification plan, our SOC/Blue Team Coaching Track was built for you.*

**[Explore SOC Track →](/services)**
    `,
  },
  {
    slug: 'cybersecurity-certifications-2025-guide',
    title: 'Cybersecurity Certifications in 2025: Which Ones Are Worth It (And Which Aren\'t)',
    excerpt:
      'There are hundreds of cybersecurity certifications. Here\'s an honest, experience-level guide to which ones actually move the needle with employers — and which to skip.',
    category: 'Certifications',
    tags: ['Certifications', 'Career Planning', 'CISSP', 'CompTIA', 'Entry Level'],
    author: 'Mukesh Vijaian',
    date: '2025-02-05',
    readTime: '8 min read',
    published: true,
    visualType: 'comparison-table',
    keyTakeaways: [
      'CompTIA Security+ remains the most widely-recognised entry-level certification for employer credibility',
      'ISC2 CC (Certified in Cybersecurity) is free to sit and a strong complement to Security+ for beginners',
      'CISSP requires 5 years of experience but is still worth studying earlier for the management framework it teaches',
      'Cert-chasing without hands-on experience is a red flag to experienced hiring managers — balance both',
      'Role-specific certifications (CySA+ for SOC, CISA for GRC, AWS Security for cloud) beat generic ones at mid-level',
    ],
    content: `
## The certification industry has a dirty secret

There are over 300 cybersecurity certifications. A multi-billion dollar training industry has sprung up to sell you every single one.

Here's the truth: most of them don't matter. A handful of them matter a lot. And how you earn them matters as much as which ones you earn.

This guide cuts through the noise with an honest, experience-level breakdown.

## A Note on Cert-Chasing

Before the list: a genuine warning.

Hiring managers can tell the difference between someone who has certifications and practical experience, and someone who has certifications and nothing else. The candidate with Security+, CySA+, CISM, and CISSP but no hands-on project work, no home lab, no war stories from real environments — that profile raises questions.

Certifications validate knowledge. They don't replace experience. Build both in parallel.

## Entry Level (0–2 Years Experience)

**CompTIA Security+ (SY0-701)**

This is still the industry baseline. It's vendor-neutral, widely recognised by employers globally and in Malaysia, and accepted by the US Department of Defense for baseline positions. Every cybersecurity job posting that lists a certification will list Security+.

Worth it? Yes, as a foundation. Don't stop here.

**ISC2 Certified in Cybersecurity (CC)**

ISC2 made this free to sit (you pay for the annual maintenance fee after passing). It covers security concepts at a high level — good complementary foundation alongside Security+. The ISC2 membership also gives you access to the (ISC)² community and resources.

Worth it? Yes, especially since it's free. Stack it with Security+.

**Google Cybersecurity Certificate (Coursera)**

A structured introduction to cybersecurity concepts, tools, and workflows. Good for career switchers with no IT background. Employers recognise it as a learning signal, not a credential with the weight of CompTIA or ISC2 — but it's a reasonable starting point.

Worth it? Yes as a learning tool, less so as a standalone credential. Pair with Security+.

## Mid-Level (2–5 Years Experience)

**CompTIA CySA+ (CS0-003)**

The blue team analyst certification. Covers threat detection, vulnerability management, incident response, and SIEM-based analysis. Directly applicable to Tier 2 SOC and security analyst roles. Very strong choice if your path is blue team / defensive security.

Worth it? Absolutely for SOC and blue team paths.

**PNPT (Practical Network Penetration Tester)**

From TCM Security. Unlike most paper-based certifications, PNPT requires a practical exam — you compromise a machine and write a professional penetration testing report. Highly regarded in the offensive security community. Cheaper than OSCP and more achievable for most candidates.

Worth it? Yes, if your path is offensive security. OSCP remains the gold standard but PNPT is an excellent stepping stone.

**CISA (Certified Information Systems Auditor)**

The gold standard for GRC and audit professionals. Requires 5 years of experience to certify (with exceptions), but studying it earlier is valuable. Recognised globally — especially in banking, Big Four consulting, and compliance-heavy industries.

Worth it? Yes, for GRC paths. One of the most universally respected credentials in the field.

**AWS Security Specialty / AZ-500**

Role-specific cloud security certifications. If you're targeting cloud security engineer roles, these are the credentials employers look for. They're technical, practical, and directly map to job responsibilities.

Worth it? Absolutely if cloud security is your target.

## Senior Level (5+ Years Experience)

**CISSP (Certified Information Systems Security Professional)**

The most widely recognised senior cybersecurity credential globally. Covers 8 domains across the security spectrum from security architecture to software development security. Requires 5 years of paid work experience. CISSP holders command salary premiums and often qualify for management and architect roles.

Worth it? Yes — but don't rush it. Study the material earlier; certify when you meet the experience requirement.

**CISM (Certified Information Security Manager)**

More focused on security management than CISSP's broad technical coverage. Strong for professionals moving into security management, director, or CISO-track roles. Highly valued in Malaysia's banking sector.

Worth it? Yes, especially for management career paths.

**CCSP (Certified Cloud Security Professional)**

ISC2's cloud security certification. Vendor-neutral and valued in compliance-heavy industries where cloud governance and architecture matter. Complements AWS/Azure technical certs well.

Worth it? Yes for senior cloud security professionals and security architects.

## Certifications to Skip (Mostly)

**CEH (Certified Ethical Hacker)**

EC-Council's flagship certification has suffered from criticism over its exam format (multiple choice, not practical), cost, and real-world applicability. PNPT and OSCP are respected; CEH is often viewed as a checkbox cert by experienced practitioners.

**Generic "cybersecurity" bootcamp certificates**

Dozens of bootcamp providers issue certificates for completing their programmes. These have minimal employer recognition and shouldn't be confused with vendor-neutral or vendor-specific industry certifications.

## The Right Combination

The certifications that will get you the most traction in Malaysia:

**Entry:** ISC2 CC + CompTIA Security+
**SOC/Blue Team path:** + CySA+ + BTL1
**GRC path:** + CISA (study early, certify with experience)
**Cloud Security path:** + AWS SAA + AWS Security Specialty or AZ-500
**Senior/Management:** + CISSP or CISM

---

*Our coaching includes a personalised certification roadmap built for your specific background, target role, and timeline. No generic advice.*

**[Book a Consultation →](/contact)**
    `,
  },
  {
    slug: 'malaysia-cybersecurity-jobs-2025',
    title: 'The State of Cybersecurity Jobs in Malaysia: 2025 Reality Check',
    excerpt:
      'What roles are actually hiring, what they\'re paying, and what skills Malaysian employers are actually asking for — based on what we see in the market.',
    category: 'Malaysia Market',
    tags: ['Malaysia', 'Jobs', 'Salary', 'Market Trends', 'Career Planning'],
    author: 'Mukesh Vijaian',
    date: '2025-02-01',
    readTime: '9 min read',
    published: true,
    visualType: 'comparison-table',
    keyTakeaways: [
      'The Malaysian market is bifurcated — many entry-level openings, scarce experienced practitioners',
      'Cloud security, OT/ICS, and detection engineering are the highest-paying and most scarce skill sets',
      'MNCs and global tech companies pay 20–40% above local market rates for the same roles',
      'Candidates who can communicate risk in business terms are in significantly shorter supply than technical-only candidates',
      'The mid-level gap (RM 6K to RM 12K+) requires genuine differentiation — not just more experience',
    ],
    content: `
## The market is real, but it's not equal

Malaysia's cybersecurity sector has been on an upward trajectory for years — CyberSecurity Malaysia's national programmes, BNM's regulatory push across financial services, the influx of global tech companies establishing regional hubs, and the NACSA national cybersecurity strategy have all driven sustained demand.

But here's what the job boards don't tell you: the market is bifurcated.

There are plenty of entry-level openings with modest pay. There's scarcity of experienced practitioners commanding premium salaries. The middle is thin and competitive. Understanding where you are and what the next jump requires is critical.

## What's Actually Hiring Right Now

**High volume of openings:**
SOC Analyst (Tier 1–2) roles dominate the volume — MSSP (Managed Security Service Providers) in particular run high-volume hiring for analysts. Security Analyst roles (combining elements of GRC and operations) are common in banking and financial services. VAPT (Vulnerability Assessment and Penetration Testing) roles exist but are more competitive than they appear — practical skills are rigorously tested.

**Scarcest and highest-paid:**
Cloud Security Engineers are extremely scarce relative to demand. Detection Engineers and Threat Hunters are specialist roles that most organisations struggle to fill. OT/ICS Security Specialists are in critical demand as Malaysia's industrial sector faces mounting regulatory pressure. Security Architects are almost always hired from internal promotion or aggressive external poaching.

**Growing rapidly:**
AI and ML security roles are emerging from almost zero. Privacy and Data Protection Officer (DPO) roles have grown significantly since DPDPA enforcement strengthened. Application Security (AppSec) Engineers are increasingly demanded as Malaysian tech companies mature their development security programmes.

## Salary Reality Check (2025, Klang Valley Market)

The figures below reflect offers we see in the market — not advertised ranges, which are often wider than reality.

**SOC Analyst**
Entry (0–2 years): RM 3,500–5,000
Mid (2–5 years): RM 5,000–8,000
Senior (5+ years): RM 8,000–12,000

**Security Analyst**
Entry: RM 4,000–6,000
Mid: RM 6,000–10,000
Senior: RM 10,000–15,000

**GRC Analyst**
Entry: RM 4,500–6,500
Mid: RM 6,500–11,000
Senior: RM 11,000–16,000

**Cloud Security Engineer**
Entry: RM 7,000–10,000
Mid: RM 10,000–16,000
Senior: RM 16,000–22,000

**Security Architect**
Mid: RM 12,000–18,000
Senior: RM 18,000–28,000+

MNC and global tech company premiums: 20–40% above these figures is standard for companies like Google, Meta, AWS, Grab, Sea Group, and similar.

## What Hiring Managers Actually Want (And Aren't Getting)

We speak to hiring managers regularly. Here's what they consistently say they're not getting from candidates:

**Practical, hands-on experience.** "Certified in X but can't do Y in a live environment" is a consistent frustration. Certifications that test practical skills (PNPT, BTL1, OSCP) are valued over those that don't.

**Business communication.** The ability to explain a technical risk in terms of business impact — financial, reputational, operational — is genuinely rare below senior level. It matters in GRC roles especially, but increasingly in all roles as security professionals interface with non-technical stakeholders.

**Business context.** Understanding why a control exists, not just how to implement it. Analysts who ask "what's the business risk if we don't do this?" get further faster than those who apply controls mechanically.

**Cloud skills.** This has been the consistent feedback for three years. Everyone knows they need cloud security. Almost no one has the supply to match.

## The Mid-Level Trap

The career jump that's hardest to make is from RM 5K–6K to RM 10K–12K. This is where generic "security analyst" profiles stagnate.

At entry level, hiring managers are forgiving — they're looking for aptitude, attitude, and willingness to learn. At mid-level, they're looking for demonstrated depth and differentiation.

The professionals who make the jump do so by developing genuine specialism: cloud security skills, a track record in a niche (OT, AI security, red team), management of a real security programme, or the ability to advise the business on risk strategy.

---

*Want a brutally honest assessment of where you stand in the Malaysian market and what to do next? That's exactly what our career consultations are for.*

**[Book a Consultation →](/contact)**
    `,
  },
  {
    slug: 'security-awareness-what-works',
    title: 'Security Awareness Training Is Broken. Here\'s What Actually Works.',
    excerpt:
      'Most organisations run annual security awareness training that nobody remembers by March. The research on what actually changes human behaviour tells a different story.',
    category: 'Security Awareness',
    tags: ['Security Awareness', 'Culture', 'Human Risk', 'Leadership'],
    author: 'Lavanyah Prabu',
    date: '2024-11-30',
    readTime: '6 min read',
    published: true,
    visualType: 'concept-diagram',
    keyTakeaways: [
      'Annual mandatory training has minimal impact on behaviour — completion rates are vanity metrics',
      'Psychological safety is foundational — employees who fear punishment hide mistakes instead of reporting them',
      'Role-relevant, just-in-time training outperforms generic quarterly modules significantly',
      'Security champion networks embedded in business teams drive more behaviour change than centralised programmes',
      'Measure leading indicators (report rates, near-miss rates) not lagging ones (completion rates)',
    ],
    content: `
## The $3 billion security awareness industry is largely failing

Here's the uncomfortable truth: annual mandatory security awareness training, followed by a phishing simulation, has marginal impact on organisational security. Academic research on behaviour change consistently shows this. Practitioners know it. Vendors know it too, but they're selling completion rates to compliance teams.

Yet organisations continue to buy the same LMS modules every year, report completion rates to the board, and call it done.

## Why Traditional Training Fails

**It's divorced from context.**

A generic video about password security watched in January is forgotten by March. Worse, it's watched on a Tuesday afternoon when the employee is trying to finish a deadline — not when they're actually facing a suspicious email. People don't connect generalised training to their real work environment.

**It focuses on compliance, not behaviour.**

Checking a box is not the same as changing how someone evaluates a suspicious link at 4:30 PM on a Friday. The goal of most security awareness programmes is auditor satisfaction, not human behaviour change. These are different objectives that require different approaches.

**It treats humans as the problem.**

When the central message of your training programme is "humans are the weakest link," you've already lost the culture battle. This framing creates shame rather than ownership, and shame is a terrible motivator for sustained behaviour change.

**It ignores psychological safety.**

If employees believe that clicking a phishing simulation will result in embarrassment, discipline, or being used as a bad example in the next all-hands, they will hide their mistakes. A culture of blame produces hidden near-misses. A culture of psychological safety produces reported near-misses — which is vastly more valuable for your security programme.

## What Actually Works

**Short, frequent touchpoints over long, periodic modules**

Five-minute monthly communications — a real phishing example from this week's threat landscape, a quick case study from a relevant industry breach — are more effective than 60-minute quarterly modules. Frequency and relevance beat duration.

**Role-relevant content**

Finance teams should get wire fraud and BEC training. HR teams should get recruitment phishing training (fake LinkedIn InMails, fake job applications are a common attack vector). Engineering teams should get social engineering and phishing-for-credentials training. One-size-fits-all is none-size-fits-anyone.

**Just-in-time training**

The most effective training moment is immediately after a near-miss. When someone almost clicks a phishing simulation, the teachable window is open. Automated systems that deliver a brief, contextualised learning moment right at that point significantly outperform scheduled training blocks.

**Security champion networks**

Identify security-aware employees in each business unit and invest in them. Give them early visibility into emerging threats, recognition for their security behaviour, and a direct line to the security team. Champions embedded in business teams drive behaviour change more effectively than centralised awareness campaigns because they have context, relationships, and credibility.

**Leadership modelling**

If the CISO completes the phishing training from a personal mobile in three minutes without reading it, everyone knows. If the CEO asks the security team for a briefing on phishing trends, people notice. Leadership behaviour is the most powerful signal in any culture programme.

**Measuring the right things**

Completion rates tell you nothing about behaviour change. Measure:
- Phishing simulation click rates (and trend over time, not just point-in-time)
- Near-miss report rates (are people reporting suspicious emails?)
- Help desk security-related query volume (are people asking before acting?)
- Time-to-report for suspected phishing

Increasing near-miss report rates is one of the most valuable security metrics an organisation can track. It means people are seeing the threat and choosing to act correctly.

## For Security Professionals Building This Programme

If you're in GRC, security management, or heading toward a security leadership role, designing and measuring a security awareness programme is a high-value skill that differentiates mid-level from senior candidates.

Articulating the shift from compliance-driven to behaviour-driven awareness — and demonstrating you can measure what actually matters — signals strategic maturity.

---

*If you're a cybersecurity professional looking to build your career in security management or GRC leadership, our coaching programmes include strategy and communication skills development.*

**[Contact Us →](/contact)**
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
