import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Target,
  Zap,
  Users,
  BarChart2,
  Star,
  CheckCircle2,
  Map,
  TrendingUp,
  Trophy,
  Fingerprint,
  Cpu,
  Network,
} from 'lucide-react';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BlogCard } from '@/components/blog/BlogCard';
import { services } from '@/data/services';
import { getPublishedPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection, AnimatedHero } from '@/components/home/HomeAnimations';

export const metadata: Metadata = {
  title: 'LumaShift – Cybersecurity Career Coaching',
  description:
    'Expert cybersecurity career coaching for Malaysian and global professionals. Resume reviews, mock interviews, career consultations, and specialist coaching tracks.',
};

const stats = [
  { value: '50+', label: 'Professionals coached' },
  { value: '95%', label: 'Interview-to-offer rate' },
  { value: '4.9/5', label: 'Average rating' },
  { value: 'MY + Global', label: 'Market coverage' },
];

const whyUs = [
  {
    icon: <Shield size={22} />,
    title: 'Practitioner Coaches',
    desc: 'Our coaches are working cybersecurity professionals — not career coaches who read about cybersecurity.',
    borderColor: 'border-l-orange-500',
    iconBg: 'from-orange-500/20 to-orange-400/10',
  },
  {
    icon: <Target size={22} />,
    title: 'Malaysia-Focused',
    desc: 'We know the Malaysian market — salaries, employers, hiring managers, and what actually gets you hired here.',
    borderColor: 'border-l-cyber-cyan',
    iconBg: 'from-cyan-500/20 to-cyan-400/10',
  },
  {
    icon: <Zap size={22} />,
    title: 'Results-Driven',
    desc: 'We measure success by one thing: did you land the role? Every session is built backwards from that outcome.',
    borderColor: 'border-l-cyber-teal',
    iconBg: 'from-teal-500/20 to-teal-400/10',
  },
  {
    icon: <Users size={22} />,
    title: 'No Cookie-Cutter Advice',
    desc: 'Every client gets a personalised plan. We don\'t send templates — we work with your actual situation.',
    borderColor: 'border-l-purple-500',
    iconBg: 'from-purple-500/20 to-purple-400/10',
  },
];

const careerTools = [
  {
    icon: <Map size={28} />,
    title: 'Career Roadmap',
    desc: 'Visualise your path from where you are now to where you want to be — with every milestone mapped out.',
    href: '/career/soc-analyst',
    accent: 'group-hover:shadow-orange-500/20',
    iconBg: 'from-orange-500 to-orange-400',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Skill Gap Analysis',
    desc: 'Identify exactly which skills and certifications you need to close the gap for your target role.',
    href: '/quiz',
    accent: 'group-hover:shadow-cyan-500/20',
    iconBg: 'from-cyan-500 to-cyan-400',
  },
  {
    icon: <Trophy size={28} />,
    title: 'Achievements & Progress',
    desc: 'Track your career development journey with milestones, badges, and a personalised dashboard.',
    href: '/dashboard',
    accent: 'group-hover:shadow-teal-500/20',
    iconBg: 'from-teal-500 to-teal-400',
  },
];

