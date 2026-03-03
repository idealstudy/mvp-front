'use client';

import { type ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from '@/providers';
import { FullScreenLoader } from '@/shared/components/loading';
import { PUBLIC } from '@/shared/constants/route';

interface SessionGuardProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

const SessionGuardFallback = () => {
  return <FullScreenLoader title={'디에듀를 불러오는 중...'} />;
};

export const SessionGuard = ({
  children,
  redirectTo = PUBLIC.CORE.LOGIN,
  fallback,
}: SessionGuardProps) => {
  const router = useRouter();
  const { status } = useSession();

  const resolvedFallback =
    fallback ?? (status === 'loading' ? <SessionGuardFallback /> : null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const token = new URLSearchParams(window.location.search).get('token');
      const loginUrl = token
        ? `${redirectTo}?token=${encodeURIComponent(token)}`
        : redirectTo;
      router.replace(loginUrl);
    }
  }, [status, router, redirectTo]);

  if (status === 'authenticated') return <>{children}</>;
  if (status === 'loading') return <>{resolvedFallback}</>;
  if (status === 'error') {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p className="mb-2 text-lg font-semibold">
          세션 정보를 불러오는 데 실패했습니다.
        </p>
        <p className="text-sm text-gray-200">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return <>{resolvedFallback}</>;
};
