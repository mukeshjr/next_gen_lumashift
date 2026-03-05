'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  BarChart2,
  MessageSquare,
  Zap,
  RefreshCw,
  ArrowRight,
  Star,
  Lightbulb,
  TrendingUp,
  Award,
  Lock,
  Trophy,
} from 'lucide-react';
import { quizQuestions, computeQuizResult } from '@/data/quiz';
import { roles } from '@/data/roles';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type Answers = Record<string, string | string[] | number>;

// Scoring weights for services based on blockers + quiz answers
const SERVICE_WEIGHTS: Record<string, string[]> = {
  'resume-review': ['resume', 'linkedin'],
  'linkedin-optimisation': ['linkedin', 'resume'],
  'career-consultation-30': ['direction', 'switch', 'student', 'fresh-grad'],
  'career-consultation-60': ['direction', 'salary', 'mid', 'senior'],
  'mock-interview-technical': ['interviews', 'technical'],
  'mock-interview-behavioural': ['interviews', 'communication'],
  'starter-launch-package': ['student', 'fresh-grad', 'resume', 'linkedin'],
  'job-ready-package': ['interviews', 'resume', 'asap', '3months'],
  'career-accelerator-package': ['mid', 'senior', 'salary'],
  'grc-coaching-track': ['grc'],
  'soc-blue-team-track': ['soc'],
  'cloud-security-track': ['cloud'],
  'ot-ics-track': ['ot'],
  'cybersecurity-workshop': [],
};

function rankServices(
  recommendedIds: string[],
  answers: Answers
): { primary: typeof services; pathway: typeof services } {
  const blockers = (answers['blockers'] as string[]) ?? [];
  const roles_answer = (answers['roles'] as string[]) ?? [];
  const experience = answers['experience'] as string ?? '';
  const timeline = answers['timeline'] as string ?? '';

  const allSignals = [...blockers, ...roles_answer, experience, timeline];

  const scored = recommendedIds.map((id) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return null;
    const weights = SERVICE_WEIGHTS[id] ?? [];
    const score = weights.reduce(
      (acc, signal) => acc + (allSignals.includes(signal) ? 1 : 0),
      0
    );
    return { svc, score };
  });

  const sorted = (scored.filter(Boolean) as { svc: typeof services[0]; score: number }[]).sort(
    (a, b) => b.score - a.score
  );

  const primary = sorted.slice(0, 3).map((s) => s.svc);
  const pathway = sorted.slice(3).map((s) => s.svc);

  return { primary, pathway };
}

const tierOrder = { starter: 0, professional: 1, advanced: 2 };

function buildJourneyPath(primary: typeof services, experience: string) {
  const isEarly = ['student', 'fresh-grad', 'early'].includes(experience);
  const isMid = ['mid', 'senior'].includes(experience);

  if (isEarly) {
    return [
      { label: 'Start Here', desc: 'Resume + LinkedIn', icon: '📄', color: 'bg-blue-500' },
      { label: 'Get Interview-Ready', desc: 'Mock Interviews', icon: '🎯', color: 'bg-orange-500' },
      { label: 'Specialise', desc: 'Coaching Track', icon: '⭐', color: 'bg-green-500' },
    ];
  }
  if (isMid) {
    return [
      { label: 'Reposition', desc: 'Career Consultation', icon: '🗺️', color: 'bg-purple-500' },
      { label: 'Accelerate', desc: 'Accelerator Package', icon: '🚀', color: 'bg-orange-500' },
      { label: 'Specialise', desc: 'Advanced Track', icon: '⭐', color: 'bg-green-500' },
    ];
  }
  return [
    { label: 'Assess', desc: 'Career Consultation', icon: '🔍', color: 'bg-blue-500' },
    { label: 'Prepare', desc: 'Mock Interviews', icon: '🎯', color: 'bg-orange-500' },
    { label: 'Launch', desc: 'Job-Ready Package', icon: '🚀', color: 'bg-green-500' },
  ];
}

