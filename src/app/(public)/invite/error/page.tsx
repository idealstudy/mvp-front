'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { InviteErrorContent } from '@/features/invite/components/invite-error-content';
import {
  INVITE_VALIDITY_MS,
  INVITE_VISITED_KEY,
} from '@/features/invite/constants';
import { type ErrorReason, isErrorReason } from '@/features/invite/types';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reasonParam = searchParams.get('reason');
  const reason: ErrorReason = isErrorReason(reasonParam as string)
    ? (reasonParam as ErrorReason)
    : 'INVALID_LINK';
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const visitedAt = sessionStorage.getItem(INVITE_VISITED_KEY);
    const isValidSession =
      visitedAt && Date.now() - parseInt(visitedAt, 10) < INVITE_VALIDITY_MS;

    if (!isValidSession) {
      router.replace('/');
      return;
    }

    sessionStorage.removeItem(INVITE_VISITED_KEY);
    setIsAllowed(true);
  }, [router]);

  if (!isAllowed) {
    return null;
  }

  return (
    <main className="bg-gray-white tablet:pt-58 desktop:pt-30 mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full justify-center pt-35">
      <InviteErrorContent reason={reason} />
    </main>
  );
}
