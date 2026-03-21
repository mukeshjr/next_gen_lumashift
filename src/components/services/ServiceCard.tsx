import Link from 'next/link';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Service } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: Service;
}

const tierVariant = {
  starter: 'muted' as const,
  professional: 'brand' as const,
  advanced: 'success' as const,
};

const tierLabels = {
  starter: 'Starter',
  professional: 'Professional',
  advanced: 'Advanced',
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      id={service.id}
      className={cn(
        'relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        service.popular && 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-background'
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

      <CardContent className="flex flex-col gap-4 flex-1 pt-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={tierVariant[service.tier]}>{tierLabels[service.tier]}</Badge>
              {service.track && (
                <Badge variant="info">{service.track} Track</Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              {service.title}
            </h3>
          </div>
          {service.price && (
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-orange-500">{service.price}</p>
              {service.duration && (
                <p className="text-xs text-muted-foreground mt-0.5">{service.duration}</p>
              )}
            </div>
          )}
        </div>

        {/* Who it's for */}
        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 rounded-lg px-4 py-2.5">
          <p className="text-caption text-orange-600 dark:text-orange-400 mb-0.5">Who This Is For</p>
          <p className="text-sm text-muted-foreground">{service.forWho}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>

        {/* Outcomes */}
        <div className="flex-1">
          <p className="text-caption text-muted-foreground mb-2">
            What You Get
          </p>
          <ul className="space-y-1.5">
            {service.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      {/* CTA */}
      <CardFooter className="border-0 bg-transparent px-4 pb-4">
        <Link href={`/contact?service=${service.id}`} className="w-full">
          <Button
            variant={service.popular ? 'brand' : 'brandOutline'}
            size="brand-default"
            className="w-full"
          >
            Contact Us Now <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
