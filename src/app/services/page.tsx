import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Full catalogue of LumaShift cybersecurity career coaching services — resume reviews, LinkedIn optimisation, mock interviews, and specialist coaching tracks.',
};

const tiers = [
  {
    key: 'starter' as const,
    title: 'Starter',
    subtitle: 'Build your foundation',
    desc: 'Essential tools to get your career off the ground. Perfect for students, fresh grads, and those taking their first steps into cybersecurity.',
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  },
  {
    key: 'professional' as const,
    title: 'Professional',
    subtitle: 'Prepare & compete',
    desc: 'Deeper coaching to sharpen your interview skills, clarify your career direction, and position yourself for the roles you actually want.',
    color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
  },
  {
    key: 'advanced' as const,
    title: 'Advanced',
    subtitle: 'Accelerate & specialise',
    desc: 'Comprehensive packages and specialist tracks for professionals who want to move fast, move up, or move into a specialist niche.',
    color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A]">
      {/* Hero */}
      <section className="py-20 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Full Service Catalogue</span>
          <h1 className="section-title mt-4">
            Coaching Services for Every Stage
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            From your first cybersecurity resume to a senior specialist role — we have a service for every stage
            of your career. All services include direct communication with your coach.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              'No hidden fees',
              'Direct coach access',
              'Malaysian + global market knowledge',
              'Fast turnaround times',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <CheckCircle size={15} className="text-orange-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      {tiers.map((tier) => {
        const tierServices = services.filter((s) => s.tier === tier.key);
        return (
          <section key={tier.key} className="py-20 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Tier header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${tier.color}`}>
                      {tier.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{tier.subtitle}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xl">{tier.desc}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tierServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Not Sure Which Service Is Right for You?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Take our 3-minute quiz to get a personalised service recommendation, or reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors">
              Take the Career Quiz
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Contact Us Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
