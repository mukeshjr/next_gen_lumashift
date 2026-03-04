import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What best describes your current experience level?',
    type: 'single',
    options: [
      { value: 'student', label: 'Student (currently studying)' },
      { value: 'fresh-grad', label: 'Fresh Graduate (0–1 year)' },
      { value: 'early', label: 'Early Career (1–3 years)' },
      { value: 'mid', label: 'Mid-Career (3–7 years)' },
      { value: 'senior', label: 'Senior (7+ years)' },
    ],
  },
  {
    id: 'roles',
    question: 'Which cybersecurity areas interest you most? (Select up to 3)',
    type: 'multiple',
    options: [
      { value: 'soc', label: 'SOC / Blue Team / Incident Response' },
      { value: 'grc', label: 'GRC / Risk / Compliance / Audit' },
      { value: 'cloud', label: 'Cloud Security' },
      { value: 'appsec', label: 'Application Security / DevSecOps' },
      { value: 'pentest', label: 'Penetration Testing / Red Team' },
      { value: 'ot', label: 'OT / ICS / Industrial Security' },
      { value: 'analyst', label: 'Security Analyst (general)' },
      { value: 'unsure', label: 'Not sure yet — help me decide' },
    ],
  },
  {
    id: 'resume-confidence',
    question: 'How confident are you that your resume would get you an interview at your target company?',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 5,
    scaleLabels: { min: 'Not confident at all', max: 'Very confident' },
  },
  {
    id: 'interview-confidence',
    question: 'How confident are you in your ability to perform well in a technical cybersecurity interview?',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 5,
    scaleLabels: { min: 'Not confident at all', max: 'Very confident' },
  },
  {
    id: 'linkedin-confidence',
    question: 'How well does your LinkedIn profile represent your cybersecurity expertise and attract recruiters?',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 5,
    scaleLabels: { min: 'Not at all / No LinkedIn', max: 'Excellent — regular recruiter contact' },
  },
  {
    id: 'blockers',
    question: 'What are your biggest blockers right now? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'resume', label: 'My resume isn\'t getting me interviews' },
      { value: 'interviews', label: 'I get interviews but don\'t convert them to offers' },
      { value: 'technical', label: 'I need to deepen my technical skills' },
      { value: 'direction', label: 'I don\'t know which cybersecurity path to take' },
      { value: 'certs', label: 'I\'m not sure which certifications to pursue' },
      { value: 'linkedin', label: 'I\'m not getting noticed on LinkedIn' },
      { value: 'salary', label: 'I\'m not sure how to negotiate salary' },
      { value: 'switch', label: 'I\'m switching from a non-IT background' },
    ],
  },
  {
    id: 'timeline',
    question: 'What is your career goal timeline?',
    type: 'single',
    options: [
      { value: 'asap', label: 'I need a job now (actively applying)' },
      { value: '3months', label: 'Within 3 months' },
      { value: '6months', label: 'Within 6 months' },
      { value: 'year', label: 'Within a year' },
      { value: 'exploring', label: 'Just exploring my options' },
    ],
  },
];

export const computeQuizResult = (answers: Record<string, string | string[] | number>) => {
  const resumeScore = Number(answers['resume-confidence'] ?? 0);
  const interviewScore = Number(answers['interview-confidence'] ?? 0);
  const linkedinScore = Number(answers['linkedin-confidence'] ?? 0);

  const confidenceScore = Math.round((resumeScore + interviewScore + linkedinScore) / 3);

  const roles = (answers['roles'] as string[]) ?? [];
  const blockers = (answers['blockers'] as string[]) ?? [];
  const experience = (answers['experience'] as string) ?? '';
  const timeline = (answers['timeline'] as string) ?? '';

  // Role recommendations
  const recommendedRoles: string[] = [];
  if (roles.includes('soc') || roles.includes('analyst')) recommendedRoles.push('soc-analyst', 'security-analyst');
  if (roles.includes('grc')) recommendedRoles.push('grc-analyst');
  if (roles.includes('cloud')) recommendedRoles.push('cloud-security');
  if (roles.includes('ot')) recommendedRoles.push('ot-ics-security');
  if (roles.includes('appsec') || roles.includes('pentest')) recommendedRoles.push('security-engineer');
  if (roles.includes('unsure') || recommendedRoles.length === 0) {
    recommendedRoles.push('security-analyst', 'soc-analyst', 'grc-analyst');
  }

  // Service recommendations
  const recommendedServices: string[] = [];
  if (blockers.includes('resume') || resumeScore <= 2) recommendedServices.push('resume-review');
  if (blockers.includes('linkedin') || linkedinScore <= 2) recommendedServices.push('linkedin-optimisation');
  if (blockers.includes('interviews') || interviewScore <= 2) {
    recommendedServices.push('mock-interview-technical', 'mock-interview-behavioural');
  }
  if (blockers.includes('direction') || experience === 'student' || experience === 'fresh-grad') {
    recommendedServices.push('career-consultation-30');
  }
  if (roles.includes('grc')) recommendedServices.push('grc-coaching-track');
  if (roles.includes('cloud')) recommendedServices.push('cloud-security-track');
  if (roles.includes('soc')) recommendedServices.push('soc-blue-team-track');
  if (roles.includes('ot')) recommendedServices.push('ot-ics-track');
  if (timeline === 'asap' || timeline === '3months') {
    if (!recommendedServices.includes('job-ready-package')) {
      recommendedServices.push('job-ready-package');
    }
  }
  if (experience === 'mid' || experience === 'senior') {
    if (!recommendedServices.includes('career-accelerator-package')) {
      recommendedServices.push('career-accelerator-package');
    }
  }

  // Strengths and gaps
  const strengths: string[] = [];
  const gaps: string[] = [];
  if (resumeScore >= 4) strengths.push('Strong resume foundation');
  if (interviewScore >= 4) strengths.push('Interview confidence');
  if (linkedinScore >= 4) strengths.push('LinkedIn presence and visibility');
  if (resumeScore <= 2) gaps.push('Resume needs significant improvement');
  if (interviewScore <= 2) gaps.push('Interview preparation and confidence');
  if (linkedinScore <= 2) gaps.push('LinkedIn profile optimisation');
  if (blockers.includes('direction')) gaps.push('Career direction clarity');
  if (blockers.includes('technical')) gaps.push('Technical depth and hands-on skills');
  if (blockers.includes('switch')) gaps.push('Positioning non-IT background for cybersecurity');

  const talkToCoach = confidenceScore <= 2 || blockers.includes('direction') || blockers.includes('switch');

  return {
    confidenceScore,
    recommendedRoles: [...new Set(recommendedRoles)],
    recommendedServices: [...new Set(recommendedServices)].slice(0, 5),
    strengths,
    gaps,
    talkToCoach,
  };
};
