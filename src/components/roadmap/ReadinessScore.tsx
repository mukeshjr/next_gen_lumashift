'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ReadinessScoreProps {
  score: number; // 0-100
  label: string; // "Foundation", "Building", "Advanced", "Expert"
  breakdown: { label: string; value: number; max: number }[];
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E'; // green
  if (score >= 60) return '#06B6D4'; // cyan
  if (score >= 30) return '#F97316'; // orange
  return '#EF4444'; // red
}

function getScoreGlowClass(score: number): string {
  if (score >= 80) return 'shadow-[0_0_30px_rgba(34,197,94,0.2),0_0_60px_rgba(34,197,94,0.08)]';
  if (score >= 60) return 'shadow-[0_0_30px_rgba(6,182,212,0.2),0_0_60px_rgba(6,182,212,0.08)]';
  if (score >= 30) return 'shadow-[0_0_30px_rgba(249,115,22,0.2),0_0_60px_rgba(249,115,22,0.08)]';
  return 'shadow-[0_0_30px_rgba(239,68,68,0.2),0_0_60px_rgba(239,68,68,0.08)]';
}

function getBarColor(pct: number): string {
  if (pct >= 80) return '#22C55E';
  if (pct >= 60) return '#06B6D4';
  if (pct >= 30) return '#F97316';
  return '#EF4444';
}

function getLabelIcon(label: string): string {
  switch (label) {
    case 'Expert':
      return '⚡';
    case 'Advanced':
      return '🔷';
    case 'Building':
      return '🔶';
    default:
      return '🔸';
  }
}

const RING_SIZE = 160;
const STROKE_WIDTH = 12;
const RING_RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ReadinessScore({
  score,
  label,
  breakdown,
  className,
}: ReadinessScoreProps) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const color = getScoreColor(score);
  const glowClass = getScoreGlowClass(score);

  // Animate on mount
  useEffect(() => {
    setMounted(true);
    const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

    // Small delay so the browser paints the initial state first
    const raf = requestAnimationFrame(() => {
      setAnimatedOffset(targetOffset);
    });

    // Animate the counter
    const duration = 1200;
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frameId);
    };
  }, [score]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-white/80 dark:bg-cyber-card/80 backdrop-blur-sm border dark:border-cyber-border border-gray-200 rounded-2xl p-6',
        className,
      )}
    >
      {/* Circular Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className={cn('relative rounded-full', mounted && glowClass)}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="transform -rotate-90"
          >
            {/* Track */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              className="stroke-gray-200 dark:stroke-cyber-border"
            />
            {/* Progress arc */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={animatedOffset}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-heading font-bold leading-none"
              style={{ color }}
            >
              {animatedScore}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="mt-3 text-center">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {getLabelIcon(label)} {label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-cyber-border mb-4" />

      {/* Breakdown bars */}
      <div className="space-y-3">
        {breakdown.map((item) => {
          const pct = Math.round((item.value / item.max) * 100);
          const barColor = getBarColor(pct);

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate mr-2">
                  {item.label}
                </span>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: barColor }}
                >
                  {pct}%
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-gray-100 dark:bg-cyber-midnight overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${pct}%` : '0%',
                    backgroundColor: barColor,
                    transitionDelay: '0.4s',
                  }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 progress-shimmer rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
