import Link from 'next/link';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Service } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

const tierColors = {
  starter: 'badge-gray',
  professional: 'badge-orange',
  advanced: 'badge-green',
};

const tierLabels = {
  starter: 'Starter',
  professional: 'Professional',
  advanced: 'Advanced',
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div
      id={service.id}
      className={cn(
        'relative flex flex-col card-hover',
        service.popular && 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-[#0A0A0A]'
      )}
    >
      {/* Popular badge */}
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <Star size={11} fill="white" /> Most Popular
          </span>
        </div>
      )}

      {/* Tag for non-popular advanced */}
      {service.tag && !service.popular && (
        <div className="absolute -top-3 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs font-bold rounded-full">
            {service.tag}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={tierColors[service.tier]}>{tierLabels[service.tier]}</span>
              {service.track && (
                <span className="badge bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {service.track} Track
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
              {service.title}
            </h3>
          </div>
          {service.price && (
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-orange-500">{service.price}</p>
              {service.duration && (
                <p className="text-xs text-gray-400 mt-0.5">{service.duration}</p>
              )}
            </div>
          )}
        </div>

        {/* Who it's for */}
        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 rounded-lg px-4 py-2.5">
          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">Who This Is For</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{service.forWho}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {service.description}
        </p>

        {/* Outcomes */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            What You Get
          </p>
          <ul className="space-y-1.5">
            {service.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle
                  size={15}
                  className="text-orange-500 shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          href={`/contact?service=${service.id}`}
          className={cn(
            'btn-primary w-full justify-center',
            service.popular ? 'bg-orange-500 hover:bg-orange-600' : 'btn-secondary'
          )}
        >
          Contact Us Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
