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
  Plus,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface AdminBlogPost extends BlogPost {
  id?: string;
  generated_by_ai?: boolean;
}

interface BlogAdminProps {
  initialPosts: AdminBlogPost[];
  staticPostCount: number;
  userId: string;
}

const CATEGORIES = [
  'Career Guide',
  'Technical Concepts',
  'Certifications',
  'Malaysia Market',
  'AI Security',
  'Security Awareness',
  'Cloud Security',
  'Interview Tips',
  'GRC & Compliance',
];

const AUDIENCES = [
  'Students',
  'Fresh Graduates',
  'Early Career',
  'Mid-Career',
  'Career Switchers',
];

const TONES = ['Practical', 'Technical', 'Inspirational'];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function BlogAdmin({ initialPosts, staticPostCount, userId }: BlogAdminProps) {
  const [posts, setPosts] = useState<AdminBlogPost[]>(initialPosts);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Generator state
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [lastGenSlug, setLastGenSlug] = useState<string | null>(null);

  // Editor state
  const [editDraft, setEditDraft] = useState<Record<string, Partial<AdminBlogPost>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({});

  // Stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = totalPosts - publishedPosts;
  const aiPosts = posts.filter((p) => p.generated_by_ai).length;

  /* ─── Fetch fresh list ─────────────────────────────────────────────────── */

  const refreshPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        // Map snake_case DB rows to camelCase client shape
        const mapped = (data.posts ?? []).map((row: Record<string, unknown>) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          category: row.category,
          tags: row.tags ?? [],
          author: row.author,
          date: row.date,
          readTime: row.read_time ?? row.readTime ?? '5 min read',
          published: row.published,
          coverImage: row.cover_image ?? row.coverImage ?? undefined,
          visualType: row.visual_type ?? row.visualType ?? undefined,
          keyTakeaways: row.key_takeaways ?? row.keyTakeaways ?? undefined,
          generated_by_ai: row.generated_by_ai ?? false,
        }));
        setPosts(mapped);
      }
    } catch {
      // silently fail — stale list is acceptable
    }
  }, []);

  /* ─── Generate ─────────────────────────────────────────────────────────── */

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError(null);
    setLastGenSlug(null);

    try {
      const res = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, targetAudience: audience, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGenError(data.error ?? 'Failed to generate blog post');
        return;
      }

      setLastGenSlug(data.post?.slug ?? null);
      setTopic('');
      await refreshPosts();
    } catch (err) {
      setGenError('Network error — please try again');
    } finally {
      setGenerating(false);
    }
  };

  /* ─── Toggle publish ───────────────────────────────────────────────────── */

  const togglePublish = async (post: AdminBlogPost) => {
    if (!post.id) return;
    setSaving(post.id);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
        );
      }
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  };

  /* ─── Save edits ───────────────────────────────────────────────────────── */

  const savePost = async (postId: string) => {
    const draft = editDraft[postId];
    if (!draft) return;
    setSaving(postId);

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, ...draft }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, ...draft } : p))
        );
        setEditDraft((prev) => {
          const next = { ...prev };
          delete next[postId];
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

  const deletePost = async (postId: string) => {
    setDeleting(postId);
    try {
      const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(postId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setConfirmDelete(null);
        if (expandedId === postId) setExpandedId(null);
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  /* ─── Edit helpers ─────────────────────────────────────────────────────── */

  const getEditValue = <K extends keyof AdminBlogPost>(postId: string, field: K, original: AdminBlogPost[K]) => {
    return (editDraft[postId]?.[field] ?? original) as AdminBlogPost[K];
  };

  const setEditField = (postId: string, field: keyof AdminBlogPost, value: unknown) => {
    setEditDraft((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], [field]: value },
    }));
  };

  const hasUnsavedChanges = (postId: string) => {
    return editDraft[postId] && Object.keys(editDraft[postId]).length > 0;
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
              Blog Administration
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-[52px]">
            Generate, review, edit, and publish blog content
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {[
              { label: 'DB Posts', value: totalPosts, color: 'text-gray-900 dark:text-white' },
              { label: 'Published', value: publishedPosts, color: 'text-green-600 dark:text-green-400' },
              { label: 'Drafts', value: draftPosts, color: 'text-gray-500 dark:text-gray-400' },
              { label: 'AI Generated', value: aiPosts, color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Static Posts', value: staticPostCount, color: 'text-orange-500' },
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
                  AI Blog Generator
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by Claude — generates a full draft ready for review
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="form-label">
                  Topic <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What should the blog post be about? Be specific for better results..."
                  rows={3}
                  className="form-input resize-none"
                  disabled={generating}
                />
              </div>
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
              <div>
                <label className="form-label">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="form-input"
                  disabled={generating}
                >
                  {AUDIENCES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="form-input"
                  disabled={generating}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
                AI is writing your blog post... This may take 15-30 seconds.
              </div>
            )}

            {lastGenSlug && !generating && (
              <div className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg px-4 py-3 mb-4">
                <Check size={16} />
                Blog post generated successfully!
                <button
                  onClick={() => {
                    const post = posts.find((p) => p.slug === lastGenSlug);
                    if (post?.id) setExpandedId(post.id);
                  }}
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
              {generating ? 'Generating...' : 'Generate Blog Post'}
            </button>
          </div>
        </div>

        {/* ── Posts List ──────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-orange-500" />
              Blog Posts ({totalPosts})
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white/60 dark:bg-cyber-surface/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-cyber-border">
              <FileText size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">No blog posts in the database yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Use the AI generator above to create your first post</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => {
                const isExpanded = expandedId === post.id;
                const postId = post.id ?? '';

                return (
                  <div
                    key={postId}
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
                        onClick={() => setExpandedId(isExpanded ? null : postId)}
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
                              {post.title}
                            </h3>
                            {hasUnsavedChanges(postId) && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-semibold">
                                Unsaved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-400">{post.category}</span>
                            <span className="text-gray-200 dark:text-gray-700">|</span>
                            <span className="text-xs text-gray-400">{post.date}</span>
                          </div>
                        </div>
                      </button>

                      {/* Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        {post.generated_by_ai && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                            <Bot size={10} /> AI
                          </span>
                        )}
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            post.published
                              ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                          )}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePublish(post)}
                          disabled={saving === postId}
                          title={post.published ? 'Unpublish' : 'Publish'}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            post.published
                              ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          {saving === postId ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : post.published ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}
                        </button>

                        {confirmDelete === postId ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deletePost(postId)}
                              disabled={deleting === postId}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Confirm delete"
                            >
                              {deleting === postId ? (
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
                            onClick={() => setConfirmDelete(postId)}
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
                        {/* Title & Excerpt */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              value={getEditValue(postId, 'title', post.title) as string}
                              onChange={(e) => setEditField(postId, 'title', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="form-label">Excerpt</label>
                            <textarea
                              value={getEditValue(postId, 'excerpt', post.excerpt) as string}
                              onChange={(e) => setEditField(postId, 'excerpt', e.target.value)}
                              rows={2}
                              className="form-input resize-none"
                            />
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <select
                              value={getEditValue(postId, 'category', post.category) as string}
                              onChange={(e) => setEditField(postId, 'category', e.target.value)}
                              className="form-input"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Tags (comma-separated)</label>
                            <input
                              type="text"
                              value={(getEditValue(postId, 'tags', post.tags) as string[]).join(', ')}
                              onChange={(e) =>
                                setEditField(
                                  postId,
                                  'tags',
                                  e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                                )
                              }
                              className="form-input"
                            />
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
                                  [postId]: !prev[postId],
                                }))
                              }
                              className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                            >
                              {previewMode[postId] ? (
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

                          {previewMode[postId] ? (
                            <div
                              className="prose prose-sm prose-gray dark:prose-invert max-w-none bg-gray-50 dark:bg-cyber-midnight rounded-xl p-6 border border-gray-200 dark:border-cyber-border min-h-[300px] overflow-auto"
                              dangerouslySetInnerHTML={{
                                __html: markdownToHtml(
                                  getEditValue(postId, 'content', post.content) as string
                                ),
                              }}
                            />
                          ) : (
                            <textarea
                              value={getEditValue(postId, 'content', post.content) as string}
                              onChange={(e) => setEditField(postId, 'content', e.target.value)}
                              rows={16}
                              className="form-input font-mono text-sm resize-y min-h-[300px]"
                              spellCheck={false}
                            />
                          )}
                        </div>

                        {/* Action bar */}
                        <div className="flex items-center gap-3 flex-wrap pt-2">
                          <button
                            onClick={() => savePost(postId)}
                            disabled={saving === postId || !hasUnsavedChanges(postId)}
                            className={cn(
                              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
                              hasUnsavedChanges(postId)
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            )}
                          >
                            {saving === postId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Changes
                          </button>

                          <button
                            onClick={() => togglePublish(post)}
                            disabled={saving === postId}
                            className={cn(
                              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
                              post.published
                                ? 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                : 'border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10'
                            )}
                          >
                            {post.published ? (
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
                              confirmDelete === postId
                                ? deletePost(postId)
                                : setConfirmDelete(postId)
                            }
                            disabled={deleting === postId}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ml-auto"
                          >
                            {deleting === postId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            {confirmDelete === postId ? 'Confirm Delete' : 'Delete Post'}
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
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Paragraphs (lines that aren't already HTML)
    .replace(/^(?!<[a-z/])((?!^\s*$).+)$/gm, '<p>$1</p>');

  // Wrap adjacent <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  return html;
}
