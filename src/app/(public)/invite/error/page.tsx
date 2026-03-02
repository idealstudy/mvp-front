'use client';

import { useSearchParams } from 'next/navigation';

import { InviteErrorContent } from '@/features/invite/components/invite-error-content';
import { type ErrorReason, isErrorReason } from '@/features/invite/types';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const reasonParam = searchParams.get('reason');
  const reason: ErrorReason = isErrorReason(reasonParam as string)
    ? (reasonParam as ErrorReason)
    : 'INVALID_LINK';

  return (
    <main className="bg-gray-white mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full items-center justify-center">
      <InviteErrorContent reason={reason} />
    </main>
  );
}
