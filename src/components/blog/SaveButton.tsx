'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export function SaveButton({ slug, title, className }: SaveButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user || loading) return;
    setChecking(true);
    fetch(`/api/saves?item_type=blog_post&item_id=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        setSaved((data.saves ?? []).length > 0);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user, slug, loading]);

  const handleToggle = async () => {
    if (!user) {
      router.push(`/auth/login?redirectTo=/blog/${slug}`);
      return;
    }

    setToggling(true);
    if (saved) {
      await fetch(`/api/saves?item_type=blog_post&item_id=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      setSaved(false);
    } else {
      await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: 'blog_post', item_id: slug, item_title: title }),
      });
      setSaved(true);
      // Track blog read activity too
      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'blog_read', item_id: slug, item_title: title }),
      }).catch(() => {});
    }
    setToggling(false);
  };

  const isLoading = loading || checking || toggling;

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={saved ? 'Remove from saved' : 'Save this post'}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
        saved
          ? 'bg-orange-500 text-white hover:bg-orange-600'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500',
        'disabled:opacity-60',
        className
      )}
    >
      {isLoading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Bookmark size={15} className={saved ? 'fill-white' : ''} />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
