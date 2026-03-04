'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  BarChart2,
  MessageSquare,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { quizQuestions, computeQuizResult } from '@/data/quiz';
import { roles } from '@/data/roles';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';

type Answers = Record<string, string | string[] | number>;

export function QuizComponent() {
  const [step, setStep] = useState(0); // 0 = intro, 1..n = questions, n+1 = results
  const [answers, setAnswers] = useState<Answers>({});
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const totalSteps = quizQuestions.length;
  const isIntro = step === 0;
  const isResults = step > totalSteps;
  const currentQuestion = quizQuestions[step - 1];
  const progress = isResults ? 100 : Math.round(((step - 1) / totalSteps) * 100);

  const result = isResults ? computeQuizResult(answers) : null;

  const handleSingle = (qId: string, value: string) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
  };

  const handleMultiple = (qId: string, value: string) => {
    setAnswers((a) => {
      const prev = (a[qId] as string[]) ?? [];
      if (prev.includes(value)) {
        return { ...a, [qId]: prev.filter((v) => v !== value) };
      }
      if (prev.length >= 3) return a; // max 3
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
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
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
    } catch {
      // fail silently
    }
    setLeadSubmitted(true);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setLeadForm({ name: '', email: '' });
    setLeadSubmitted(false);
  };

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (isIntro) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-6">
          <BarChart2 size={32} className="text-orange-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Cybersecurity Career Quiz
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          7 questions. 3 minutes. Get a personalised confidence score, role recommendations, and the exact LumaShift services that match your situation.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          {[
            { icon: '⏱', label: '~3 minutes' },
            { icon: '🎯', label: 'Personalised results' },
            { icon: '🔒', label: 'No spam, ever' },
          ].map((item) => (
            <div key={item.label} className="card py-4">
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)} className="btn-primary text-lg px-8 py-4">
          Start the Quiz <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────────
  if (isResults && result) {
    const scoreColor =
      result.confidenceScore >= 4
        ? 'text-green-500'
        : result.confidenceScore >= 3
        ? 'text-yellow-500'
        : 'text-red-500';

    const scoreLabel =
      result.confidenceScore >= 4
        ? 'Strong Foundation'
        : result.confidenceScore >= 3
        ? 'Good Progress'
        : result.confidenceScore >= 2
        ? 'Needs Development'
        : 'Early Stage';

    const recRoles = roles.filter((r) => result.recommendedRoles.includes(r.id));
    const recServices = services.filter((s) => result.recommendedServices.includes(s.id));

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        {/* Score card */}
        <div className="card text-center py-10">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Your Confidence Score
          </p>
          <div className={cn('text-7xl font-black mb-2', scoreColor)}>
            {result.confidenceScore}
            <span className="text-3xl text-gray-400">/5</span>
          </div>
          <p className={cn('text-xl font-bold mb-4', scoreColor)}>{scoreLabel}</p>

          {/* Score bar */}
          <div className="max-w-xs mx-auto bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-6">
            <div
              className={cn(
                'h-3 rounded-full transition-all duration-1000',
                result.confidenceScore >= 4
                  ? 'bg-green-500'
                  : result.confidenceScore >= 3
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              )}
              style={{ width: `${(result.confidenceScore / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Talk to a coach */}
        {result.talkToCoach && (
          <div className="bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-300 dark:border-orange-500/40 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  We Recommend Talking to a Coach
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Based on your score and situation, a 1-on-1 consultation will give you much clearer direction than any guide or resource. It&apos;s 30 minutes that can change the next 5 years.
                </p>
                <Link href="/contact?service=career-consultation-30" className="btn-primary">
                  Contact Us Now <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Strengths & Gaps */}
        {(result.strengths.length > 0 || result.gaps.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {result.strengths.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.gaps.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" /> Areas to Focus On
                </h3>
                <ul className="space-y-2">
                  {result.gaps.map((g) => (
                    <li key={g} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-orange-500 mt-0.5">→</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Recommended roles */}
        {recRoles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Recommended Roles for You
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recRoles.map((role) => (
                <Link
                  key={role.id}
                  href={`/career/${role.id}`}
                  className="card-hover group"
                >
                  <div className="text-3xl mb-2">{role.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {role.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-orange-500 mt-3 font-medium">
                    Explore role <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommended services */}
        {recServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Recommended Services
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recServices.map((svc) => (
                <div key={svc.id} className="card flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{svc.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{svc.forWho}</p>
                    <Link
                      href={`/contact?service=${svc.id}`}
                      className="inline-flex items-center gap-1 text-xs text-orange-500 font-medium mt-2 hover:underline"
                    >
                      Contact us <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead capture */}
        {!leadSubmitted && (
          <div className="card bg-orange-50 dark:bg-orange-500/5 border-orange-100 dark:border-orange-500/20">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              Get Your Full Results by Email
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We&apos;ll send you a personalised summary plus additional tips for your specific situation. No spam.
            </p>
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
        )}

        {leadSubmitted && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
            <CheckCircle size={20} className="text-green-500" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Results sent! Check your inbox for your personalised career summary.
            </p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button onClick={restart} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={16} /> Retake Quiz
          </button>
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
          <span className="text-sm text-gray-400">Question {step} of {totalSteps}</span>
          <span className="text-sm font-semibold text-orange-500">{progress}%</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card mb-6 p-8">
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
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                    answers[currentQuestion.id] === opt.value
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  {answers[currentQuestion.id] === opt.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  answers[currentQuestion.id] === opt.value
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-200'
                )}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple choice */}
        {currentQuestion?.type === 'multiple' && currentQuestion.options && (
          <div className="space-y-2.5">
            <p className="text-xs text-gray-400 mb-4">Select all that apply (max 3 for role questions)</p>
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
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={() => handleMultiple(currentQuestion.id, opt.value)}
                  />
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0',
                      selected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {selected && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    selected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-200'
                  )}>
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
            <div className="flex gap-3 justify-between">
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
        ) : (
          <div />
        )}

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
