'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SkillRadarProps {
  skills: { name: string; current: number; required: number }[];
  size?: number;
  className?: string;
}

interface TooltipData {
  x: number;
  y: number;
  name: string;
  current: number;
  required: number;
  type: 'current' | 'required';
}

const CYAN = '#06B6D4';
const ORANGE = '#F97316';
const RING_LEVELS = [20, 40, 60, 80, 100];

export default function SkillRadar({
  skills,
  size = 320,
  className,
}: SkillRadarProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const numSkills = skills.length;
  const cx = 160;
  const cy = 160;
  const radius = 110;
  const labelRadius = radius + 28;
  const angleStep = (2 * Math.PI) / numSkills;

  // Pre-calculate all axis angles (start from top, i.e. -90 degrees)
  const angles = useMemo(
    () => skills.map((_, i) => angleStep * i - Math.PI / 2),
    [skills, angleStep],
  );

  // Convert a value (0-100) + angle into an SVG point
  const toPoint = useCallback(
    (value: number, angle: number) => ({
      x: cx + (value / 100) * radius * Math.cos(angle),
      y: cy + (value / 100) * radius * Math.sin(angle),
    }),
    [cx, cy, radius],
  );

  // Build polygon points string from values
  const buildPolygon = useCallback(
    (values: number[]) =>
      values
        .map((v, i) => {
          const p = toPoint(v, angles[i]);
          return `${p.x},${p.y}`;
        })
        .join(' '),
    [toPoint, angles],
  );

  // Ring polygon at a given level
  const ringPolygon = useCallback(
    (level: number) =>
      angles
        .map((a) => {
          const p = toPoint(level, a);
          return `${p.x},${p.y}`;
        })
        .join(' '),
    [toPoint, angles],
  );

  const requiredPoints = buildPolygon(skills.map((s) => s.required));
  const currentPoints = buildPolygon(skills.map((s) => s.current));

  const handleDotEnter = (
    skill: { name: string; current: number; required: number },
    value: number,
    angle: number,
    type: 'current' | 'required',
  ) => {
    const p = toPoint(value, angle);
    setTooltip({
      x: p.x,
      y: p.y,
      name: skill.name,
      current: skill.current,
      required: skill.required,
      type,
    });
  };

  const handleDotLeave = () => setTooltip(null);

  return (
    <div className={cn('relative w-full max-w-sm mx-auto', className)}>
      <svg
        viewBox="0 0 320 320"
        width={size}
        height={size}
        className="w-full h-auto"
        role="img"
        aria-label="Skill gap radar chart"
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle for dark mode */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + 4}
          className="fill-gray-50 dark:fill-cyber-midnight/60"
        />

        {/* Concentric ring grid lines */}
        {RING_LEVELS.map((level) => (
          <polygon
            key={`ring-${level}`}
            points={ringPolygon(level)}
            fill="none"
            className="stroke-gray-200 dark:stroke-cyber-border/50"
            strokeWidth={level === 100 ? 1.5 : 0.7}
            strokeDasharray={level === 100 ? 'none' : '3,3'}
          />
        ))}

        {/* Axis lines from center to each vertex */}
        {angles.map((angle, i) => {
          const end = toPoint(100, angle);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              className="stroke-gray-200 dark:stroke-cyber-border/40"
              strokeWidth={0.7}
            />
          );
        })}

        {/* Ring level labels (small numbers at the right axis) */}
        {RING_LEVELS.map((level) => {
          const p = toPoint(level, -Math.PI / 2);
          return (
            <text
              key={`label-${level}`}
              x={p.x + 8}
              y={p.y + 3}
              className="fill-gray-400 dark:fill-gray-600"
              fontSize="8"
              fontFamily="DM Sans, sans-serif"
            >
              {level}
            </text>
          );
        })}

        {/* Required skills polygon (cyan) */}
        <g className="radar-animate" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <polygon
            points={requiredPoints}
            fill={CYAN}
            fillOpacity={0.15}
            stroke={CYAN}
            strokeWidth={2}
            strokeLinejoin="round"
            filter="url(#glow-cyan)"
          />
        </g>

        {/* Current skills polygon (orange) */}
        <g className="radar-animate" style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: '0.15s' }}>
          <polygon
            points={currentPoints}
            fill={ORANGE}
            fillOpacity={0.2}
            stroke={ORANGE}
            strokeWidth={2}
            strokeLinejoin="round"
            filter="url(#glow-orange)"
          />
        </g>

        {/* Data points: required (cyan dots) */}
        {skills.map((skill, i) => {
          const p = toPoint(skill.required, angles[i]);
          return (
            <circle
              key={`req-dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={CYAN}
              stroke="#fff"
              strokeWidth={1.5}
              className="cursor-pointer transition-transform duration-150 hover:scale-150 radar-animate"
              style={{ transformOrigin: `${p.x}px ${p.y}px`, animationDelay: `${0.3 + i * 0.05}s` }}
              onMouseEnter={() => handleDotEnter(skill, skill.required, angles[i], 'required')}
              onMouseLeave={handleDotLeave}
              onTouchStart={() => handleDotEnter(skill, skill.required, angles[i], 'required')}
            />
          );
        })}

        {/* Data points: current (orange dots) */}
        {skills.map((skill, i) => {
          const p = toPoint(skill.current, angles[i]);
          return (
            <circle
              key={`cur-dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={ORANGE}
              stroke="#fff"
              strokeWidth={1.5}
              className="cursor-pointer transition-transform duration-150 hover:scale-150 radar-animate"
              style={{ transformOrigin: `${p.x}px ${p.y}px`, animationDelay: `${0.35 + i * 0.05}s` }}
              onMouseEnter={() => handleDotEnter(skill, skill.current, angles[i], 'current')}
              onMouseLeave={handleDotLeave}
              onTouchStart={() => handleDotEnter(skill, skill.current, angles[i], 'current')}
            />
          );
        })}

        {/* Axis labels (skill names) */}
        {skills.map((skill, i) => {
          const angle = angles[i];
          const lx = cx + labelRadius * Math.cos(angle);
          const ly = cy + labelRadius * Math.sin(angle);

          // Determine text-anchor based on position
          let anchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) anchor = 'start';
          else if (Math.cos(angle) < -0.3) anchor = 'end';

          // Vertical nudge
          const dy = Math.sin(angle) > 0.3 ? 12 : Math.sin(angle) < -0.3 ? -4 : 4;

          return (
            <text
              key={`skill-label-${i}`}
              x={lx}
              y={ly + dy}
              textAnchor={anchor}
              className="fill-gray-700 dark:fill-gray-300"
              fontSize="10"
              fontWeight="500"
              fontFamily="DM Sans, sans-serif"
            >
              {skill.name.length > 14
                ? skill.name.slice(0, 12) + '...'
                : skill.name}
            </text>
          );
        })}
      </svg>

      {/* Tooltip overlay */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${(tooltip.x / 320) * 100}%`,
            top: `${(tooltip.y / 320) * 100}%`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <div className="bg-white dark:bg-cyber-card border border-gray-200 dark:border-cyber-border rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              {tooltip.name}
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Current: {tooltip.current}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: CYAN }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Required: {tooltip.required}
                </span>
              </span>
            </div>
            <p className="mt-1 font-medium" style={{ color: tooltip.required - tooltip.current > 20 ? '#EF4444' : ORANGE }}>
              Gap: {Math.max(0, tooltip.required - tooltip.current)} pts
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: ORANGE, opacity: 0.7 }}
          />
          <span className="text-gray-600 dark:text-gray-400">Current</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: CYAN, opacity: 0.7 }}
          />
          <span className="text-gray-600 dark:text-gray-400">Required</span>
        </div>
      </div>
    </div>
  );
}