const popularServices = services.filter((s) => s.popular).slice(0, 3);
const latestPosts = getPublishedPosts().slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-cyber-midnight pt-20 pb-32">
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid" />

        {/* Gradient mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/8 via-orange-400/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/6 via-cyan-400/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-t from-orange-500/4 via-cyan-400/3 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Subtle hexagonal accent (top right) */}
        <div className="absolute top-20 right-10 w-64 h-64 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" stroke="currentColor" strokeWidth="1" className="text-cyan-500" />
            <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" stroke="currentColor" strokeWidth="0.5" className="text-orange-500" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHero>
              <div className="section-tag mx-auto w-fit">
                <Fingerprint size={14} className="text-cyber-cyan" />
                Cybersecurity Career Coaching — Malaysia &amp; Beyond
              </div>
            </AnimatedHero>

            <AnimatedSection delay={150}>
              <h1 className="text-display mt-8">
                <span className="text-foreground">Land Your Dream</span>{' '}
                <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
                  Cybersecurity
                </span>{' '}
                <span className="text-foreground">Role</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <p className="mt-7 text-body-lg text-muted-foreground max-w-2xl mx-auto">
                Expert coaching from practising cybersecurity professionals. Resume reviews, mock
                interviews, career consultations, and specialist tracks for SOC, GRC, Cloud, and OT security.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={450}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link href="/contact">
                  <Button variant="brand" size="brand-lg" className="hover-glow-orange">
                    Contact Us Now <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="brandOutline" size="brand-lg">
                    <BarChart2 size={20} /> Take the Career Quiz
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Trust badges */}
            <AnimatedSection delay={600} className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12">
              {[
                'No fluffy advice — only what works',
                'Malaysian market expertise',
                'Response within 24 hours',
              ].map((badge) => (
                <span key={badge} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <CheckCircle2 size={15} className="text-cyber-cyan shrink-0" />
                  {badge}
                </span>
              ))}
            </AnimatedSection>
          </div>

          {/* ── STATS — Glassmorphism cards ──────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="text-center bg-white/60 dark:bg-white/[0.04] backdrop-blur-md border-gray-200/60 dark:border-white/[0.06] shadow-sm"
              >
                <CardContent className="py-4">
                  <p className="text-2xl md:text-3xl font-heading font-black bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LUMASHIFT ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/80 dark:bg-cyber-surface/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="section-tag">Why LumaShift</span>
            <h2 className="text-headline mt-2">
              Coaching That Actually Gets You{' '}
              <span className="gradient-text">Hired</span>
            </h2>
            <p className="section-subtitle mt-4 mx-auto">
              We&apos;re not a generic career coaching firm. We are cybersecurity practitioners who
              have been on both sides of the interview table.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <Card
                key={item.title}
                className={`bg-white/70 dark:bg-cyber-card/70 backdrop-blur-sm border-gray-100 dark:border-cyber-border border-l-4 ${item.borderColor} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
              >
                <CardContent className="pt-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center mb-4`}>
                    <span className="text-foreground">{item.icon}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ───────────────────────────────────────────────── */}
      <section className="relative py-24 bg-white dark:bg-cyber-midnight overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 dark:via-cyber-midnight/40 to-white dark:to-cyber-midnight pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="section-tag">Most Popular</span>
            <h2 className="text-headline mt-2">Services That Get Results</h2>
            <p className="section-subtitle mt-4 mx-auto">
              Chosen by the majority of our clients for maximum career impact.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button variant="brandOutline" size="brand-default">
                View All Services <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <TestimonialSlider autoRotateMs={5000} />

      {/* ── QUIZ CTA — Command Center Panel ─────────────────────────────── */}
      <section className="py-20 bg-gray-50/80 dark:bg-cyber-surface/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-cyber-midnight dark:via-cyber-surface dark:to-cyber-card border border-gray-700/50 dark:border-cyber-border">
            {/* Cyber grid overlay */}
            <div className="absolute inset-0 cyber-grid opacity-40" />

            {/* Floating geometric accents */}
            <div className="absolute top-6 right-8 w-20 h-20 border border-cyan-500/10 rounded-xl rotate-12 pointer-events-none" />
            <div className="absolute bottom-8 left-6 w-14 h-14 border border-orange-500/10 rounded-lg -rotate-6 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-cyan-500/8 rounded-md rotate-45 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative p-10 md:p-14 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-2xl mb-6 border border-cyan-500/20">
                <BarChart2 size={32} className="text-cyber-cyan" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-4">
                Not Sure Where to Start?
              </h2>
              <p className="text-gray-300 text-body-lg mb-8 max-w-xl mx-auto">
                Take our 3-minute career quiz. Get a personalised confidence score, role recommendations,
                and the exact services that match your situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl
                             bg-gradient-to-r from-orange-500 to-orange-500
                             hover:from-orange-500 hover:to-cyan-500
                             shadow-lg shadow-orange-500/25 hover:shadow-cyan-500/25
                             transition-all duration-300 hover:-translate-y-0.5"
                >
                  Take the Career Quiz <ArrowRight size={20} />
                </Link>
                <Link href="/compare-roles">
                  <Button variant="brandGhost" size="brand-lg" className="text-white hover:text-cyber-cyan">
                    <Network size={18} /> Compare Roles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREER INTELLIGENCE TOOLS ────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-cyber-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="section-tag">
              <Cpu size={14} className="text-cyber-cyan" />
              New
            </span>
            <h2 className="text-headline mt-2">
              Career{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>{' '}
              Tools
            </h2>
            <p className="section-subtitle mt-4 mx-auto">
              Go beyond coaching. Explore interactive tools that help you map your career, identify skill gaps, and track your progress.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {careerTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group block"
              >
                <Card className={`transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-gray-50 dark:bg-cyber-card/50 border-gray-100 dark:border-cyber-border ${tool.accent}`}>
                  <CardContent className="pt-5 pb-2">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.iconBg} flex items-center justify-center mb-5`}>
                      <span className="text-white">{tool.icon}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {tool.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 group-hover:text-cyan-500 transition-colors duration-300">
                      Explore <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/80 dark:bg-cyber-surface/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-tag">Latest Insights</span>
              <h2 className="text-headline mt-2">From the LumaShift Blog</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-cyber-cyan transition-colors duration-200">
              All articles <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link href="/blog">
              <Button variant="brandOutline" size="brand-default">
                All Articles <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="relative py-28 bg-white dark:bg-cyber-midnight overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-500/4 to-transparent rounded-full blur-3xl" />
        </div>

        <AnimatedSection animation="scale-in" className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Ready to start?</span>
          <h2 className="text-headline mt-4">
            Your Cybersecurity Career Starts with{' '}
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              One Conversation
            </span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            No pressure. No sales pitch. Just an honest conversation about where you are and how we can help you get where you want to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/contact">
              <Button variant="brand" size="brand-lg">
                Contact Us Now <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="brandOutline" size="brand-lg">
                Explore Services
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10">
            {[
              'Resume review turnaround in 3 days',
              'Sessions via Google Meet or Zoom',
              'Flexible scheduling (incl. evenings)',
              'Available for teams and universities',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star size={13} className="text-orange-500" /> {item}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
