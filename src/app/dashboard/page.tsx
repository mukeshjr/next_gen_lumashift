import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  User, BookOpen, FileText, Trophy, Zap, BarChart2, Clock, ChevronRight,
  CheckCircle, Star, Shield, Bookmark, Briefcase, Target, Sparkles,
  UserCircle, ClipboardCheck, MessageSquare, Phone, Map, BarChart3,
  Linkedin, TrendingUp, ArrowRight, ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { computeProfileCompletion } from '@/lib/profile-completion';
import { BADGES } from '@/lib/gamification';
import { formatDate, cn } from '@/lib/utils';
import { generateRecommendations } from '@/lib/recommendations';
import type { RecommendationInput, NextAction } from '@/lib/recommendations';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your LumaShift career dashboard',
};

/* ─── Icon Resolver ────────────────────────────────────────────────────────── */

const ICON_MAP: Record<string, React.ReactNode> = {
  UserCircle:     <UserCircle size={14} />,
  ClipboardCheck: <ClipboardCheck size={14} />,
  FileText:       <FileText size={14} />,
  MessageSquare:  <MessageSquare size={14} />,
  Linkedin:       <Linkedin size={14} />,
  Phone:          <Phone size={14} />,
  BookOpen:       <BookOpen size={14} />,
  Map:            <Map size={14} />,
  BarChart3:      <BarChart3 size={14} />,
  Bookmark:       <Bookmark size={14} />,
};

function getActionIcon(iconName: string): React.ReactNode {
  return ICON_MAP[iconName] ?? <Zap size={14} />;
}

/* ─── Priority Badge ───────────────────────────────────────────────────────── */

function PriorityBadge({ priority }: { priority: NextAction['priority'] }) {
  const variant =
    priority === 'urgent' ? 'destructive' as const :
    priority === 'high' ? 'brand' as const :
    'muted' as const;
  return (
    <Badge variant={variant} className="text-[10px] uppercase tracking-wider">
      {priority}
    </Badge>
  );
}

/* ─── Match Score Badge ────────────────────────────────────────────────────── */

