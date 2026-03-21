'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Animation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in';

interface AnimateInProps {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
  threshold?: number;
  once?: boolean;
}

const animationClasses: Record<Animation, { initial: string; animate: string }> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-6',
    animate: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  'fade-left': {
    initial: 'opacity-0 -translate-x-6',
    animate: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    initial: 'opacity-0 translate-x-6',
    animate: 'opacity-100 translate-x-0',
  },
  'scale-in': {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
  },
};

export function AnimateIn({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className,
  as: Component = 'div',
  threshold = 0.1,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const { initial, animate } = animationClasses[animation];

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-all ease-out',
        isVisible ? animate : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  animation?: Animation;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  childClassName?: string;
}

export function StaggerIn({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 500,
  className,
  childClassName,
}: StaggerProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {items.map((child, i) => (
        <AnimateIn
          key={i}
          animation={animation}
          delay={i * staggerDelay}
          duration={duration}
          className={childClassName}
        >
          {child}
        </AnimateIn>
      ))}
    </div>
  );
}
