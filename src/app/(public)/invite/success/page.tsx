'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { InviteSuccessContent } from '@/features/invite/components/invite-success-content';
import {
  INVITE_VALIDITY_MS,
  INVITE_VISITED_KEY,
} from '@/features/invite/constants';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studyRoomId = searchParams.get('studyRoomId');
  const [isAllowed, setIsAllowed] = useState(false);

  // 접근 제한 체크
  useEffect(() => {
    if (!studyRoomId || Number.isNaN(Number(studyRoomId))) {
      router.replace('/');
      return;
    }

    const visitedAt = sessionStorage.getItem(INVITE_VISITED_KEY);
    const isValidSession =
      visitedAt && Date.now() - parseInt(visitedAt, 10) < INVITE_VALIDITY_MS;

    if (!isValidSession) {
      router.replace('/');
      return;
    }

    sessionStorage.removeItem(INVITE_VISITED_KEY);
    setIsAllowed(true);
  }, [studyRoomId, router]);

  return (
    <main className="bg-gray-white tablet:pt-58 desktop:pt-30 mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full justify-center pt-35">
      {isAllowed && <InviteSuccessContent studyRoomId={Number(studyRoomId)} />}
    </main>
  );
}
