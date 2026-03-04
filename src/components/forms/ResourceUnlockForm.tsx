'use client';

import { useState, FormEvent } from 'react';
import { Unlock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ResourceUnlockFormProps {
  onSuccess?: () => void;
}

const careerGoalOptions = [
  'Break into cybersecurity (no experience yet)',
  'Land my first cybersecurity job',
  'Move from IT to cybersecurity',
  'Get into SOC / Blue Team',
  'Pivot to GRC / Compliance',
  'Specialise in Cloud Security',
  'Advance to a senior or specialist role',
  'Start consulting / freelancing',
  'Explore OT / ICS security',
];

export function ResourceUnlockForm({ onSuccess }: ResourceUnlockFormProps) {
  const [form, setForm] = useState({ name: '', email: '', careerGoal: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Unknown error');
      setStatus('success');
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Access Granted!
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check your inbox — we&apos;re sending the premium resources and a personalised note.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="unlock-name">Full Name *</label>
        <input
          id="unlock-name"
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="unlock-email">Email Address *</label>
        <input
          id="unlock-email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="unlock-goal">Your Career Goal *</label>
        <select
          id="unlock-goal"
          required
          value={form.careerGoal}
          onChange={(e) => setForm((f) => ({ ...f, careerGoal: e.target.value }))}
          className="form-input"
        >
          <option value="">Select your goal...</option>
          {careerGoalOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === 'loading' ? (
          <><Loader size={15} className="animate-spin" /> Unlocking...</>
        ) : (
          <><Unlock size={15} /> Unlock Premium Resources</>
        )}
      </button>
    </form>
  );
}
