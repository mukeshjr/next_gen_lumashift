import { TeamMember } from '@/types';

export const team: TeamMember[] = [
  {
    name: 'Mukesh Vijaian',
    role: 'Co-Founder & Lead Career Coach',
    bio: `Mukesh is a cybersecurity practitioner and career coach with hands-on experience across Security Operations, Cloud Security, and Threat Intelligence. He has helped dozens of professionals across Malaysia break into and advance in the cybersecurity industry.

A firm believer that talent is everywhere but opportunity is not, Mukesh founded LumaShift to democratise access to quality cybersecurity career coaching — especially for Malaysian students and professionals who lack the networks that others take for granted.

He speaks directly, coaches practically, and focuses ruthlessly on outcomes: does your resume get you interviews? Does your interview get you offers? That's the only metric that matters.`,
    expertise: [
      'Security Operations (SOC / Blue Team)',
      'Cloud Security (AWS, Azure)',
      'Threat Intelligence & Detection Engineering',
      'Cybersecurity Career Strategy',
      'Technical Interview Coaching',
    ],
    certifications: [
      'CompTIA Security+',
      'AWS Cloud Practitioner',
      'Certified in Cybersecurity (CC) – ISC2',
    ],
    linkedIn: 'https://www.linkedin.com/in/mukeshvijaian/',
    email: 'lumashift@outlook.com',
    avatar: '/team/mukesh.jpg',
  },
  {
    name: 'Lavanyah Prabu',
    role: 'Co-Founder & Career Strategy Coach',
    bio: `Lavanyah brings a unique blend of cybersecurity expertise and talent development experience to LumaShift. With a background in GRC, policy, and risk management, she specialises in helping professionals navigate the often-opaque hiring processes at banks, consultancies, and tech firms.

Her coaching style is empathetic but results-driven. She understands the anxiety of career transitions and meets clients where they are — whether that's a fresh grad with a blank resume or a mid-career professional who's been in the same role for five years and doesn't know what's next.

Lavanyah is particularly passionate about helping underrepresented groups (women, minorities, career switchers) find their footing in cybersecurity.`,
    expertise: [
      'Governance, Risk & Compliance (GRC)',
      'Policy and Risk Management',
      'Soft Skills & Interview Coaching',
      'Career Transition Strategy',
      'Personal Branding',
    ],
    certifications: [
      'ISO 27001 Lead Implementer',
      'Certified in Risk and Information Systems Control (CRISC) – pursuing',
      'CompTIA Security+',
    ],
    linkedIn: 'https://www.linkedin.com/in/lavanyahprabu/',
    email: 'lumashift@outlook.com',
    avatar: '/team/lavanyah.jpg',
  },
];
