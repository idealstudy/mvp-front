'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { DrawingPanel } from '@/shared/components/drawing/ui/drawing-panel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function TestPageContent() {
  const searchParams = useSearchParams();
  const singlePanel = searchParams.get('panels') === '1';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            DrawingPanel 테스트
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            패널 내부를 스크롤하면 캔버스가 자동 확장됩니다.
            {singlePanel
              ? ' (단일 패널 모드: ?panels=1)'
              : ' (다중 패널 — 단일 패널 검증: ?panels=1)'}
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-600">
            기본 (제출하기 버튼)
          </h2>
          <DrawingPanel
            documentId="test-panel-001"
            panelHeight={400}
            expandRatio={0.3}
            actionButton={
              <button
                onClick={() => alert('제출!')}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                제출하기
              </button>
            }
          />
        </section>

        {!singlePanel && (
          <>
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-600">
                커스텀 버튼 (저장하기)
              </h2>
              <DrawingPanel
                documentId="test-panel-002"
                panelHeight={300}
                expandRatio={0.3}
                actionButton={
                  <button
                    onClick={() => alert('저장!')}
                    className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    저장하기
                  </button>
                }
              />
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-600">
                액션 버튼 없음
              </h2>
              <DrawingPanel
                documentId="test-panel-003"
                panelHeight={300}
                expandRatio={0.3}
              />
            </section>
          </>
        )}

        <div className="h-40" />
      </div>
    </div>
  );
}

export default function TestDrawingPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-gray-500">
            로딩 중…
          </div>
        }
      >
        <TestPageContent />
      </Suspense>
    </QueryClientProvider>
  );
}
