'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type { PageSize } from '../types';

// pdf.js worker — Next.js public 폴더 또는 CDN 경로
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_BASE_SCALE = 1.5;

type PdfViewerProps = {
  file: string | File | ArrayBuffer;
  pageNumber: number;
  zoom?: number;
  brightness?: number;
  rotation?: number;
  onLoadSuccess: (totalPages: number) => void;
  onPageSizeChange: (size: PageSize) => void;
};

export function PdfViewer({
  file,
  pageNumber,
  zoom = 1,
  brightness = 100,
  rotation = 0,
  onLoadSuccess,
  onPageSizeChange,
}: PdfViewerProps) {
  return (
    <div style={{ filter: `brightness(${brightness}%)` }}>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
        loading={<PdfSkeleton />}
        error={<PdfError />}
      >
        <Page
          pageNumber={pageNumber}
          scale={PDF_BASE_SCALE * zoom}
          rotate={rotation}
          onRenderSuccess={(page) => {
            onPageSizeChange({ width: page.width, height: page.height });
          }}
          loading={<PdfSkeleton />}
        />
      </Document>
    </div>
  );
}

function PdfSkeleton() {
  return (
    <div className="bg-gray-2 flex size-full min-h-[600px] min-w-[400px] animate-pulse items-center justify-center rounded-lg">
      <span className="text-gray-6 text-sm">PDF 불러오는 중...</span>
    </div>
  );
}

function PdfError() {
  return (
    <div className="bg-gray-2 flex size-full min-h-[600px] min-w-[400px] items-center justify-center rounded-lg">
      <span className="text-system-warning text-sm">
        PDF를 불러올 수 없습니다.
      </span>
    </div>
  );
}