export function QuizComponent() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const savedRef = useRef(false);

  const totalSteps = quizQuestions.length;
  const isIntro = step === 0;
  const isResults = step > totalSteps;
  const currentQuestion = quizQuestions[step - 1];
  const progress = isResults ? 100 : Math.round(((step - 1) / totalSteps) * 100);

  const result = isResults ? computeQuizResult(answers) : null;

  // Auto-save quiz result to Supabase when user is logged in and results appear
  useEffect(() => {
    if (!isResults || !result || !user || savedRef.current) return;
    savedRef.current = true;

    fetch('/api/quiz-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        confidence_score: result.confidenceScore,
        recommended_roles: result.recommendedRoles,
        recommended_services: result.recommendedServices,
        strengths: result.strengths,
        gaps: result.gaps,
        talk_to_coach: result.talkToCoach,
        answers,
      }),
    })
      .then(() => setResultSaved(true))
      .catch(() => {});
  }, [isResults, result, user, answers]);

  const handleSingle = (qId: string, value: string) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
  };

  const handleMultiple = (qId: string, value: string) => {
    setAnswers((a) => {
      const prev = (a[qId] as string[]) ?? [];
      if (prev.includes(value)) return { ...a, [qId]: prev.filter((v) => v !== value) };
      if (prev.length >= 3) return a;
      return { ...a, [qId]: [...prev, value] };
    });
  };

  const handleScale = (qId: string, value: number) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') return !!answer;
    if (currentQuestion.type === 'multiple') return Array.isArray(answer) && answer.length > 0;
    if (currentQuestion.type === 'scale') return answer !== undefined;
    return false;
  };

  const submitLead = async () => {
    if (!leadForm.name || !leadForm.email) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          formType: 'quiz_result',
          experienceLevel: answers['experience'],
          roles: answers['roles'],
          confidenceScore: result?.confidenceScore,
          blockers: answers['blockers'],
          recommendedServices: result?.recommendedServices,
        }),
      });
    } catch { /* fail silently */ }
    setLeadSubmitted(true);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setLeadForm({ name: '', email: '' });
    setLeadSubmitted(false);
    setResultSaved(false);
    savedRef.current = false;
  };

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (isIntro) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 rounded-3xl mb-6 animate-float">
          <BarChart2 size={36} className="text-orange-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
          Find Your Cybersecurity Career Path
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          7 focused questions. Get a personalised confidence score, role matches, and a ranked
          service pathway built for <em>your</em> exact situation.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10 text-center">
          {[
            { icon: '⏱', label: '~3 minutes' },
            { icon: '🎯', label: 'Personalised results' },
            { icon: '🔒', label: 'No spam, ever' },
          ].map((item) => (
            <div key={item.label} className="card py-5">
              <p className="text-3xl mb-1">{item.icon}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)} className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
          Start the Quiz <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────────
  if (isResults && result) {
    const experience = answers['experience'] as string ?? '';
    const { primary, pathway } = rankServices(result.recommendedServices, answers);
    const journeySteps = buildJourneyPath(primary, experience);

    const scoreColor =
      result.confidenceScore >= 4 ? 'text-green-500' :
      result.confidenceScore >= 3 ? 'text-yellow-500' : 'text-red-500';

    const scoreLabel =
      result.confidenceScore >= 4 ? 'Strong Foundation' :
      result.confidenceScore >= 3 ? 'Good Progress' :
      result.confidenceScore >= 2 ? 'Needs Development' : 'Early Stage';

    const scoreBg =
      result.confidenceScore >= 4 ? 'from-green-500/20 to-green-500/5' :
      result.confidenceScore >= 3 ? 'from-yellow-500/20 to-yellow-500/5' :
      'from-red-500/20 to-red-500/5';

    const recRoles = roles.filter((r) => result.recommendedRoles.includes(r.id));

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">

        {/* Score banner */}
        <div className={`card bg-gradient-to-br ${scoreBg} text-center py-10 border-0`}>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Your Confidence Score
          </p>
          <div className={cn('text-8xl font-black mb-1', scoreColor)}>
            {result.confidenceScore}
            <span className="text-4xl font-normal text-gray-400">/5</span>
          </div>
          <p className={cn('text-2xl font-bold mb-5', scoreColor)}>{scoreLabel}</p>
          <div className="max-w-xs mx-auto bg-white/30 dark:bg-black/20 rounded-full h-4 mb-2">
            <div
              className={cn('h-4 rounded-full transition-all duration-1000', {
                'bg-green-500': result.confidenceScore >= 4,
                'bg-yellow-500': result.confidenceScore === 3,
                'bg-red-500': result.confidenceScore <= 2,
              })}
              style={{ width: `${(result.confidenceScore / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Composite of: resume confidence · interview readiness · LinkedIn visibility
          </p>
        </div>

        {/* Saved to dashboard indicator */}
        {resultSaved && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
            <Trophy size={18} className="text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                Results saved to your dashboard! +50 points earned.
              </p>
              <Link href="/dashboard" className="text-xs text-green-600 dark:text-green-500 hover:underline">
                View your dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* Talk to a coach */}
        {result.talkToCoach && (
          <div className="bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-400/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  We Recommend a 1-on-1 Coaching Call
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Based on your score and where you are right now, a focused 30-minute conversation
                  will give you a clearer path forward than any guide or article can. No pressure — just clarity.
                </p>
                <Link href="/contact?service=career-consultation-30" className="btn-primary text-sm">
                  Contact Us for a Consultation <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Strengths and gaps */}
        {(result.strengths.length > 0 || result.gaps.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {result.strengths.length > 0 && (
              <div className="card border-green-100 dark:border-green-500/20">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award size={18} className="text-green-500" /> Your Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.gaps.length > 0 && (
              <div className="card border-orange-100 dark:border-orange-500/20">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" /> Areas to Develop
                </h3>
                <ul className="space-y-2">
                  {result.gaps.map((g) => (
                    <li key={g} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <ArrowRight size={15} className="text-orange-500 shrink-0 mt-0.5" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* PRIMARY SERVICE RECOMMENDATIONS */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Recommended Services for You
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ranked by fit with your specific answers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {primary.map((svc, i) => (
              <div
                key={svc.id}
                className={cn(
                  'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all hover:-translate-y-0.5',
                  i === 0
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E]'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0',
                    i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-gray-600 dark:bg-gray-500' : 'bg-gray-400 dark:bg-gray-600'
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 dark:text-white">{svc.title}</h4>
                    {i === 0 && (
                      <span className="badge-orange text-xs">Best Match</span>
                    )}
                    {svc.popular && (
                      <span className="badge bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{svc.forWho}</p>
                  {svc.price && (
                    <p className="text-sm font-semibold text-orange-500 mt-1">{svc.price}</p>
                  )}
                </div>
                <Link
                  href={`/contact?service=${svc.id}`}
                  className={cn(
                    'shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-all',
                    i === 0
                      ? 'btn-primary text-sm py-2'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-400 hover:text-orange-500'
                  )}
                >
                  {i === 0 ? 'Start Here' : 'Enquire'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CAREER JOURNEY PATHWAY */}
        <div className="card bg-gray-50 dark:bg-[#141414] border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={20} className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Recommended Journey
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 items-stretch sm:items-center">
            {journeySteps.map((step, i) => (
              <div key={step.label} className="flex flex-col sm:flex-row items-center flex-1">
                <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 flex-1 py-3 sm:py-0 px-4 sm:px-2 text-left sm:text-center">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0', step.color)}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{step.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                  </div>
                </div>
                {i < journeySteps.length - 1 && (
                  <ChevronRight
                    size={20}
                    className="text-gray-300 dark:text-gray-600 shrink-0 rotate-90 sm:rotate-0 my-1 sm:my-0"
                  />
                )}
              </div>
            ))}
          </div>

          {pathway.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Lock size={13} /> After Your Primary Services — Unlock These Next
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {pathway.map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/services#${svc.id}`}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                  >
                    <Lightbulb size={14} className="text-orange-400 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-orange-500 transition-colors font-medium">
                      {svc.title}
                    </span>
                    <ChevronRight size={13} className="text-gray-300 dark:text-gray-600 ml-auto group-hover:text-orange-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Roles */}
        {recRoles.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Roles That Match Your Profile
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recRoles.map((role) => (
                <Link
                  key={role.id}
                  href={`/career/${role.id}`}
                  className="card-hover group flex flex-col"
                >
                  <div className="text-3xl mb-2">{role.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
                    {role.summary}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', {
                      'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400': role.demandLevel === 'Critical',
                      'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400': role.demandLevel === 'Very High',
                      'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400': role.demandLevel === 'High',
                    })}>
                      {role.demandLevel} Demand
                    </span>
                    <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                      Explore <ChevronRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lead capture */}
        {!leadSubmitted ? (
          <div className="card bg-gradient-to-br from-orange-500/10 to-orange-400/5 border-orange-200 dark:border-orange-500/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Get Your Results + Personalised Tips by Email
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We&apos;ll send a summary with additional guidance based on your blockers. No spam.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((f) => ({ ...f, name: e.target.value }))}
                className="form-input flex-1"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={leadForm.email}
                onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                className="form-input flex-1"
              />
              <button
                onClick={submitLead}
                disabled={!leadForm.name || !leadForm.email}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                Send Results
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
            <CheckCircle size={20} className="text-green-500" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Sent! Check your inbox for your personalised career summary.
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-2">
          <button onClick={restart} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={16} /> Retake Quiz
          </button>
          <Link href="/contact" className="btn-primary">
            Contact a Coach <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // ── QUESTION ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question <strong>{step}</strong> of {totalSteps}
          </span>
          <span className="text-sm font-bold text-orange-500">{progress}%</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {currentQuestion?.question}
        </h2>

        {/* Single choice */}
        {currentQuestion?.type === 'single' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  answers[currentQuestion.id] === opt.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={answers[currentQuestion.id] === opt.value}
                  onChange={() => handleSingle(currentQuestion.id, opt.value)}
                />
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                  answers[currentQuestion.id] === opt.value ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600'
                )}>
                  {answers[currentQuestion.id] === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={cn('text-sm font-medium', answers[currentQuestion.id] === opt.value ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-200')}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple choice */}
        {currentQuestion?.type === 'multiple' && currentQuestion.options && (
          <div className="space-y-2.5">
            <p className="text-xs text-gray-400 mb-4">Select all that apply</p>
            {currentQuestion.options.map((opt) => {
              const selected = ((answers[currentQuestion.id] as string[]) ?? []).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                    selected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={selected} onChange={() => handleMultiple(currentQuestion.id, opt.value)} />
                  <div className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0', selected ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600')}>
                    {selected && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className={cn('text-sm font-medium', selected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-200')}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* Scale */}
        {currentQuestion?.type === 'scale' && (
          <div className="py-4">
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>{currentQuestion.scaleLabels?.min}</span>
              <span>{currentQuestion.scaleLabels?.max}</span>
            </div>
            <div className="flex gap-2 sm:gap-3 justify-between">
              {Array.from(
                { length: (currentQuestion.scaleMax ?? 5) - (currentQuestion.scaleMin ?? 0) + 1 },
                (_, i) => i + (currentQuestion.scaleMin ?? 0)
              ).map((val) => (
                <button
                  key={val}
                  onClick={() => handleScale(currentQuestion.id, val)}
                  className={cn(
                    'flex-1 aspect-square rounded-xl font-bold text-lg transition-all',
                    answers[currentQuestion.id] === val
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/10'
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 ? (
          <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">
            <ChevronLeft size={16} /> Back
          </button>
        ) : <div />}
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={!canProceed()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {step === totalSteps ? 'See My Results' : 'Next'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
