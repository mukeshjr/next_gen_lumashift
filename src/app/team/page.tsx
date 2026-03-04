import type { Metadata } from 'next';
import Link from 'next/link';
import { Linkedin, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { team } from '@/data/team';

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    'Meet Mukesh Vijaiyan and Lavanyah Prabu — the cybersecurity practitioners and career coaches behind LumaShift.',
};

export default function TeamPage() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A]">
      {/* Hero */}
      <section className="py-20 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">The Team</span>
          <h1 className="section-title mt-4">
            Coaches Who Have Lived the Journey
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            LumaShift was founded by two practising cybersecurity professionals who got tired of watching talented people
            fail at the job search because they lacked the right support.
          </p>
        </div>
      </section>

      {/* Team members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {team.map((member, index) => (
            <div
              key={member.name}
              className={`grid md:grid-cols-2 gap-12 items-start ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Profile card */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="card sticky top-24">
                  {/* Avatar placeholder */}
                  <div className="w-full aspect-square max-w-[280px] mx-auto bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-2xl flex items-center justify-center mb-6 text-8xl font-black text-orange-500/30">
                    {member.name[0]}
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{member.name}</h2>
                    <p className="text-orange-500 font-semibold mt-1">{member.role}</p>
                  </div>

                  <div className="flex gap-3 justify-center mb-6">
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        <Mail size={16} /> Email
                      </a>
                    )}
                  </div>

                  {/* Certifications */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {member.certifications.map((cert) => (
                        <span key={cert} className="badge-orange text-xs px-2 py-1">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio and expertise */}
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  {member.name}
                </h2>
                <div className="prose-custom max-w-none mb-8">
                  {member.bio.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Expertise */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Areas of Expertise
                  </p>
                  <ul className="space-y-2">
                    {member.expertise.map((exp) => (
                      <li key={exp} className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-orange-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* LinkedIn embed note */}
                {member.name.includes('Mukesh') && (
                  <div className="card bg-blue-50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Linkedin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Connect on LinkedIn</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          Follow Mukesh for daily cybersecurity career tips and industry insights.
                        </p>
                        <a
                          href="https://www.linkedin.com/in/mukeshvijaian/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          linkedin.com/in/mukeshvijaian <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {member.name.includes('Lavanyah') && (
                  <div className="card bg-blue-50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Linkedin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Connect on LinkedIn</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          Follow Lavanyah for GRC insights, compliance updates, and career advice.
                        </p>
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {member.linkedIn.replace('https://www.', '')} <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 dark:bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Work with Mukesh or Lavanyah Directly</h2>
          <p className="section-subtitle mt-4 mx-auto">
            No intake forms or junior consultants. When you work with LumaShift, you work directly
            with the co-founders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Contact Us Now <ArrowRight size={20} />
            </Link>
            <Link href="/services" className="btn-secondary text-lg px-8 py-4">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
