import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Target,
  Zap,
  Users,
  BarChart2,
  CheckCircle,
  Star,
} from 'lucide-react';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BlogCard } from '@/components/blog/BlogCard';
import { services } from '@/data/services';
import { getPublishedPosts } from '@/data/blog-posts';

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
    icon: <Shield size={22} className="text-orange-500" />,
    title: 'Practitioner Coaches',
    desc: 'Our coaches are working cybersecurity professionals — not career coaches who read about cybersecurity.',
  },
  {
    icon: <Target size={22} className="text-orange-500" />,
    title: 'Malaysia-Focused',
    desc: 'We know the Malaysian market — salaries, employers, hiring managers, and what actually gets you hired here.',
  },
  {
    icon: <Zap size={22} className="text-orange-500" />,
    title: 'Results-Driven',
    desc: 'We measure success by one thing: did you land the role? Every session is built backwards from that outcome.',
  },
  {
    icon: <Users size={22} className="text-orange-500" />,
    title: 'No Cookie-Cutter Advice',
    desc: 'Every client gets a personalised plan. We don\'t send templates — we work with your actual situation.',
  },
];

const popularServices = services.filter((s) => s.popular).slice(0, 3);
const latestPosts = getPublishedPosts().slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0A0A0A] pt-12 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="section-tag mx-auto w-fit">
              🇲🇾 Cybersecurity Career Coaching — Malaysia &amp; Beyond
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mt-6 leading-[1.05] tracking-tight">
              Land Your Dream{' '}
              <span className="gradient-text">Cybersecurity</span>{' '}
              Role
            </h1>

            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Expert coaching from practising cybersecurity professionals. Resume reviews, mock
              interviews, career consultations, and specialist tracks for SOC, GRC, Cloud, and OT security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                Contact Us Now <ArrowRight size={20} />
              </Link>
              <Link href="/quiz" className="btn-secondary text-lg px-8 py-4">
                <BarChart2 size={20} /> Take the Career Quiz
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                '✓ No fluffy advice — only what works',
                '✓ Malaysian market expertise',
                '✓ Response within 24 hours',
              ].map((badge) => (
                <span key={badge} className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-orange-100 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LUMASHIFT ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-tag">Why LumaShift</span>
            <h2 className="section-title mt-2">
              Coaching That Actually Gets You{' '}
              <span className="gradient-text">Hired</span>
            </h2>
            <p className="section-subtitle mt-4 mx-auto">
              We&apos;re not a generic career coaching firm. We are cybersecurity practitioners who
              have been on both sides of the interview table.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="card-hover">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-tag">Most Popular</span>
            <h2 className="section-title mt-2">Services That Get Results</h2>
            <p className="section-subtitle mt-4 mx-auto">
              Chosen by the majority of our clients for maximum career impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/services" className="btn-secondary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <TestimonialSlider autoRotateMs={5000} />

      {/* ── QUIZ CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1E1E1E] dark:to-[#141414] rounded-3xl p-10 md:p-14 border border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-6">
              <BarChart2 size={32} className="text-orange-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Take our 3-minute career quiz. Get a personalised confidence score, role recommendations,
              and the exact services that match your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz" className="btn-primary text-lg px-8 py-4">
                Take the Career Quiz <ArrowRight size={20} />
              </Link>
              <Link href="/compare-roles" className="btn-ghost text-white hover:text-orange-400">
                Compare Roles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-tag">Latest Insights</span>
              <h2 className="section-title mt-2">From the LumaShift Blog</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600">
              All articles <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link href="/blog" className="btn-secondary">
              All Articles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Ready to start?</span>
          <h2 className="section-title mt-4">
            Your Cybersecurity Career Starts with One Conversation
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            No pressure. No sales pitch. Just an honest conversation about where you are and how we can help you get where you want to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Contact Us Now <ArrowRight size={20} />
            </Link>
            <Link href="/services" className="btn-secondary text-lg px-8 py-4">
              Explore Services
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10">
            {[
              'Resume review turnaround in 3 days',
              'Sessions via Google Meet or Zoom',
              'Flexible scheduling (incl. evenings)',
              'Available for teams and universities',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Star size={13} className="text-orange-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
