'use client';

import { useEffect, useRef, useState } from 'react';

import type { DrawingTool, PageSize, Stroke } from '../types';
import { DrawingCanvas } from './drawing-canvas';
import { PdfViewer } from './pdf-viewer';

// A4 세로 기준 기본 캔버스 크기 (pt)
const BLANK_CANVAS_SIZE: PageSize = { width: 794, height: 1123 };

type PdfDrawingOverlayProps = {
  pdfFile?: string | File | ArrayBuffer;
  pageNumber: number;
  tool: DrawingTool;
  color: string;
  size: number;
  strokes: Stroke[];
  zoom?: number;
  brightness?: number;
  rotation?: number;
  onStrokeAdd: (stroke: Stroke) => void;
  onStrokeErase: (ids: string[]) => void;
  onLoadSuccess: (totalPages: number) => void;
  onPageSizeChange?: (size: PageSize) => void;
  /** true면 부모 컨테이너를 꽉 채우며 캔버스를 스케일링 */
  fillScreen?: boolean;
};

export function PdfDrawingOverlay({
  pdfFile,
  pageNumber,
  tool,
  color,
  size,
  strokes,
  zoom = 1,
  brightness = 100,
  rotation = 0,
  onStrokeAdd,
  onStrokeErase,
  onLoadSuccess,
  onPageSizeChange,
  fillScreen = false,
}: PdfDrawingOverlayProps) {
  const [pageSize, setPageSize] = useState<PageSize>({ width: 0, height: 0 });
  // fillScreen: 외부 컨테이너 관찰용 ref
  const outerRef = useRef<HTMLDivElement>(null);
  // fillScreen: 내부 transform 대상 ref
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!pdfFile) {
      setPageSize(BLANK_CANVAS_SIZE);
      onPageSizeChange?.(BLANK_CANVAS_SIZE);
      onLoadSuccess(5);
    }
  }, [pdfFile, onLoadSuccess, onPageSizeChange]);

  // fillScreen 모드: 외부 컨테이너 크기에 맞춰 fit scale 계산
  useEffect(() => {
    if (!fillScreen || pageSize.width === 0) return;

    const updateScale = () => {
      const el = outerRef.current;
      if (!el) return;
      const availW = el.clientWidth;
      const availH = el.clientHeight;
      const fitScale = Math.min(
        availW / pageSize.width,
        availH / pageSize.height
      );
      setScale(fitScale * zoom);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [fillScreen, pageSize, zoom]);

  const handlePageSizeChange = (s: PageSize) => {
    setPageSize(s);
    onPageSizeChange?.(s);
  };

  const innerContent = (
    <>
      {pdfFile ? (
        <PdfViewer
          file={pdfFile}
          pageNumber={pageNumber}
          zoom={zoom}
          brightness={brightness}
          rotation={rotation}
          onLoadSuccess={onLoadSuccess}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : (
        <div
          style={{
            width: BLANK_CANVAS_SIZE.width,
            height: BLANK_CANVAS_SIZE.height,
          }}
          className="bg-white"
        />
      )}
      {pageSize.width > 0 && (
        <DrawingCanvas
          strokes={strokes}
          tool={tool}
          color={color}
          size={size}
          pageSize={pageSize}
          onStrokeAdd={onStrokeAdd}
          onStrokeErase={onStrokeErase}
        />
      )}
    </>
  );

  if (fillScreen) {
    // transform: scale() 은 레이아웃 크기를 바꾸지 않으므로
    // 래퍼를 스케일된 시각적 크기로 고정하고 내부를 absolute로 처리
    const scaledW = pageSize.width > 0 ? pageSize.width * scale : 0;
    const scaledH = pageSize.height > 0 ? pageSize.height * scale : 0;

    return (
      <div
        ref={outerRef}
        className="flex h-full w-full items-center justify-center overflow-hidden"
      >
        {pageSize.width > 0 && (
          <div
            style={{
              width: scaledW,
              height: scaledH,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div
              ref={containerRef}
              className="absolute top-0 left-0 shadow-xl"
              style={{
                width: pageSize.width,
                height: pageSize.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {innerContent}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block shadow-xl"
    >
      {innerContent}
    </div>
  );
}
