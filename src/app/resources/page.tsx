'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Lock, FileText, CheckSquare, BookOpen, Video, ArrowRight, Unlock } from 'lucide-react';
import { getFreeResources, getPremiumResources, getAllResourceCategories } from '@/data/resources';
import { ResourceUnlockForm } from '@/components/forms/ResourceUnlockForm';
import { Resource } from '@/types';

const iconMap: Record<Resource['type'], React.ReactNode> = {
  pdf: <FileText size={20} className="text-orange-500" />,
  template: <FileText size={20} className="text-blue-500" />,
  checklist: <CheckSquare size={20} className="text-green-500" />,
  guide: <BookOpen size={20} className="text-purple-500" />,
  video: <Video size={20} className="text-red-500" />,
};

const freeResources = getFreeResources();
const premiumResources = getPremiumResources();
const categories = getAllResourceCategories();

export default function ResourcesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const filterResources = (list: typeof freeResources) =>
    activeCategory ? list.filter((r) => r.category === activeCategory) : list;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Free + Premium Resources</span>
          <h1 className="section-title mt-4">
            Tools to Accelerate Your{' '}
            <span className="gradient-text">Career</span>
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            Download our free cybersecurity career resources — templates, guides, and checklists
            built from real coaching experience.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-500'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Free resources */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free Resources</h2>
            <span className="badge-green">No sign-up required</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filterResources(freeResources).map((resource) => (
              <div key={resource.id} className="card-hover flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                    {iconMap[resource.type]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{resource.type}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mt-0.5">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">
                  {resource.description}
                </p>
                <a
                  href={resource.downloadUrl ?? '#'}
                  download
                  className="btn-primary text-sm py-2 justify-center"
                >
                  <Download size={15} /> Download Free
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Premium resources */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Resources</h2>
            <span className="badge-orange">Unlock for free</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Share your name, email, and career goal — we&apos;ll send these directly to your inbox, along with a personalised note.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filterResources(premiumResources).map((resource) => (
              <div
                key={resource.id}
                className={`card-hover flex flex-col relative ${!unlocked ? 'cursor-pointer' : ''}`}
                onClick={!unlocked ? () => setShowUnlockModal(true) : undefined}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock size={28} className="text-orange-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Unlock to access</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                    {iconMap[resource.type]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Premium</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mt-0.5">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">
                  {resource.description}
                </p>
                <div className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                  <Lock size={13} /> Premium · Unlock below
                </div>
              </div>
            ))}
          </div>

          {/* Unlock CTA */}
          {!unlocked ? (
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-8">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Unlock size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Unlock Premium Resources
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Enter your details and we&apos;ll email you all premium resources instantly. No payment required.
                </p>
                <ResourceUnlockForm onSuccess={() => setUnlocked(true)} />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Unlock size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">Premium resources unlocked!</p>
                <p className="text-sm text-green-600 dark:text-green-500">Check your email — we&apos;ve sent everything across.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 bg-gray-50 dark:bg-[#141414] mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Want Personalised Guidance Beyond These Resources?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Our coaching goes far deeper than any guide. Let&apos;s talk about your specific situation.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
