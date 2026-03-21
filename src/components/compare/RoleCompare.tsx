'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, X, Plus, ArrowRight } from 'lucide-react';
import { roles } from '@/data/roles';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COMPARE_FIELDS = [
  { key: 'summary', label: 'Overview' },
  { key: 'responsibilities', label: 'Responsibilities' },
  { key: 'skills', label: 'Key Skills' },
  { key: 'tools', label: 'Tools & Platforms' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'backgroundFit', label: 'Background Fit' },
  { key: 'growthPath', label: 'Growth Path' },
  { key: 'avgSalaryMY', label: 'Avg Salary (MY)' },
  { key: 'avgSalaryGlobal', label: 'Avg Salary (Global)' },
  { key: 'demandLevel', label: 'Demand Level' },
  { key: 'recommendedServices', label: 'LumaShift Services' },
] as const;

const demandVariants: Record<string, 'brand' | 'success' | 'destructive'> = {
  High: 'brand',
  'Very High': 'success',
  Critical: 'destructive',
};

export function RoleCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  const addRole = (id: string) => {
    if (selected.includes(id) || selected.length >= 3) return;
    setSelected((s) => [...s, id]);
  };

  const removeRole = (id: string) => {
    setSelected((s) => s.filter((r) => r !== id));
  };

  const selectedRoles = roles.filter((r) => selected.includes(r.id));

  const renderValue = (role: (typeof roles)[0], key: typeof COMPARE_FIELDS[number]['key']) => {
    const val = role[key];

    if (key === 'recommendedServices') {
      const svcList = services.filter((s) => (val as string[]).includes(s.id));
      return (
        <div className="space-y-2">
          {svcList.map((s) => (
            <Link
              key={s.id}
              href={`/contact?service=${s.id}`}
              className="flex items-center gap-2 text-sm text-orange-500 hover:underline"
            >
              <CheckCircle size={13} className="shrink-0" />
              {s.title}
            </Link>
          ))}
        </div>
      );
    }

    if (key === 'demandLevel') {
      return (
        <Badge variant={demandVariants[val as string] ?? 'muted'}>
          {val as string}
        </Badge>
      );
    }

    if (Array.isArray(val)) {
      return (
        <ul className="space-y-1">
          {val.map((item: string) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-orange-500 mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return <p className="text-sm text-gray-600 dark:text-gray-300">{val as string}</p>;
  };

  return (
    <div className="space-y-8">
      {/* Role picker */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Select 2–3 roles to compare
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {roles.map((role) => {
            const isSelected = selected.includes(role.id);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={role.id}
                onClick={() => (isSelected ? removeRole(role.id) : addRole(role.id))}
                disabled={isDisabled}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                  isSelected
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                    : isDisabled
                    ? 'border-gray-100 dark:border-gray-800 opacity-40 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 cursor-pointer'
                )}
              >
                {isSelected && (
                  <span className="absolute top-1 right-1 text-orange-500">
                    <CheckCircle size={14} />
                  </span>
                )}
                <span className="text-2xl">{role.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">
                  {role.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">⚖️</div>
          <p className="text-lg font-medium">Select at least 2 roles above to start comparing</p>
        </div>
      )}

      {selected.length === 1 && (
        <div className="text-center py-8 text-gray-400">
          <Plus size={32} className="mx-auto mb-2 opacity-50" />
          <p>Add one more role to compare</p>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[640px] px-4 sm:px-0">
            {/* Role headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedRoles.length}, 1fr)` }}>
              <div />
              {selectedRoles.map((role) => (
                <div key={role.id} className="bg-orange-500/10 dark:bg-orange-500/5 rounded-xl p-4 text-center relative">
                  <button
                    onClick={() => removeRole(role.id)}
                    className="absolute top-2 right-2 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                  >
                    <X size={11} />
                  </button>
                  <div className="text-3xl mb-1">{role.icon}</div>
                  <h3 className="font-bold text-foreground text-sm">{role.title}</h3>
                  <Badge variant={demandVariants[role.demandLevel] ?? 'muted'} className="mt-2">
                    {role.demandLevel} Demand
                  </Badge>
                </div>
              ))}
            </div>

            {/* Fields */}
            {COMPARE_FIELDS.map((field, i) => (
              <div
                key={field.key}
                className={cn(
                  'grid gap-4 py-5 border-b border-gray-100 dark:border-gray-800',
                  i % 2 === 0 && 'bg-gray-50/50 dark:bg-gray-900/30 rounded-lg px-3'
                )}
                style={{ gridTemplateColumns: `200px repeat(${selectedRoles.length}, 1fr)` }}
              >
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 self-start pt-1">
                  {field.label}
                </div>
                {selectedRoles.map((role) => (
                  <div key={role.id}>
                    {renderValue(role, field.key)}
                  </div>
                ))}
              </div>
            ))}

            {/* CTA row */}
            <div
              className="grid gap-4 pt-6"
              style={{ gridTemplateColumns: `200px repeat(${selectedRoles.length}, 1fr)` }}
            >
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 self-center">
                Explore or Get Coached
              </div>
              {selectedRoles.map((role) => (
                <div key={role.id} className="flex flex-col gap-2">
                  <Link href={`/career/${role.id}`}>
                    <Button variant="brandOutline" size="brand-sm" className="w-full justify-center">
                      Career Guide
                    </Button>
                  </Link>
                  <Link href={`/contact?role=${role.id}`}>
                    <Button variant="brand" size="brand-sm" className="w-full justify-center">
                      Contact Us <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
