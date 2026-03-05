import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  User, BookOpen, FileText, Trophy, Zap, BarChart2, Clock, ChevronRight,
  CheckCircle, Star, Shield, Bookmark, Briefcase, Target
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { computeProfileCompletion } from '@/lib/profile-completion';
import { BADGES } from '@/lib/gamification';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your LumaShift career dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirectTo=/dashboard');

  // Fetch all user data in parallel
  const [
    profileResult,
    activityResult,
    savedResult,
    quizResult,
    badgesResult,
    serviceResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('saved_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('quiz_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
    supabase.from('user_badges').select('*').eq('user_id', user.id).order('earned_at', { ascending: false }),
    supabase.from('service_interests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const activities = activityResult.data ?? [];
  const savedItems = savedResult.data ?? [];
  const latestQuiz = quizResult.data?.[0] ?? null;
  const userBadges = badgesResult.data ?? [];
  const serviceInterests = serviceResult.data ?? [];

  const completion = profile ? computeProfileCompletion(profile) : { score: 0, label: 'Beginner', missingFields: [], completedFields: [] };
  const totalPoints = profile?.total_points ?? 0;

  const savedBlogs = savedItems.filter((s) => s.item_type === 'blog_post');
  const savedResources = savedItems.filter((s) => s.item_type === 'resource');

  // Next action suggestions
  const suggestions: { text: string; href: string; icon: React.ReactNode }[] = [];
  if (completion.score < 70) {
    suggestions.push({ text: 'Complete your profile to unlock Career Ready', href: '/profile', icon: <User size={14} /> });
  }
  if (!latestQuiz) {
    suggestions.push({ text: 'Take the Cyber Confidence Quiz', href: '/quiz', icon: <BarChart2 size={14} /> });
  }
  if (savedBlogs.length === 0) {
    suggestions.push({ text: 'Read and save a blog post', href: '/blog', icon: <BookOpen size={14} /> });
  }
  if (savedResources.length < 3) {
    suggestions.push({ text: 'Save 3 resources to earn Resource Collector', href: '/resources', icon: <Bookmark size={14} /> });
  }
  if (activities.filter((a) => a.event_type === 'role_explored').length < 3) {
    suggestions.push({ text: 'Explore 3 career roles for Career Explorer badge', href: '/career/security-analyst', icon: <Target size={14} /> });
  }

  const completionColor =
    completion.score >= 70 ? 'bg-green-500' :
    completion.score >= 40 ? 'bg-orange-500' :
    'bg-red-400';

  const eventLabels: Record<string, string> = {
    blog_read: 'Read blog post',
    resource_view: 'Viewed resource',
    resource_saved: 'Saved resource',
    quiz_attempt: 'Completed quiz',
    role_explored: 'Explored career role',
    roles_compared: 'Compared roles',
    service_viewed: 'Viewed service',
    service_requested: 'Requested service',
    first_login: 'Joined LumaShift',
  };

  const allBadgeIds = new Set(userBadges.map((b) => b.badge_id));

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <section className="py-10 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-xl font-bold text-orange-500 border border-orange-200 dark:border-orange-500/20">
                {profile?.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  {profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Welcome to LumaShift'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/profile" className="btn-secondary text-sm py-2 px-4">
                <User size={15} /> Edit Profile
              </Link>
              <Link href="/quiz" className="btn-primary text-sm py-2 px-4">
                <BarChart2 size={15} /> Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Points', value: totalPoints, icon: <Star size={20} className="text-orange-500" />, color: 'text-orange-500' },
            { label: 'Badges Earned', value: userBadges.length, icon: <Trophy size={20} className="text-yellow-500" />, color: 'text-yellow-500' },
            { label: 'Items Saved', value: savedItems.length, icon: <Bookmark size={20} className="text-blue-500" />, color: 'text-blue-500' },
            { label: 'Profile Score', value: `${completion.score}%`, icon: <Shield size={20} className="text-green-500" />, color: 'text-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center gap-3 mb-2">
                {stat.icon}
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Completion */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={18} className="text-orange-500" /> Profile Completion
                </h2>
                <span className="text-sm font-bold text-orange-500">{completion.score}% — {completion.label}</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${completionColor}`}
                  style={{ width: `${completion.score}%` }}
                />
              </div>
              {completion.missingFields.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {completion.missingFields.slice(0, 4).map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-500/20">
                      Missing: {f}
                    </span>
                  ))}
                </div>
              )}
              <Link href="/profile" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
                Complete your profile <ChevronRight size={14} />
              </Link>
            </div>

            {/* Quiz Results */}
            {latestQuiz && (
              <div className="card">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart2 size={18} className="text-orange-500" /> Latest Quiz Results
                </h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-5xl font-black text-orange-500">{latestQuiz.confidence_score}</p>
                    <p className="text-xs text-gray-400 mt-1">out of 5</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Recommended Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(latestQuiz.recommended_roles as string[]).slice(0, 3).map((role) => (
                        <Link
                          key={role}
                          href={`/career/${role}`}
                          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          {role.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{formatDate(latestQuiz.created_at)}</div>
              </div>
            )}

            {/* Saved Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bookmark size={18} className="text-blue-500" /> Saved Items
                </h2>
                <span className="text-xs text-gray-400">{savedItems.length} total</span>
              </div>

              {savedItems.length === 0 ? (
                <div className="text-center py-6">
                  <Bookmark size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No saved items yet.</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Link href="/blog" className="text-xs text-orange-500 hover:underline">Browse Blog</Link>
                    <span className="text-gray-300">·</span>
                    <Link href="/resources" className="text-xs text-orange-500 hover:underline">Browse Resources</Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedBlogs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen size={11} /> Blog Posts ({savedBlogs.length})
                      </p>
                      {savedBlogs.slice(0, 3).map((item) => (
                        <Link
                          key={item.id}
                          href={`/blog/${item.item_id}`}
                          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <FileText size={14} className="text-orange-400 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors truncate">
                            {item.item_title}
                          </span>
                          <ChevronRight size={13} className="text-gray-300 dark:text-gray-600 ml-auto shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {savedResources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Bookmark size={11} /> Resources ({savedResources.length})
                      </p>
                      {savedResources.slice(0, 3).map((item) => (
                        <Link
                          key={item.id}
                          href="/resources"
                          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <FileText size={14} className="text-blue-400 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors truncate">
                            {item.item_title}
                          </span>
                          <ChevronRight size={13} className="text-gray-300 dark:text-gray-600 ml-auto shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Service Interests */}
            {serviceInterests.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-500" /> My Services
                </h2>
                <div className="space-y-2">
                  {serviceInterests.slice(0, 5).map((si) => (
                    <div key={si.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        si.interest_type === 'requested' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                        si.interest_type === 'viewed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' :
                        'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                      }`}>
                        {si.interest_type}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">{si.service_title}</span>
                      <span className="text-xs text-gray-400">{formatDate(si.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Feed */}
            {activities.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" /> Recent Activity
                </h2>
                <div className="space-y-1">
                  {activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        {activity.event_type === 'blog_read' && <BookOpen size={13} className="text-orange-400" />}
                        {activity.event_type === 'quiz_attempt' && <BarChart2 size={13} className="text-orange-400" />}
                        {activity.event_type === 'role_explored' && <Target size={13} className="text-blue-400" />}
                        {activity.event_type === 'resource_saved' && <Bookmark size={13} className="text-purple-400" />}
                        {activity.event_type === 'service_viewed' && <Briefcase size={13} className="text-green-400" />}
                        {!['blog_read','quiz_attempt','role_explored','resource_saved','service_viewed'].includes(activity.event_type) && (
                          <Zap size={13} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                          {eventLabels[activity.event_type] ?? activity.event_type}
                          {activity.item_title && `: ${activity.item_title}`}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                      </div>
                      {activity.points_awarded > 0 && (
                        <span className="text-xs font-bold text-orange-500 shrink-0">+{activity.points_awarded}pts</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Next Actions */}
            {suggestions.length > 0 && (
              <div className="card border-orange-200 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" /> Next Actions
                </h2>
                <div className="space-y-2.5">
                  {suggestions.slice(0, 4).map((s, i) => (
                    <Link
                      key={i}
                      href={s.href}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                    >
                      <div className="w-7 h-7 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                        {s.icon}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors flex-1 leading-tight">
                        {s.text}
                      </span>
                      <ChevronRight size={13} className="text-gray-300 dark:text-gray-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="card">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> Badges
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {BADGES.map((badge) => {
                  const earned = allBadgeIds.has(badge.id);
                  return (
                    <div
                      key={badge.id}
                      title={badge.description}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
                        earned
                          ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20'
                          : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 opacity-40'
                      }`}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-tight text-center">
                        {badge.name}
                      </span>
                      {earned && (
                        <CheckCircle size={10} className="text-orange-500" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {userBadges.length}/{BADGES.length} earned
              </p>
            </div>

            {/* Quick links */}
            <div className="card">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Quick Links</h2>
              <div className="space-y-1">
                {[
                  { href: '/blog', label: 'Read Blog Posts' },
                  { href: '/resources', label: 'Browse Resources' },
                  { href: '/compare-roles', label: 'Compare Roles' },
                  { href: '/services', label: 'View Services' },
                  { href: '/contact', label: 'Book a Coach' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {link.label}
                    <ChevronRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
