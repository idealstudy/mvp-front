'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

// Sentry 경고 제거와 최상위 렌더링 에러 수집

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <main className="flex h-dvh flex-col items-center justify-center space-y-2 bg-[#F9F9F9] p-8 text-center text-red-500">
          <h2 className="text-xl font-semibold">에러가 발생했습니다</h2>
          <p className="mt-2">페이지를 표시하는 중 문제가 발생했습니다.</p>
          {error.digest && (
            <p className="mt-1 text-sm text-gray-500">
              에러 코드: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded bg-red-100 px-4 py-2 hover:bg-red-200"
          >
            다시 시도
          </button>
        </main>
      </body>
    </html>
  );
}
