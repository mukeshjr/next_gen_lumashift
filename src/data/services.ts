import { Service } from '@/types';

export const services: Service[] = [
  // ─── STARTER TIER ────────────────────────────────────────────────────────────
  {
    id: 'resume-review',
    title: 'Resume Review',
    tier: 'starter',
    forWho: 'Students, fresh grads, and early-career professionals',
    description:
      'Get a detailed review of your cybersecurity resume. We highlight gaps, strengthen your technical keywords, and make sure you pass ATS filters used by top employers.',
    outcomes: [
      'ATS-optimised resume ready for top employers',
      'Clear articulation of technical projects and internships',
      'Tailored keyword strategy per target role',
      'Actionable rewrite suggestions within 3 business days',
    ],
    price: 'From RM 150',
    duration: '1–3 business days turnaround',
    popular: false,
  },
  {
    id: 'linkedin-optimisation',
    title: 'LinkedIn Profile Optimisation',
    tier: 'starter',
    forWho: 'Professionals wanting to attract recruiters and hiring managers',
    description:
      'Transform your LinkedIn into a lead-generating profile. We optimise your headline, summary, experience, and skills to rank higher in recruiter searches.',
    outcomes: [
      'Keyword-rich headline that attracts recruiters',
      'Compelling About section that tells your story',
      'Skills section aligned with cybersecurity roles',
      'Profile strength from "Intermediate" to "All-Star"',
    ],
    price: 'From RM 120',
    duration: '2–3 business days turnaround',
    popular: false,
  },
  {
    id: 'career-consultation-30',
    title: 'Career Consultation (30 min)',
    tier: 'starter',
    forWho: 'Anyone at a crossroads in their cybersecurity journey',
    description:
      'A focused, no-fluff session to answer your most pressing cybersecurity career questions, map your next step, and bust common misconceptions.',
    outcomes: [
      'Clarity on which cybersecurity path fits you',
      'Honest assessment of your current position',
      'Concrete next steps to take immediately',
    ],
    price: 'From RM 80',
    duration: '30 minutes via Google Meet / Zoom',
    popular: false,
  },

  // ─── PROFESSIONAL TIER ───────────────────────────────────────────────────────
  {
    id: 'career-consultation-60',
    title: 'Career Consultation (60 min)',
    tier: 'professional',
    forWho: 'Mid-career professionals planning a pivot or accelerating growth',
    description:
      'Deep-dive session covering career roadmap, skills gap analysis, certification strategy, and salary negotiation tactics for cybersecurity professionals.',
    outcomes: [
      '12-month personalised career roadmap',
      'Certification priority list based on your goals',
      'Salary benchmark data for Malaysian and global markets',
      'Networking and job search strategy',
    ],
    price: 'From RM 150',
    duration: '60 minutes via Google Meet / Zoom',
    popular: false,
  },
  {
    id: 'mock-interview-technical',
    title: 'Mock Interview – Technical (Role-Specific)',
    tier: 'professional',
    forWho: 'Job seekers preparing for Security Analyst, SOC, GRC, or Cloud roles',
    description:
      'Realistic mock interview simulating the questions, format, and pressure of top cybersecurity hiring panels. Role-specific and brutally honest feedback.',
    outcomes: [
      'Full interview simulation with real-world questions',
      'Detailed written feedback on answers and delivery',
      'Tips to handle curveball technical questions',
      'Confidence that comes from knowing what to expect',
    ],
    price: 'From RM 200',
    duration: '60 minutes + written feedback within 24 hours',
    popular: false,
  },
  {
    id: 'mock-interview-behavioural',
    title: 'Mock Interview – Behavioural & HR',
    tier: 'professional',
    forWho: 'Candidates who struggle with soft-skill or STAR-based questions',
    description:
      'Master the art of storytelling in interviews. We coach you through STAR-format answers, salary negotiation scripts, and handling tough HR questions.',
    outcomes: [
      'STAR-format answer bank for 10+ common questions',
      'Salary negotiation scripts that actually work',
      'Handling "Why cybersecurity?" and career-switch questions',
      'Body language and video interview presence coaching',
    ],
    price: 'From RM 180',
    duration: '60 minutes via Google Meet / Zoom',
    popular: false,
  },

  // ─── ADVANCED / PACKAGES ─────────────────────────────────────────────────────
  {
    id: 'starter-launch-package',
    title: 'Starter Launch Package',
    tier: 'advanced',
    tag: 'Best Value Entry',
    forWho: 'Students and fresh grads entering cybersecurity',
    description:
      'Everything you need to launch your cybersecurity career from zero. Resume, LinkedIn, and a career direction session bundled at a significant discount.',
    outcomes: [
      'ATS-ready cybersecurity resume',
      'Fully optimised LinkedIn profile',
      '30-min career direction consultation',
      'Email support for 2 weeks post-delivery',
    ],
    price: 'From RM 320',
    duration: '5–7 business days',
    popular: false,
  },
  {
    id: 'job-ready-package',
    title: 'Job-Ready Package',
    tier: 'advanced',
    tag: 'Most Popular',
    forWho: 'Entry to mid-level professionals actively job hunting',
    description:
      'The complete job-hunt toolkit. Resume, LinkedIn, career consultation, plus two mock interviews (technical + behavioural) to maximise interview-to-offer conversion.',
    outcomes: [
      'ATS-optimised resume + LinkedIn',
      '60-min career roadmap session',
      '2 mock interviews with detailed feedback',
      'Job application strategy and tracker template',
      '30-day email support',
    ],
    price: 'From RM 650',
    duration: '10–14 business days',
    popular: true,
  },
  {
    id: 'career-accelerator-package',
    title: 'Career Accelerator Package',
    tier: 'advanced',
    tag: 'Most Popular',
    forWho: 'Mid-career professionals targeting senior or specialist roles',
    description:
      'Premium 4-week coaching programme for professionals targeting RM 8K+ roles or international opportunities. Combines strategy, preparation, and ongoing support.',
    outcomes: [
      'Full personal brand overhaul (resume + LinkedIn + bio)',
      '4 x 60-min private coaching sessions',
      '3 mock interviews across formats',
      'Certification and skills gap roadmap',
      'Salary negotiation and offer evaluation support',
      '60-day email + WhatsApp support',
    ],
    price: 'From RM 1,800',
    duration: '4-week structured programme',
    popular: true,
  },

  // ─── SPECIALIST TRACKS ────────────────────────────────────────────────────────
  {
    id: 'grc-coaching-track',
    title: 'GRC Coaching Track',
    tier: 'advanced',
    tag: 'Most Popular',
    track: 'GRC',
    forWho:
      'Professionals targeting Governance, Risk & Compliance roles (ISO 27001, PDPA, DORA)',
    description:
      'Structured coaching for GRC analysts and managers. Covers frameworks, audit readiness, policy writing, and how to communicate risk to the board.',
    outcomes: [
      'Understanding of ISO 27001, NIST CSF, DPDPA / PDPA',
      'GRC portfolio with sample risk registers and policies',
      'Interview prep for GRC analyst and manager roles',
      'Certification guidance (CISA, CRISC, ISO Lead Auditor)',
      'Resume and LinkedIn tailored for GRC roles',
    ],
    price: 'From RM 1,200',
    duration: '3-week programme (6 sessions)',
    popular: true,
  },
  {
    id: 'soc-blue-team-track',
    title: 'SOC / Blue Team Track',
    tier: 'advanced',
    tag: 'Most Popular',
    track: 'SOC',
    forWho:
      'Aspiring SOC analysts, threat hunters, and incident responders',
    description:
      'Hands-on coaching for those entering or advancing within Security Operations. Covers detection logic, alert triage, SIEM use cases, and incident response playbooks.',
    outcomes: [
      'SOC analyst mindset and alert triage methodology',
      'Practical SIEM queries (Splunk / Sentinel / QRadar)',
      'Incident response playbook walkthroughs',
      'Interview prep for Tier 1–3 SOC roles',
      'Certification path: CompTIA Security+ → CySA+ → GCIH',
    ],
    price: 'From RM 1,200',
    duration: '3-week programme (6 sessions)',
    popular: true,
  },
  {
    id: 'cloud-security-track',
    title: 'Cloud Security Track',
    tier: 'advanced',
    tag: 'Most Popular',
    track: 'Cloud',
    forWho:
      'Cloud engineers pivoting to security, and security pros adding cloud skills',
    description:
      'Covers cloud-native security architecture, IAM, CSPM, and securing workloads on AWS, Azure, and GCP. Includes real interview question practice.',
    outcomes: [
      'Cloud security architecture fundamentals',
      'IAM, network security, and CSPM deep-dives',
      'Interview preparation for cloud security engineer roles',
      'Certification path: AWS SAA → AWS Security Specialty / AZ-500',
      'Resume positioning for cloud security roles',
    ],
    price: 'From RM 1,200',
    duration: '3-week programme (6 sessions)',
    popular: true,
  },
  {
    id: 'ot-ics-track',
    title: 'OT / ICS Security Track',
    tier: 'advanced',
    tag: 'Niche & In-Demand',
    track: 'OT/ICS',
    forWho:
      'OT/SCADA engineers and cybersecurity professionals targeting industrial security',
    description:
      'Specialised coaching for the rapidly growing OT/ICS security space. Covers Purdue model, IEC 62443, network segmentation, and the unique challenges of securing critical infrastructure.',
    outcomes: [
      'OT vs IT security distinctions and convergence',
      'IEC 62443 framework overview',
      'Asset inventory and vulnerability management in OT',
      'Career pathways into OT security roles',
      'Resume and LinkedIn for OT/ICS security specialists',
    ],
    price: 'From RM 1,400',
    duration: '3-week programme (6 sessions)',
    popular: false,
  },
  {
    id: 'cybersecurity-workshop',
    title: 'Cybersecurity Career Masterclass (Group)',
    tier: 'professional',
    forWho: 'University clubs, bootcamps, and corporate L&D teams',
    description:
      'Interactive group workshop covering cybersecurity career paths, resume writing, and interview strategies. Tailored to your audience's experience level.',
    outcomes: [
      'Live Q&A with practising cybersecurity professionals',
      'Resume and LinkedIn tips for cybersecurity',
      'Career path overview and salary benchmarks',
      'Customisable for student or corporate audience',
    ],
    price: 'From RM 800 (group, up to 30 pax)',
    duration: '2–3 hours (online or on-site)',
    popular: false,
  },
];

export const getServicesByTier = (tier: Service['tier']) =>
  services.filter((s) => s.tier === tier);

export const getPopularServices = () =>
  services.filter((s) => s.popular);

export const getServiceById = (id: string) =>
  services.find((s) => s.id === id);
