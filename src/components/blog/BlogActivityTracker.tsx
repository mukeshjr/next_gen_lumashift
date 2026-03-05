'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BlogActivityTrackerProps {
  slug: string;
  title: string;
}

export function BlogActivityTracker({ slug, title }: BlogActivityTrackerProps) {
  const { user, loading } = useAuth();
  const tracked = useRef(false);

  useEffect(() => {
    if (loading || !user || tracked.current) return;
    tracked.current = true;

    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'blog_read', item_id: slug, item_title: title }),
    }).catch(() => {});
  }, [user, loading, slug, title]);

  return null;
}
