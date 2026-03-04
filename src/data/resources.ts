import { Resource } from '@/types';

export const resources: Resource[] = [
  {
    id: 'cybersec-resume-template',
    title: 'Cybersecurity Resume Template (ATS-Optimised)',
    description:
      'A clean, ATS-friendly resume template specifically designed for cybersecurity professionals. Includes guidance notes and keyword lists per role type.',
    type: 'template',
    free: true,
    downloadUrl: '/resources/cybersec-resume-template.pdf',
    category: 'Resume & Job Search',
  },
  {
    id: 'interview-question-bank',
    title: 'Top 50 Cybersecurity Interview Questions & Answer Guide',
    description:
      'The most common technical and behavioural interview questions for entry-to-mid level cybersecurity roles, with example answers and coaching notes.',
    type: 'guide',
    free: true,
    downloadUrl: '/resources/interview-question-bank.pdf',
    category: 'Interview Prep',
  },
  {
    id: 'cert-roadmap-2025',
    title: 'Cybersecurity Certification Roadmap 2025',
    description:
      'A visual guide to cybersecurity certifications by role, experience level, and vendor. Helps you prioritise what to study next.',
    type: 'guide',
    free: true,
    downloadUrl: '/resources/cert-roadmap-2025.pdf',
    category: 'Certifications',
  },
  {
    id: 'linkedin-checklist',
    title: 'LinkedIn Optimisation Checklist for Cybersecurity Professionals',
    description:
      'A 20-point checklist to transform your LinkedIn into a recruiter magnet. Covers headline, summary, experience, skills, and activity.',
    type: 'checklist',
    free: true,
    downloadUrl: '/resources/linkedin-checklist.pdf',
    category: 'Personal Branding',
  },
  {
    id: 'soc-analyst-starter-kit',
    title: 'SOC Analyst Starter Kit (Premium)',
    description:
      'Comprehensive resource pack including: SIEM query cheat sheet, alert triage runbook, MITRE ATT&CK quick reference, and recommended free lab environments.',
    type: 'guide',
    free: false,
    category: 'SOC / Blue Team',
  },
  {
    id: 'grc-policy-templates',
    title: 'GRC Policy Templates Pack (Premium)',
    description:
      'Ready-to-use templates for Information Security Policy, Acceptable Use Policy, Incident Response Policy, and Risk Register. ISO 27001 aligned.',
    type: 'template',
    free: false,
    category: 'GRC & Compliance',
  },
  {
    id: 'cloud-security-checklist',
    title: 'AWS & Azure Security Hardening Checklist (Premium)',
    description:
      'Practical security hardening checklists for AWS and Azure environments. Covers IAM, networking, logging, and compliance baselines.',
    type: 'checklist',
    free: false,
    category: 'Cloud Security',
  },
  {
    id: 'salary-negotiation-guide',
    title: 'Cybersecurity Salary Negotiation Scripts (Premium)',
    description:
      'Word-for-word scripts and strategies for negotiating cybersecurity salaries in Malaysia and the region. Includes common employer tactics and counter-responses.',
    type: 'guide',
    free: false,
    category: 'Career Strategy',
  },
  {
    id: 'ot-ics-primer',
    title: 'OT / ICS Security Primer (Premium)',
    description:
      'A comprehensive introduction to OT/ICS cybersecurity — Purdue model, common protocols, IEC 62443 overview, and career pathway guide.',
    type: 'guide',
    free: false,
    category: 'OT / ICS Security',
  },
];

export const getFreeResources = () => resources.filter((r) => r.free);
export const getPremiumResources = () => resources.filter((r) => !r.free);
export const getResourcesByCategory = (category: string) =>
  resources.filter((r) => r.category === category);
export const getAllResourceCategories = () => [
  ...new Set(resources.map((r) => r.category)),
];
