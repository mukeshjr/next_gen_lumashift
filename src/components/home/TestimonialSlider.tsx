'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialSliderProps {
  autoRotateMs?: number;
}

export function TestimonialSlider({ autoRotateMs = 5000 }: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, autoRotateMs);
    return () => clearInterval(timer);
  }, [paused, next, autoRotateMs]);

  const t = testimonials[current];

  return (
    <section className="bg-gray-950 dark:bg-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-tag bg-orange-500/10 text-orange-400">What Our Clients Say</span>
          <h2 className="section-title text-white mt-2">Real Results, Real Careers</h2>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Quote card */}
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
            <Quote size={48} className="text-orange-500/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium mb-8">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="inline-flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-lg">
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-gray-400">
                  {t.role} · {t.company}
                </p>
              </div>
              <span className="inline-flex items-center px-4 py-1.5 bg-orange-500/10 text-orange-400 text-sm font-medium rounded-full border border-orange-500/20 mt-2">
                ✓ {t.outcome}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'transition-all duration-300 rounded-full',
                    i === current
                      ? 'w-6 h-2 bg-orange-500'
                      : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
