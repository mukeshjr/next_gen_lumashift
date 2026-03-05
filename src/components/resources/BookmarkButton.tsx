'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  resourceId: string;
  title: string;
  className?: string;
}

export function BookmarkButton({ resourceId, title, className }: BookmarkButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user || loading) return;
    setChecking(true);
    fetch(`/api/saves?item_type=resource&item_id=${encodeURIComponent(resourceId)}`)
      .then((r) => r.json())
      .then((data) => {
        setSaved((data.saves ?? []).length > 0);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user, resourceId, loading]);

  const handleToggle = async () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/resources');
      return;
    }

    setToggling(true);
    if (saved) {
      await fetch(`/api/saves?item_type=resource&item_id=${encodeURIComponent(resourceId)}`, {
        method: 'DELETE',
      });
      setSaved(false);
    } else {
      await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: 'resource', item_id: resourceId, item_title: title }),
      });
      setSaved(true);
    }
    setToggling(false);
  };

  const isLoading = loading || checking || toggling;

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={saved ? 'Remove bookmark' : 'Bookmark this resource'}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
        saved
          ? 'bg-orange-500 text-white hover:bg-orange-600'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-500/10',
        'disabled:opacity-60',
        className
      )}
    >
      {isLoading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Bookmark size={12} className={saved ? 'fill-white' : ''} />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
