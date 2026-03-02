'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { InviteSuccessContent } from '@/features/invite/components/invite-success-content';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studyRoomId = searchParams.get('studyRoomId');

  useEffect(() => {
    if (!studyRoomId || Number.isNaN(Number(studyRoomId))) {
      router.replace('/');
    }
  }, [studyRoomId, router]);

  if (!studyRoomId || Number.isNaN(Number(studyRoomId))) {
    return null;
  }

  return (
    <main className="bg-gray-white mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full items-center justify-center">
      <InviteSuccessContent studyRoomId={Number(studyRoomId)} />
    </main>
  );
}
