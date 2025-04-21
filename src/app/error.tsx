'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { AuthError, ForbiddenError } from '@/lib/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      fetch('/api/logout', { method: 'POST' }).then(() => {
        router.replace('/login');
      });
    }
  }, [error, router]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 p-8 text-center text-red-500">
      <h2 className="text-xl font-semibold">에러 발생 😢</h2>
      <p className="mt-2">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : '페이지를 표시하는 중 문제가 발생했습니다.'}
      </p>
      {error.digest && (
        <p className="mt-1 text-sm text-gray-500">에러 코드: {error.digest}</p>
      )}
      <button
        onClick={() => reset()}
        className="mt-4 rounded bg-red-100 px-4 py-2 hover:bg-red-200"
      >
        다시 시도
      </button>
    </div>
  );
}
