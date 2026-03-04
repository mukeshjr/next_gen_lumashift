import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, TrendingUp, BookOpen, ArrowLeft } from 'lucide-react';
import { getRoleById, getAllRoleIds, roles } from '@/data/roles';
import { services } from '@/data/services';

interface Params {
  params: { role: string };
}

export async function generateStaticParams() {
  return getAllRoleIds().map((id) => ({ role: id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const role = getRoleById(params.role);
  if (!role) return { title: 'Role Not Found' };
  return {
    title: `${role.title} Career Guide`,
    description: role.summary,
  };
}

const demandColors: Record<string, string> = {
  High: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  'Very High': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  Critical: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

export default function CareerRolePage({ params }: Params) {
  const role = getRoleById(params.role);
  if (!role) notFound();

  const recServices = services.filter((s) => role.recommendedServices.includes(s.id));
  const otherRoles = roles.filter((r) => r.id !== role.id).slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#0A0A0A]">
      {/* Hero */}
      <section className="py-16 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/compare-roles"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 mb-6"
          >
            <ArrowLeft size={16} /> Compare with other roles
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{role.icon}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${demandColors[role.demandLevel]}`}>
                  {role.demandLevel} Demand
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {role.title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {role.summary}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href={`/contact?role=${role.id}`} className="btn-primary">
                  Get Coaching for This Role <ArrowRight size={16} />
                </Link>
                <Link href="/quiz" className="btn-secondary">
                  Take the Career Quiz
                </Link>
              </div>
            </div>

            {/* Salary cards */}
            <div className="grid grid-cols-2 gap-4">
              {role.avgSalaryMY && (
                <div className="card text-center py-6">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Avg Salary (MY)</p>
                  <p className="text-xl font-black text-orange-500 leading-snug">{role.avgSalaryMY}</p>
                </div>
              )}
              {role.avgSalaryGlobal && (
                <div className="card text-center py-6">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Avg Salary (Global)</p>
                  <p className="text-xl font-black text-green-500 leading-snug">{role.avgSalaryGlobal}</p>
                </div>
              )}
              <div className="col-span-2 card text-center py-5">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Market Demand</p>
                <p className={`text-2xl font-black ${demandColors[role.demandLevel].split(' ')[4] ?? 'text-orange-500'}`}>
                  {role.demandLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Responsibilities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-sm">📋</span>
                What You&apos;ll Actually Do
              </h2>
              <ul className="space-y-2.5">
                {role.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-sm">⚡</span>
                Skills You Need
              </h2>
              <div className="flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-sm">🛠</span>
                Tools &amp; Platforms
              </h2>
              <div className="flex flex-wrap gap-2">
                {role.tools.map((tool) => (
                  <span key={tool} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-orange-500" />
                Certifications to Target
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {role.certifications.map((cert, i) => (
                  <div key={cert} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Background fit */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Who Is a Good Fit?
              </h2>
              <ul className="space-y-2">
                {role.backgroundFit.map((bg) => (
                  <li key={bg} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <span className="text-orange-500">→</span> {bg}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth path */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-500" />
                Career Growth Path
              </h2>
              <div className="space-y-2">
                {role.growthPath.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    {i > 0 && <div className="w-0.5 h-4 bg-orange-200 dark:bg-orange-500/20 ml-3" />}
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-orange-500 text-white' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-500'}`}>
                        {i + 1}
                      </div>
                      <span className={`text-sm ${i === 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended services */}
            <div className="card sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                LumaShift Services for {role.title}s
              </h3>
              <div className="space-y-3 mb-5">
                {recServices.map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/services#${svc.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-colors group"
                  >
                    <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors">
                        {svc.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{svc.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href={`/contact?role=${role.id}`} className="btn-primary w-full justify-center">
                Contact Us Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Compare with other roles */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Compare with Other Roles</h3>
              <div className="space-y-2 mb-4">
                {otherRoles.map((r) => (
                  <Link
                    key={r.id}
                    href={`/career/${r.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-orange-500 transition-colors">
                      {r.title}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/compare-roles" className="text-sm text-orange-500 hover:underline font-medium">
                Full comparison tool →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
