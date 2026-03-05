'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, MapPin, Briefcase, Target, Award, ChevronLeft,
  Loader2, CheckCircle, AlertCircle, Plus, X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { computeProfileCompletion } from '@/lib/profile-completion';

const CAREER_STAGES = [
  { value: 'student', label: 'Student' },
  { value: 'fresh_graduate', label: 'Fresh Graduate' },
  { value: 'entry_level', label: 'Entry Level (0–2 yrs)' },
  { value: 'mid_career', label: 'Mid-Career (3–7 yrs)' },
  { value: 'senior', label: 'Senior (8+ yrs)' },
  { value: 'career_switcher', label: 'Career Switcher' },
];

const ROLE_OPTIONS = [
  'Security Analyst', 'Security Engineer', 'GRC Analyst',
  'Cloud Security Engineer', 'SOC Analyst', 'OT/ICS Security Specialist',
  'Penetration Tester', 'Threat Intelligence Analyst', 'CISO',
];

const COMMON_SKILLS = [
  'SIEM', 'Threat Analysis', 'Incident Response', 'Vulnerability Assessment',
  'Network Security', 'Cloud Security', 'Risk Assessment', 'Compliance',
  'Python', 'Linux', 'Firewalls/IDS', 'Identity & Access Management',
];

const COMMON_CERTS = [
  'CompTIA Security+', 'CompTIA CySA+', 'CompTIA CASP+',
  'CEH', 'OSCP', 'CISSP', 'CISA', 'CISM', 'ISO 27001 LA',
  'AWS Security Specialty', 'Azure Security Engineer', 'GCP Security Engineer',
  'GIAC GCED', 'GIAC GSEC',
];

type Profile = {
  name: string;
  location: string;
  job_role: string;
  years_experience: string;
  career_stage: string;
  target_roles: string[];
  current_skills: string[];
  certifications_obtained: string[];
  certifications_planned: string[];
};

function TagInput({
  label, values, onChange, suggestions, placeholder
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const add = (val: string) => {
    const v = val.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setInput('');
  };

  const remove = (val: string) => onChange(values.filter((v) => v !== val));

  const filtered = suggestions.filter(
    (s) => !values.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-500/20">
            {v}
            <button onClick={() => remove(v)} className="hover:text-red-500 transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add(input))}
          placeholder={placeholder ?? `Type and press Enter`}
          className="form-input flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => add(input)}
          disabled={!input.trim()}
          className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <Plus size={14} />
        </button>
      </div>
      {input && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filtered.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-orange-50 hover:text-orange-500 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Profile>({
    name: '',
    location: '',
    job_role: '',
    years_experience: '',
    career_stage: '',
    target_roles: [],
    current_skills: [],
    certifications_obtained: [],
    certifications_planned: [],
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login?redirectTo=/profile'); return; }

      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name ?? '',
            location: data.location ?? '',
            job_role: data.job_role ?? '',
            years_experience: data.years_experience?.toString() ?? '',
            career_stage: data.career_stage ?? '',
            target_roles: data.target_roles ?? [],
            current_skills: data.current_skills ?? [],
            certifications_obtained: data.certifications_obtained ?? [],
            certifications_planned: data.certifications_planned ?? [],
          });
        }
        setLoading(false);
      });
    });
  }, [router]);

  const completion = computeProfileCompletion({
    ...form,
    years_experience: form.years_experience ? parseInt(form.years_experience) : null,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Failed to save');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Track activity
        await fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'profile_updated' }),
        });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  const completionColor =
    completion.score >= 70 ? 'bg-green-500' :
    completion.score >= 40 ? 'bg-orange-500' :
    'bg-red-400';

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <section className="py-10 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors"
          >
            <ChevronLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Edit Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Complete your profile to unlock badges and personalised recommendations.
          </p>

          {/* Completion bar */}
          <div className="mt-6 p-4 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Profile Completion</span>
              <span className="text-sm font-bold text-orange-500">{completion.score}% — {completion.label}</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${completionColor}`} style={{ width: `${completion.score}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSave} className="space-y-8">

          {/* Basic Info */}
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <User size={18} className="text-orange-500" /> Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-400" /> Location (optional)
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Kuala Lumpur, Malaysia"
                  className="form-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Career Info */}
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Briefcase size={18} className="text-orange-500" /> Career Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Current Job Role <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.job_role}
                  onChange={(e) => setForm((f) => ({ ...f, job_role: e.target.value }))}
                  placeholder="e.g. IT Support, Network Engineer"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={form.years_experience}
                  onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Career Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAREER_STAGES.map((stage) => (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, career_stage: stage.value }))}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 text-left transition-all ${
                      form.career_stage === stage.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cybersecurity Interests */}
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Target size={18} className="text-orange-500" /> Cybersecurity Interests
            </h2>
            <div className="space-y-5">
              <TagInput
                label="Target Cybersecurity Role(s)"
                values={form.target_roles}
                onChange={(v) => setForm((f) => ({ ...f, target_roles: v }))}
                suggestions={ROLE_OPTIONS}
                placeholder="Type a role or select below"
              />
              <TagInput
                label="Current Skills"
                values={form.current_skills}
                onChange={(v) => setForm((f) => ({ ...f, current_skills: v }))}
                suggestions={COMMON_SKILLS}
                placeholder="e.g. SIEM, Python, Risk Assessment"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Award size={18} className="text-orange-500" /> Certifications
            </h2>
            <div className="space-y-5">
              <TagInput
                label="Certifications Obtained"
                values={form.certifications_obtained}
                onChange={(v) => setForm((f) => ({ ...f, certifications_obtained: v }))}
                suggestions={COMMON_CERTS}
                placeholder="e.g. CompTIA Security+"
              />
              <TagInput
                label="Certifications Planned"
                values={form.certifications_planned}
                onChange={(v) => setForm((f) => ({ ...f, certifications_planned: v }))}
                suggestions={COMMON_CERTS.filter((c) => !form.certifications_obtained.includes(c))}
                placeholder="e.g. CISSP, OSCP"
              />
            </div>
          </div>

          {/* Save */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
              <CheckCircle size={18} className="text-green-500 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">Profile saved successfully!</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save Profile
            </button>
            <Link href="/dashboard" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
