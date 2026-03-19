'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Loader2,
  Rocket,
  Clock,
  Wallet,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { roles } from '@/data/roles';

/* ─── Options ─────────────────────────────────────────────────────── */

const TIME_OPTIONS = [
  { value: '5hrs/week', label: '5 hrs / week', description: 'Steady pace' },
  { value: '10hrs/week', label: '10 hrs / week', description: 'Recommended' },
  { value: '20hrs/week', label: '20 hrs / week', description: 'Accelerated' },
  { value: 'full-time', label: 'Full-time', description: 'Intensive' },
] as const;

const BUDGET_OPTIONS = [
  { value: 'minimal', label: 'Minimal', description: 'Free resources only' },
  { value: 'moderate', label: 'Moderate', description: 'Some paid courses' },
  { value: 'flexible', label: 'Flexible', description: 'Premium training' },
] as const;

/* ─── Markdown renderer ───────────────────────────────────────────── */

function renderMarkdown(text: string) {
  // Split into lines and process
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-3 bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent"
        >
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={key++}
          className="font-heading text-xl font-semibold text-gray-900 dark:text-white mt-5 mb-2"
        >
          {line.slice(4)}
        </h3>,
      );
      continue;
    }

    // Bold line (like **Focus:** ...)
    if (line.startsWith('**') && line.includes(':**')) {
      const match = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
      if (match) {
        elements.push(
          <p key={key++} className="text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">{match[1]}:</span>{' '}
            {formatInlineMarkdown(match[2])}
          </p>,
        );
        continue;
      }
    }

    // Checkbox item
    if (line.match(/^- \[[ x]\] /)) {
      const checked = line.startsWith('- [x] ');
      const content = line.replace(/^- \[[ x]\] /, '');
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2 mb-1">
          <span
            className={cn(
              'mt-1 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs',
              checked
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-400 dark:border-gray-600',
            )}
          >
            {checked && <Check size={10} />}
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {formatInlineMarkdown(content)}
          </span>
        </div>,
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const content = line.replace(/^\d+\.\s/, '');
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={key++} className="flex items-start gap-3 ml-2 mb-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 dark:bg-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center mt-0.5">
            {num}
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {formatInlineMarkdown(content)}
          </span>
        </div>,
      );
      continue;
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const content = line.slice(2);
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2 mb-1">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {formatInlineMarkdown(content)}
          </span>
        </div>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={key++} className="text-gray-700 dark:text-gray-300 mb-2 text-sm leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>,
    );
  }

  return elements;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Process bold, italic, and inline code
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let inlineKey = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find earliest match
    const boldIdx = boldMatch?.index ?? Infinity;
    const codeIdx = codeMatch?.index ?? Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldMatch) {
      parts.push(remaining.slice(0, boldIdx));
      parts.push(
        <strong key={`b${inlineKey++}`} className="font-semibold text-gray-900 dark:text-white">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      parts.push(remaining.slice(0, codeIdx));
      parts.push(
        <code
          key={`c${inlineKey++}`}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-400 text-xs font-mono"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeIdx + codeMatch[0].length);
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

/* ─── Select component ────────────────────────────────────────────── */

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string; description?: string }[];
  icon: React.ReactNode;
  label: string;
}

function Select({ value, onChange, options, icon, label }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all',
          'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border',
          'hover:border-orange-400 dark:hover:border-orange-500/50',
          open && 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-400/20',
        )}
      >
        <span className="text-orange-500">{icon}</span>
        <span className="flex-1 text-gray-900 dark:text-white font-medium">
          {selected?.label ?? 'Select...'}
        </span>
        {selected?.description && (
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
            {selected.description}
          </span>
        )}
        <ChevronDown
          size={16}
          className={cn('text-gray-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg overflow-hidden animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors',
                'hover:bg-orange-50 dark:hover:bg-orange-500/10',
                value === opt.value && 'bg-orange-50 dark:bg-orange-500/10',
              )}
            >
              <span
                className={cn(
                  'font-medium',
                  value === opt.value
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-900 dark:text-white',
                )}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {opt.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */

export function PlanGenerator() {
  const [targetRole, setTargetRole] = useState(roles[0].id);
  const [timeCommitment, setTimeCommitment] = useState('10hrs/week');
  const [budget, setBudget] = useState('moderate');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.title,
    description: r.demandLevel,
  }));

  const handleGenerate = useCallback(async () => {
    // Abort any previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setPlan('');

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, timeCommitment, budget }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        setError('Please log in to generate a personalised career plan.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong.' }));
        setError(data.error || 'Failed to generate plan.');
        setLoading(false);
        return;
      }

      const contentType = res.headers.get('Content-Type') ?? '';

      // Handle fallback JSON response (no API key)
      if (contentType.includes('application/json')) {
        const data = await res.json();
        setPlan(data.plan ?? '');
        setLoading(false);
        return;
      }

      // Stream the text response
      const reader = res.body?.getReader();
      if (!reader) {
        setError('Failed to read response stream.');
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setPlan(accumulated);

        // Auto-scroll to bottom of plan
        if (planRef.current) {
          planRef.current.scrollTop = planRef.current.scrollHeight;
        }
      }

      setLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('[PlanGenerator]', err);
      setError('Failed to generate plan. Please try again.');
      setLoading(false);
    }
  }, [targetRole, timeCommitment, budget]);

  const handleCopy = useCallback(async () => {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = plan;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [plan]);

  return (
    <div className="space-y-6">
      {/* ── Form card ── */}
      <div
        className={cn(
          'relative rounded-2xl p-6 sm:p-8 overflow-hidden',
          'bg-white/70 dark:bg-white/[0.04]',
          'backdrop-blur-xl',
          'border border-gray-200/60 dark:border-white/[0.08]',
          'shadow-lg shadow-black/5 dark:shadow-black/20',
        )}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-cyan-500 to-orange-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
              AI Career Plan Generator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get a personalised study plan powered by AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Select
            value={targetRole}
            onChange={setTargetRole}
            options={roleOptions}
            icon={<Target size={16} />}
            label="Target Role"
          />
          <Select
            value={timeCommitment}
            onChange={setTimeCommitment}
            options={TIME_OPTIONS}
            icon={<Clock size={16} />}
            label="Time Commitment"
          />
          <Select
            value={budget}
            onChange={setBudget}
            options={BUDGET_OPTIONS}
            icon={<Wallet size={16} />}
            label="Budget"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            'w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all',
            'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            'text-white shadow-lg shadow-orange-500/25',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
            'hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5',
            'active:translate-y-0',
          )}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Rocket size={18} />
              Generate My Plan
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* ── Loading state ── */}
      {loading && !plan && (
        <div
          className={cn(
            'rounded-2xl p-8 sm:p-12 text-center',
            'bg-white/70 dark:bg-white/[0.04]',
            'backdrop-blur-xl',
            'border border-gray-200/60 dark:border-white/[0.08]',
          )}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 mb-4">
            <Sparkles size={28} className="text-orange-500 animate-pulse" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Crafting your career plan...
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Analysing your profile, skills, and target role to create a personalised roadmap.
          </p>
          <div className="mt-6 flex justify-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-orange-500"
                style={{
                  animation: 'pulse 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Plan output ── */}
      {plan && (
        <div
          className={cn(
            'relative rounded-2xl overflow-hidden',
            'bg-white/70 dark:bg-white/[0.04]',
            'backdrop-blur-xl',
            'border border-gray-200/60 dark:border-white/[0.08]',
            'shadow-lg shadow-black/5 dark:shadow-black/20',
          )}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200/60 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Your Career Plan
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1 text-xs text-orange-500">
                  <Loader2 size={12} className="animate-spin" />
                  streaming...
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              disabled={loading}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                'hover:bg-gray-100 dark:hover:bg-white/[0.06]',
                'text-gray-600 dark:text-gray-400',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                copied && 'text-green-600 dark:text-green-400',
              )}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Export as Text
                </>
              )}
            </button>
          </div>

          {/* Plan content */}
          <div
            ref={planRef}
            className="px-6 py-6 sm:px-8 sm:py-8 max-h-[70vh] overflow-y-auto prose-sm"
          >
            {renderMarkdown(plan)}

            {/* Streaming cursor */}
            {loading && (
              <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse rounded-sm ml-0.5 -mb-0.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