function MatchBadge({ score }: { score: number }) {
  const variant =
    score >= 70 ? 'success' as const :
    score >= 40 ? 'brand' as const :
    'muted' as const;
  return (
    <Badge variant={variant} className="tabular-nums">
      {score}% match
    </Badge>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */

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

  // ─── Generate Smart Recommendations ─────────────────────────────────────
  const readBlogSlugs = activities
    .filter((a) => a.event_type === 'blog_read' && a.item_id)
    .map((a) => a.item_id as string);

  const recommendationInput: RecommendationInput = {
    profile: profile
      ? {
          career_stage: profile.career_stage ?? null,
          target_roles: (profile.target_roles as string[]) ?? [],
          current_skills: (profile.current_skills as string[]) ?? [],
          years_experience: profile.years_experience ?? null,
          certifications_obtained: (profile.certifications_obtained as string[]) ?? [],
          certifications_planned: (profile.certifications_planned as string[]) ?? [],
          job_role: profile.job_role ?? null,
        }
      : null,
    quizResult: latestQuiz
      ? {
          confidence_score: latestQuiz.confidence_score as number,
          recommended_roles: (latestQuiz.recommended_roles as string[]) ?? [],
          recommended_services: (latestQuiz.recommended_services as string[]) ?? [],
          strengths: (latestQuiz.strengths as string[]) ?? [],
          gaps: (latestQuiz.gaps as string[]) ?? [],
          talk_to_coach: latestQuiz.talk_to_coach as boolean,
        }
      : null,
    profileScore: completion.score,
    activitiesCompleted: activities.map((a) => a.event_type as string),
    savedItemIds: savedItems.map((s) => s.item_id as string),
    readBlogSlugs,
  };

  const recommendations = generateRecommendations(recommendationInput);

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
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="py-10 bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 rounded-2xl border border-orange-200 dark:border-orange-500/20">
                <AvatarFallback className="rounded-2xl bg-orange-500/10 text-xl font-bold text-orange-500">
                  {profile?.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-black text-foreground">
                  {profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Welcome to LumaShift'}
                </h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/profile">
                <Button variant="brandOutline" size="brand-sm">
                  <User size={15} /> Edit Profile
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="brand" size="brand-sm">
                  <BarChart2 size={15} /> Take Quiz
                </Button>
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
            <Card key={stat.label}>
              <CardContent className="pt-2">
                <div className="flex items-center gap-3 mb-2">
                  {stat.icon}
                  <span className="text-caption text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Completion */}
            <Card>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <User size={18} className="text-orange-500" /> Profile Completion
                  </h2>
                  <span className="text-sm font-bold text-orange-500">{completion.score}% &mdash; {completion.label}</span>
                </div>
                <Progress value={completion.score} max={100}>
                  <ProgressTrack className="h-3 rounded-full">
                    <ProgressIndicator className={`rounded-full transition-all duration-700 ${completionColor}`} />
                  </ProgressTrack>
                </Progress>
                {completion.missingFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {completion.missingFields.slice(0, 4).map((f) => (
                      <Badge key={f} variant="brand">Missing: {f}</Badge>
                    ))}
                  </div>
                )}
                <Link href="/profile" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 mt-2">
                  Complete your profile <ChevronRight size={14} />
                </Link>
              </CardContent>
            </Card>

            {/* Recommended For You — Services */}
            {recommendations.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={18} className="text-orange-500" /> Recommended Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {recommendations.services.map((svc) => (
                      <Link
                        key={svc.serviceId}
                        href="/services"
                        className="group flex flex-col p-4 rounded-xl border border-border bg-muted/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-caption text-muted-foreground">{svc.tier}</span>
                          <MatchBadge score={svc.matchScore} />
                        </div>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-orange-500 transition-colors mb-1 leading-tight">
                          {svc.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">
                          {svc.reason}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-bold text-orange-500">{svc.price}</span>
                          <ArrowRight size={13} className="text-muted-foreground/40 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Content */}
            {recommendations.content.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={18} className="text-orange-500" /> Recommended Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations.content.map((item) => (
                      <Link
                        key={item.id}
                        href={item.type === 'blog' ? `/blog/${item.id}` : '/resources'}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          item.type === 'blog'
                            ? 'bg-orange-100 dark:bg-orange-500/10'
                            : 'bg-blue-100 dark:bg-blue-500/10'
                        )}>
                          {item.type === 'blog'
                            ? <FileText size={14} className="text-orange-500" />
                            : <Bookmark size={14} className="text-blue-500" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge variant={item.type === 'blog' ? 'brand' : 'info'} className="text-[10px]">
                              {item.type}
                            </Badge>
                            <MatchBadge score={item.relevanceScore} />
                          </div>
                          <p className="text-sm font-medium text-foreground group-hover:text-orange-500 transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{item.reason}</p>
                        </div>
                        <ExternalLink size={13} className="text-muted-foreground/40 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Roles */}
            {recommendations.roles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={18} className="text-orange-500" /> Roles For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recommendations.roles.map((role) => (
                      <Link
                        key={role.roleId}
                        href={`/career/${role.roleId}`}
                        className="group flex flex-col p-4 rounded-xl border border-border bg-muted/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-orange-500 transition-colors">
                            {role.title}
                          </h3>
                          <MatchBadge score={role.fitScore} />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                          {role.matchReason}
                        </p>
                        <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-orange-500">
                          View role details <ArrowRight size={12} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Results */}
            {latestQuiz && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-orange-500" /> Latest Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <p className="text-5xl font-black text-orange-500">{latestQuiz.confidence_score}</p>
                      <p className="text-xs text-muted-foreground mt-1">out of 5</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-2">Recommended Roles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(latestQuiz.recommended_roles as string[]).slice(0, 3).map((role) => (
                          <Link key={role} href={`/career/${role}`}>
                            <Badge variant="muted" className="hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer">
                              {role.replace(/-/g, ' ')}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(latestQuiz.created_at)}</div>
                </CardContent>
              </Card>
            )}

            {/* Saved Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bookmark size={18} className="text-blue-500" /> Saved Items
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">{savedItems.length} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedItems.length === 0 ? (
                  <div className="text-center py-6">
                    <Bookmark size={28} className="text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No saved items yet.</p>
                    <div className="flex gap-2 justify-center mt-3">
                      <Link href="/blog" className="text-xs text-orange-500 hover:underline">Browse Blog</Link>
                      <span className="text-muted-foreground/30">&middot;</span>
                      <Link href="/resources" className="text-xs text-orange-500 hover:underline">Browse Resources</Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedBlogs.length > 0 && (
                      <div className="mb-3">
                        <p className="text-caption text-muted-foreground mb-2 flex items-center gap-1.5">
                          <BookOpen size={11} /> Blog Posts ({savedBlogs.length})
                        </p>
                        {savedBlogs.slice(0, 3).map((item) => (
                          <Link
                            key={item.id}
                            href={`/blog/${item.item_id}`}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <FileText size={14} className="text-orange-400 shrink-0" />
                            <span className="text-sm text-foreground/80 group-hover:text-orange-500 transition-colors truncate">
                              {item.item_title}
                            </span>
                            <ChevronRight size={13} className="text-muted-foreground/40 ml-auto shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                    {savedResources.length > 0 && (
                      <div>
                        <p className="text-caption text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Bookmark size={11} /> Resources ({savedResources.length})
                        </p>
                        {savedResources.slice(0, 3).map((item) => (
                          <Link
                            key={item.id}
                            href="/resources"
                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <FileText size={14} className="text-blue-400 shrink-0" />
                            <span className="text-sm text-foreground/80 group-hover:text-orange-500 transition-colors truncate">
                              {item.item_title}
                            </span>
                            <ChevronRight size={13} className="text-muted-foreground/40 ml-auto shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Interests */}
            {serviceInterests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase size={18} className="text-purple-500" /> My Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {serviceInterests.slice(0, 5).map((si) => (
                      <div key={si.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted">
                        <Badge variant={
                          si.interest_type === 'requested' ? 'brand' :
                          si.interest_type === 'viewed' ? 'muted' :
                          'success'
                        }>
                          {si.interest_type}
                        </Badge>
                        <span className="text-sm text-foreground/80 flex-1 truncate">{si.service_title}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(si.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Feed */}
            {activities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={18} className="text-muted-foreground" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {activities.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                        <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          {activity.event_type === 'blog_read' && <BookOpen size={13} className="text-orange-400" />}
                          {activity.event_type === 'quiz_attempt' && <BarChart2 size={13} className="text-orange-400" />}
                          {activity.event_type === 'role_explored' && <Target size={13} className="text-blue-400" />}
                          {activity.event_type === 'resource_saved' && <Bookmark size={13} className="text-purple-400" />}
                          {activity.event_type === 'service_viewed' && <Briefcase size={13} className="text-green-400" />}
                          {!['blog_read','quiz_attempt','role_explored','resource_saved','service_viewed'].includes(activity.event_type) && (
                            <Zap size={13} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground/80 truncate">
                            {eventLabels[activity.event_type] ?? activity.event_type}
                            {activity.item_title && `: ${activity.item_title}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
                        </div>
                        {activity.points_awarded > 0 && (
                          <span className="text-xs font-bold text-orange-500 shrink-0">+{activity.points_awarded}pts</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Smart Next Actions */}
            {recommendations.nextActions.length > 0 && (
              <Card className="border-orange-200 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={18} className="text-orange-500" /> Next Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {recommendations.nextActions.map((action) => (
                      <Link
                        key={action.id}
                        href={action.href}
                        className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                      >
                        <div className="w-7 h-7 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                          {getActionIcon(action.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-foreground/80 group-hover:text-orange-500 transition-colors leading-tight">
                              {action.title}
                            </span>
                            <PriorityBadge priority={action.priority} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                        </div>
                        <ChevronRight size={13} className="text-muted-foreground/40 shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-500" /> Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {BADGES.map((badge) => {
                    const earned = allBadgeIds.has(badge.id);
                    return (
                      <div
                        key={badge.id}
                        title={badge.description}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all',
                          earned
                            ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20'
                            : 'bg-muted border border-border opacity-40'
                        )}
                      >
                        <span className="text-xl">{badge.icon}</span>
                        <span className="text-[10px] font-semibold text-foreground/70 leading-tight text-center">
                          {badge.name}
                        </span>
                        {earned && (
                          <CheckCircle size={10} className="text-orange-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {userBadges.length}/{BADGES.length} earned
                </p>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
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
                      className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-orange-500 hover:bg-muted transition-colors"
                    >
                      {link.label}
                      <ChevronRight size={13} />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
