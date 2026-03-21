'use client';

import { useState, useCallback } from 'react';
import {
  Sparkles,
  FileText,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Bot,
  LayoutDashboard,
  Loader2,
  Check,
  X,
  AlertTriangle,
  CheckSquare,
  BookOpen,
  FileCode,
  Lightbulb,
  Crown,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface GeneratedResource {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  category: string;
  free: boolean;
  download_url: string | null;
  published: boolean;
  generated_by_ai: boolean;
  author_id: string;
  created_at: string;
}

interface TopicSuggestion {
  title: string;
  description: string;
  category: string;
  audience: string;
}

interface ResourceAdminProps {
  initialResources: GeneratedResource[];
  userId: string;
}

const CATEGORIES = [
  'Resume & Job Search',
  'Interview Prep',
  'Certifications',
  'Personal Branding',
  'SOC / Blue Team',
  'GRC & Compliance',
  'Cloud Security',
  'Career Strategy',
  'OT / ICS Security',
  'General Security',
];

const RESOURCE_TYPES = [
  { value: 'checklist', label: 'Checklist', icon: CheckSquare },
  { value: 'guide', label: 'Guide', icon: BookOpen },
  { value: 'template', label: 'Template', icon: FileCode },
] as const;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ResourceAdmin({ initialResources, userId }: ResourceAdminProps) {
  const [resources, setResources] = useState<GeneratedResource[]>(initialResources);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Generator state
  const [topic, setTopic] = useState('');
  const [resourceType, setResourceType] = useState<'checklist' | 'guide' | 'template'>('checklist');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFree, setIsFree] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [lastGenId, setLastGenId] = useState<string | null>(null);

  // Topic suggestions state
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Editor state
  const [editDraft, setEditDraft] = useState<Record<string, Partial<GeneratedResource>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({});

  // Stats
  const totalResources = resources.length;
  const publishedResources = resources.filter((r) => r.published).length;
  const draftResources = totalResources - publishedResources;
  const aiResources = resources.filter((r) => r.generated_by_ai).length;
  const freeResources = resources.filter((r) => r.free).length;

  /* ─── Fetch fresh list ─────────────────────────────────────────────────── */

  const refreshResources = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources ?? []);
      }
    } catch {
      // silently fail
    }
  }, []);

  /* ─── Suggest Topics ───────────────────────────────────────────────────── */

  const handleSuggestTopics = async () => {
    setLoadingSuggestions(true);
    setSuggestError(null);

    try {
      const res = await fetch('/api/admin/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSuggestError(data.error ?? 'Failed to get suggestions');
        return;
      }

      setSuggestions(data.topics ?? []);
    } catch {
      setSuggestError('Network error — please try again');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const useSuggestion = (suggestion: TopicSuggestion) => {
    setTopic(suggestion.title);
    const matchedCategory = CATEGORIES.find(
      (c) => c.toLowerCase() === suggestion.category.toLowerCase()
    );
    if (matchedCategory) setCategory(matchedCategory);
    setSuggestions([]);
  };

  /* ─── Generate Resource ────────────────────────────────────────────────── */

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError(null);
    setLastGenId(null);

    try {
      const res = await fetch('/api/admin/generate-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          type: resourceType,
          category,
          free: isFree,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGenError(data.error ?? 'Failed to generate resource');
        return;
      }

      if (data.resource?.id) {
        setLastGenId(data.resource.id);
      }
      setTopic('');
      await refreshResources();
    } catch {
      setGenError('Network error — please try again');
    } finally {
      setGenerating(false);
    }
  };

  /* ─── Toggle publish ───────────────────────────────────────────────────── */

  const togglePublish = async (resource: GeneratedResource) => {
    setSaving(resource.id);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, published: !resource.published }),
      });
      if (res.ok) {
        setResources((prev) =>
          prev.map((r) => (r.id === resource.id ? { ...r, published: !r.published } : r))
        );
      }
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  };

  /* ─── Save edits ───────────────────────────────────────────────────────── */

  const saveResource = async (resourceId: string) => {
    const draft = editDraft[resourceId];
    if (!draft) return;
    setSaving(resourceId);

    try {
      const res = await fetch('/api/admin/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resourceId, ...draft }),
      });

      if (res.ok) {
        setResources((prev) =>
          prev.map((r) => (r.id === resourceId ? { ...r, ...draft } : r))
        );
        setEditDraft((prev) => {
          const next = { ...prev };
          delete next[resourceId];
          return next;
        });
      }
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  };

  /* ─── Delete ───────────────────────────────────────────────────────────── */

  const deleteResource = async (resourceId: string) => {
    setDeleting(resourceId);
    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(resourceId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== resourceId));
        setConfirmDelete(null);
        if (expandedId === resourceId) setExpandedId(null);
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  /* ─── Edit helpers ─────────────────────────────────────────────────────── */

  const getEditValue = <K extends keyof GeneratedResource>(
    resourceId: string,
    field: K,
    original: GeneratedResource[K]
  ) => {
    return (editDraft[resourceId]?.[field] ?? original) as GeneratedResource[K];
  };

  const setEditField = (resourceId: string, field: keyof GeneratedResource, value: unknown) => {
    setEditDraft((prev) => ({
      ...prev,
      [resourceId]: { ...prev[resourceId], [field]: value },
    }));
  };

  const hasUnsavedChanges = (resourceId: string) => {
    return editDraft[resourceId] && Object.keys(editDraft[resourceId]).length > 0;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return <CheckSquare size={12} />;
      case 'guide':
        return <BookOpen size={12} />;
      case 'template':
        return <FileCode size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  /* ─── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-white dark:bg-cyber-midnight cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">
              Resource Administration
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-[52px]">
            Generate, review, and publish AI-powered cybersecurity resources
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {[
              { label: 'Total', value: totalResources, color: 'text-gray-900 dark:text-white' },
              { label: 'Published', value: publishedResources, color: 'text-green-600 dark:text-green-400' },
              { label: 'Drafts', value: draftResources, color: 'text-gray-500 dark:text-gray-400' },
              { label: 'AI Generated', value: aiResources, color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Free', value: freeResources, color: 'text-orange-500' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/60 dark:bg-cyber-surface/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-cyber-border p-4"
              >
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Topic Suggestions Panel ─────────────────────────────────────── */}
        <div className="mb-6">
          <div className="bg-white/60 dark:bg-cyber-surface/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-cyber-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  AI Topic Suggestions
                </h3>
              </div>
              <button
                onClick={handleSuggestTopics}
                disabled={loadingSuggestions}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200',
                  loadingSuggestions
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/20'
                )}
              >
                {loadingSuggestions ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    Suggest 5 Topics
                  </>
                )}
              </button>
            </div>

            {suggestError && (
              <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-2 mb-3">
                <AlertTriangle size={14} />
                {suggestError}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => useSuggestion(s)}
                    className="w-full text-left bg-white dark:bg-cyber-card rounded-lg border border-gray-100 dark:border-cyber-border p-3 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {s.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {s.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                            {s.category}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {s.audience}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                        Use this
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── AI Generator Panel ─────────────────────────────────────────── */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-orange-500/10 to-cyan-500/20 blur-sm -z-10" />
          <div className="bg-white/80 dark:bg-cyber-card/80 backdrop-blur-md rounded-2xl border border-cyan-200 dark:border-cyan-500/20 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Sparkles size={18} className="text-cyan-500" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  AI Resource Generator
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate checklists, guides, and templates for cybersecurity professionals
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Topic */}
              <div className="md:col-span-2">
                <label className="form-label">
                  Topic <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What should the resource be about? Be specific for better results..."
                  rows={3}
                  className="form-input resize-none"
                  disabled={generating}
                />
              </div>

              {/* Resource Type */}
              <div>
                <label className="form-label">Resource Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {RESOURCE_TYPES.map((rt) => {
                    const Icon = rt.icon;
                    return (
                      <button
                        key={rt.value}
                        onClick={() => setResourceType(rt.value)}
                        disabled={generating}
                        className={cn(
                          'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200',
                          resourceType === rt.value
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        )}
                      >
                        <Icon size={14} />
                        {rt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  disabled={generating}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Free/Premium toggle */}
              <div className="md:col-span-2">
                <label className="form-label">Access Level</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFree(true)}
                    disabled={generating}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200',
                      isFree
                        ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <Gift size={14} />
                    Free
                  </button>
                  <button
                    onClick={() => setIsFree(false)}
                    disabled={generating}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200',
                      !isFree
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <Crown size={14} />
                    Premium
                  </button>
                </div>
              </div>
            </div>

            {genError && (
              <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-2 mb-4">
                <AlertTriangle size={14} />
                {genError}
              </div>
            )}

            {generating && (
              <div className="flex items-center gap-3 text-sm text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg px-4 py-3 mb-4 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                AI is generating your {resourceType}... This may take 15-30 seconds.
              </div>
            )}

            {lastGenId && !generating && (
              <div className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg px-4 py-3 mb-4">
                <Check size={16} />
                Resource generated successfully!
                <button
                  onClick={() => setExpandedId(lastGenId)}
                  className="ml-auto text-xs font-semibold text-green-700 dark:text-green-300 hover:underline"
                >
                  View Draft
                </button>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                generating || !topic.trim()
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0'
              )}
            >
              <Sparkles size={16} />
              {generating ? 'Generating...' : 'Generate Resource'}
            </button>
          </div>
        </div>

        {/* ── Resources List ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-orange-500" />
              Generated Resources ({totalResources})
            </h2>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-16 bg-white/60 dark:bg-cyber-surface/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-cyber-border">
              <FileText size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">No generated resources yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Use the AI generator above to create your first resource</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => {
                const isExpanded = expandedId === resource.id;

                return (
                  <div
                    key={resource.id}
                    className={cn(
                      'bg-white/60 dark:bg-cyber-surface/60 backdrop-blur-sm rounded-xl border transition-all duration-200',
                      isExpanded
                        ? 'border-orange-300 dark:border-orange-500/30 shadow-lg'
                        : 'border-gray-200 dark:border-cyber-border hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    {/* Row header */}
                    <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : resource.id)}
                        className="flex-1 flex items-center gap-3 text-left min-w-0"
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {resource.title}
                            </h3>
                            {hasUnsavedChanges(resource.id) && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-semibold">
                                Unsaved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-400">{resource.category}</span>
                            <span className="text-gray-200 dark:text-gray-700">|</span>
                            <span className="text-xs text-gray-400 capitalize">{resource.type}</span>
                            <span className="text-gray-200 dark:text-gray-700">|</span>
                            <span className="text-xs text-gray-400">
                              {new Date(resource.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        {resource.generated_by_ai && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                            <Bot size={10} /> AI
                          </span>
                        )}
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            resource.type === 'checklist'
                              ? 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                              : resource.type === 'guide'
                                ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                : 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          )}
                        >
                          {getTypeIcon(resource.type)}
                          {resource.type}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            resource.free
                              ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                              : 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                          )}
                        >
                          {resource.free ? 'Free' : 'Premium'}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            resource.published
                              ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                          )}
                        >
                          {resource.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePublish(resource)}
                          disabled={saving === resource.id}
                          title={resource.published ? 'Unpublish' : 'Publish'}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            resource.published
                              ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          {saving === resource.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : resource.published ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}
                        </button>

                        {confirmDelete === resource.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteResource(resource.id)}
                              disabled={deleting === resource.id}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Confirm delete"
                            >
                              {deleting === resource.id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Check size={15} />
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              title="Cancel"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(resource.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded editor */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-cyber-border px-4 py-5 md:px-6 md:py-6 space-y-5">
                        {/* Title & Description */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              value={getEditValue(resource.id, 'title', resource.title) as string}
                              onChange={(e) => setEditField(resource.id, 'title', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="form-label">Description</label>
                            <textarea
                              value={getEditValue(resource.id, 'description', resource.description) as string}
                              onChange={(e) => setEditField(resource.id, 'description', e.target.value)}
                              rows={2}
                              className="form-input resize-none"
                            />
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select
                              value={getEditValue(resource.id, 'category', resource.category) as string}
                              onChange={(e) => setEditField(resource.id, 'category', e.target.value)}
                              className="form-input"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Type</label>
                            <select
                              value={getEditValue(resource.id, 'type', resource.type) as string}
                              onChange={(e) => setEditField(resource.id, 'type', e.target.value)}
                              className="form-input"
                            >
                              {['checklist', 'guide', 'template', 'pdf', 'video'].map((t) => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Content Editor */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="form-label mb-0">Content (Markdown)</label>
                            <button
                              onClick={() =>
                                setPreviewMode((prev) => ({
                                  ...prev,
                                  [resource.id]: !prev[resource.id],
                                }))
                              }
                              className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                            >
                              {previewMode[resource.id] ? (
                                <>
                                  <FileText size={12} /> Editor
                                </>
                              ) : (
                                <>
                                  <Eye size={12} /> Preview
                                </>
                              )}
                            </button>
                          </div>

                          {previewMode[resource.id] ? (
                            <div
                              className="prose prose-sm prose-gray dark:prose-invert max-w-none bg-gray-50 dark:bg-cyber-midnight rounded-xl p-6 border border-gray-200 dark:border-cyber-border min-h-[300px] overflow-auto"
                              dangerouslySetInnerHTML={{
                                __html: markdownToHtml(
                                  getEditValue(resource.id, 'content', resource.content) as string
                                ),
                              }}
                            />
                          ) : (
                            <textarea
                              value={getEditValue(resource.id, 'content', resource.content) as string}
                              onChange={(e) => setEditField(resource.id, 'content', e.target.value)}
                              rows={16}
                              className="form-input font-mono text-sm resize-y min-h-[300px]"
                              spellCheck={false}
                            />
                          )}
                        </div>

                        {/* Action bar */}
                        <div className="flex items-center gap-3 flex-wrap pt-2">
                          <button
                            onClick={() => saveResource(resource.id)}
                            disabled={saving === resource.id || !hasUnsavedChanges(resource.id)}
                            className={cn(
                              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
                              hasUnsavedChanges(resource.id)
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            )}
                          >
                            {saving === resource.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Changes
                          </button>

                          <button
                            onClick={() => togglePublish(resource)}
                            disabled={saving === resource.id}
                            className={cn(
                              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
                              resource.published
                                ? 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                : 'border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10'
                            )}
                          >
                            {resource.published ? (
                              <>
                                <EyeOff size={14} /> Unpublish
                              </>
                            ) : (
                              <>
                                <Eye size={14} /> Publish
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              confirmDelete === resource.id
                                ? deleteResource(resource.id)
                                : setConfirmDelete(resource.id)
                            }
                            disabled={deleting === resource.id}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ml-auto"
                          >
                            {deleting === resource.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            {confirmDelete === resource.id ? 'Confirm Delete' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Simple Markdown to HTML ─────────────────────────────────────────────── */

function markdownToHtml(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<li class="task-done"><input type="checkbox" checked disabled /> $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="task"><input type="checkbox" disabled /> $1</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Paragraphs
    .replace(/^(?!<[a-z/])((?!^\s*$).+)$/gm, '<p>$1</p>');

  // Wrap adjacent <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  return html;
}
