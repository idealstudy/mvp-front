'use client';

import { useEffect, useRef, useState } from 'react';

import { loadPageStrokes } from '@/shared/components/drawing/model/drawing-storage';
import { renderStrokes } from '@/shared/components/drawing/model/use-drawing-canvas';
import type { Stroke } from '@/shared/components/drawing/types';
import { PdfDrawingFullscreen } from '@/shared/components/drawing/ui/pdf-drawing-fullscreen';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

// 오프스크린 캔버스: 필기를 실제 A4 비율로 렌더링
const OFFSCREEN_W = 800;
const OFFSCREEN_H = Math.round(OFFSCREEN_W * (1123 / 794));
// 썸네일에 실제로 보여줄 크롭 높이 (위에서부터 이 픽셀만큼 잘라냄)
const THUMB_CROP_H = 280;

export function DrawingNodeView({
  node,
  selected,
  deleteNode,
  editor,
}: NodeViewProps) {
  const { pdfUrl, documentId } = node.attrs as {
    pdfUrl: string | null;
    documentId: string | null;
  };

  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isEditable = editor.isEditable;

  useEffect(() => {
    if (!documentId) return;
    loadPageStrokes(documentId, 1).then((strokes: Stroke[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // A4 전체 해상도로 오프스크린 렌더링
      const offscreen = document.createElement('canvas');
      offscreen.width = OFFSCREEN_W;
      offscreen.height = OFFSCREEN_H;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) renderStrokes(offCtx, strokes);

      // 위에서부터 THUMB_CROP_H 픽셀만 잘라서 썸네일 캔버스에 복사
      canvas.width = OFFSCREEN_W;
      canvas.height = THUMB_CROP_H;
      const ctx = canvas.getContext('2d');
      if (ctx)
        ctx.drawImage(
          offscreen,
          0,
          0,
          OFFSCREEN_W,
          THUMB_CROP_H,
          0,
          0,
          OFFSCREEN_W,
          THUMB_CROP_H
        );
    });
  }, [documentId, isOpen]);

  if (!documentId) {
    return (
      <NodeViewWrapper>
        <div className="border-gray-3 bg-gray-1 text-gray-6 my-1 rounded-xl border border-dashed px-4 py-3 text-sm">
          필기 블록 오류: documentId가 없습니다.
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper contentEditable={false}>
      <div
        className={`group relative my-2 cursor-pointer overflow-hidden rounded-xl border transition-all ${
          selected
            ? 'border-orange-7 ring-orange-7/20 ring-2'
            : 'border-gray-3 hover:border-orange-7/60'
        }`}
        style={{ height: 220 }}
        onClick={() => setIsOpen(true)}
      >
        {/* 줄 노트 배경 */}
        <div className="absolute inset-0 bg-white">
          <NoteLines />
        </div>

        {/* 필기 미리보기 캔버스 */}
        <canvas
          ref={canvasRef}
          width={OFFSCREEN_W}
          height={THUMB_CROP_H}
          className="absolute inset-0 h-full w-full"
        />

        {/* 상시 안내 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-6 py-4 shadow-sm backdrop-blur-sm transition-transform group-hover:scale-105">
            <EditNoteIcon />
            <div className="text-center leading-snug">
              <p className="text-sm font-semibold text-gray-800">
                클릭해서 필기 시작
              </p>
              <p className="text-xs text-gray-500">
                풀스크린으로 편집할 수 있어요
              </p>
            </div>
          </div>
        </div>

        {/* 삭제 버튼 (편집 모드에서만) */}
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNode();
            }}
            className="absolute top-2 right-2 rounded-full bg-white/70 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white"
            title="블록 삭제"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {isOpen && (
        <PdfDrawingFullscreen
          pdfUrl={pdfUrl ?? undefined}
          documentId={documentId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </NodeViewWrapper>
  );
}

function NoteLines() {
  const lineCount = 10;
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {Array.from({ length: lineCount }).map((_, i) => {
        const y = ((i + 1) / (lineCount + 1)) * 100;
        return (
          <line
            key={i}
            x1="0"
            y1={`${y}%`}
            x2="100"
            y2={`${y}%`}
            stroke="#e9e9e9"
            strokeWidth="0.3"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

function EditNoteIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f97316"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#666"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
