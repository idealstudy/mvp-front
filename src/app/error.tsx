'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { sessionQueryKey } from '@/features/auth/services/query-options';
import { parseJson } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export interface ParsedError {
  statusCode: number;
  name: string;
  message: string;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const parsedError = parseJson<ParsedError>(error.message);

  useEffect(() => {
    if (parsedError?.statusCode === 401 || parsedError?.statusCode === 403) {
      fetch('/api/logout', { method: 'POST' }).then(() => {
        queryClient.setQueryData(sessionQueryKey, null);
        router.replace('/login');
      });
    }
  }, [router, queryClient, parsedError?.statusCode]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 p-8 text-center text-red-500">
      <h2 className="text-xl font-semibold">에러 발생 😢</h2>
      <p className="mt-2">
        {process.env.NODE_ENV === 'development'
          ? parsedError?.message || error.message
          : '페이지를 표시하는 중 문제가 발생했습니다.'}
      </p>
      {error.digest && (
        <p className="mt-1 text-sm text-gray-500">에러 코드: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded bg-red-100 px-4 py-2 hover:bg-red-200"
      >
        다시 시도
      </button>
    </div>
  );
}
