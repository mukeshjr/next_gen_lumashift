'use client';

import { AnimateIn } from '@/components/ui/animate-in';

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up' as const,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in';
  delay?: number;
}) {
  return (
    <AnimateIn animation={animation} delay={delay} className={className}>
      {children}
    </AnimateIn>
  );
}

export function AnimatedHero({ children }: { children: React.ReactNode }) {
  return (
    <AnimateIn animation="fade-up" duration={800}>
      {children}
    </AnimateIn>
  );
}

export function AnimatedStagger({
  children,
  className,
  staggerDelay = 100,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={className}>
      {items.map((child, i) => (
        <AnimateIn key={i} animation="fade-up" delay={i * staggerDelay} duration={500}>
          {child}
        </AnimateIn>
      ))}
    </div>
  );
}
