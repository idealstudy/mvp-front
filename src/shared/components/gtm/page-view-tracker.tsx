'use client';

import { useEffect } from 'react';

import { trackPageView } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';

type Props = {
  pageName: string;
};

export function PageViewTracker({ pageName }: Props) {
  const session = useMemberStore((s) => s.member);

  useEffect(() => {
    trackPageView(pageName, {}, session?.role ?? null);
  }, [pageName, session?.role]);

  return null;
}
