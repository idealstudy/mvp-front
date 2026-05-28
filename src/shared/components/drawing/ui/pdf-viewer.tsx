'use client';

import dynamic from 'next/dynamic';

import type { PdfViewerClientProps } from './pdf-viewer.client';

function PdfViewerLoading() {
  return (
    <div className="bg-gray-2 flex size-full min-h-[600px] min-w-[400px] animate-pulse items-center justify-center rounded-lg">
      <span className="text-gray-6 text-sm">PDF 불러오는 중...</span>
    </div>
  );
}

const PdfViewerClient = dynamic(
  () => import('./pdf-viewer.client').then((mod) => mod.PdfViewerClient),
  { ssr: false, loading: PdfViewerLoading }
);

export function PdfViewer(props: PdfViewerClientProps) {
  return <PdfViewerClient {...props} />;
}
