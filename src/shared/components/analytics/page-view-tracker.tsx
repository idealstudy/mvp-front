'use client';

import { useEffect, useRef } from 'react';

import { useSession } from '@/providers';
import { trackPageView } from '@/shared/lib/analytics';

type Props = {
  pageName: string;
};

export function PageViewTracker({ pageName }: Props) {
  const { member, status } = useSession();
  const trackedPageNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (trackedPageNameRef.current === pageName) return;

    trackPageView(pageName, {}, member?.role ?? null);
    trackedPageNameRef.current = pageName;
  }, [pageName, status, member?.role]);

  return null;
}
