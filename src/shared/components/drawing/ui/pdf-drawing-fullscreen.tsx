'use client';

import { useEffect, useRef, useState } from 'react';

import { loadPageStrokes, savePageStrokes } from '../model/drawing-storage';
import { useStrokes } from '../model/use-strokes';
import type { DrawingTool, Stroke } from '../types';
import { exportPdf } from '../utils/export-pdf';
import { DrawingToolbar } from './drawing-toolbar';
import { PdfDrawingOverlay } from './pdf-drawing-overlay';
import { PdfPanel } from './pdf-panel';

const DEFAULT_TOOL: DrawingTool = 'pen';
const DEFAULT_COLOR = '#1a1a1a';
const DEFAULT_SIZE = 4;
const AUTO_SAVE_DELAY = 700;
const MAX_PAGES = 5;

type PdfDrawingFullscreenProps = {
  pdfUrl?: string;
  documentId: string;
  onClose: () => void;
};

export function PdfDrawingFullscreen({
  pdfUrl,
  documentId,
  onClose,
}: PdfDrawingFullscreenProps) {
  const [tool, setTool] = useState<DrawingTool>(DEFAULT_TOOL);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // PDF 관련 상태
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isPdfPanelOpen, setIsPdfPanelOpen] = useState(true);

  // 페이지 초과 모달
  const [pageLimitModal, setPageLimitModal] = useState<{
    actualPages: number;
  } | null>(null);
  // 전체 지우기 확인 모달
  const [showClearModal, setShowClearModal] = useState(false);

  const {
    strokes,
    addStroke,
    eraseStrokes,
    undo,
    redo,
    canUndo,
    canRedo,
    setStrokes,
  } = useStrokes();

  const allStrokesRef = useRef<Record<number, Stroke[]>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pdfObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!uploadedPdf) return;
    const url = URL.createObjectURL(uploadedPdf);
    pdfObjectUrlRef.current = url;
    return () => URL.revokeObjectURL(url);
  }, [uploadedPdf]);

  useEffect(() => {
    loadPageStrokes(documentId, currentPage).then((saved) => {
      setStrokes(saved);
      allStrokesRef.current[currentPage] = saved;
    });
  }, [documentId, currentPage, setStrokes]);

  const scheduleSave = (nextStrokes: Stroke[]) => {
    allStrokesRef.current[currentPage] = nextStrokes;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await savePageStrokes(documentId, currentPage, nextStrokes);
        setSaveStatus('saved');
        setTimeout(
          () => setSaveStatus((s) => (s === 'saved' ? 'idle' : s)),
          2000
        );
      } catch {
        setSaveStatus('error');
      }
    }, AUTO_SAVE_DELAY);
  };

  const handleStrokeAdd = (stroke: Stroke) => {
    addStroke({ ...stroke, pageNumber: currentPage });
    scheduleSave([...strokes, { ...stroke, pageNumber: currentPage }]);
  };

  const handleStrokeErase = (ids: string[]) => {
    eraseStrokes(ids);
    scheduleSave(strokes.filter((s) => !ids.includes(s.id)));
  };

  const handleClearAll = async () => {
    // 모든 페이지 스트로크 제거 + IndexedDB 동기화
    for (let p = 1; p <= totalPages; p++) {
      await savePageStrokes(documentId, p, []);
    }
    allStrokesRef.current = {};
    setStrokes([]);
    setShowClearModal(false);
  };

  const handleSave = async () => {
    const effectivePdfUrl = pdfObjectUrlRef.current ?? pdfUrl ?? null;
    await exportPdf(effectivePdfUrl, allStrokesRef.current);
  };

  const handleLoadSuccess = (numPages: number) => {
    const capped = Math.min(numPages, MAX_PAGES);
    setTotalPages(capped);
    if (numPages > MAX_PAGES) {
      setPageLimitModal({ actualPages: numPages });
    }
  };

  const handlePdfUpload = (file: File) => {
    setUploadedPdf(file);
    setCurrentPage(1);
    setTotalPages(1);
    setStrokes([]);
    allStrokesRef.current = {};
  };

  const handlePdfRemove = async () => {
    for (let p = 1; p <= totalPages; p++) {
      await savePageStrokes(documentId, p, []);
    }
    allStrokesRef.current = {};
    setStrokes([]);
    setUploadedPdf(null);
    setCurrentPage(1);
    setTotalPages(5);
  };

  const effectivePdfFile: string | File | undefined =
    uploadedPdf ?? pdfUrl ?? undefined;

  return (
    <div className="bg-gray-12 fixed inset-0 z-50 flex flex-col">
      {/* 상단 툴바 */}
      <DrawingToolbar
        tool={tool}
        color={color}
        size={size}
        canUndo={canUndo}
        canRedo={canRedo}
        saveStatus={saveStatus}
        onToolChange={setTool}
        onColorChange={setColor}
        onSizeChange={setSize}
        onUndo={undo}
        onRedo={redo}
        onClearAll={() => setShowClearModal(true)}
        onSave={handleSave}
        onClose={onClose}
      />

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 캔버스 영역 */}
        <div className="bg-gray-11 relative flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <PdfDrawingOverlay
              pdfFile={effectivePdfFile}
              pageNumber={currentPage}
              tool={tool}
              color={color}
              size={size}
              strokes={strokes}
              zoom={zoom}
              brightness={brightness}
              rotation={rotation}
              onStrokeAdd={handleStrokeAdd}
              onStrokeErase={handleStrokeErase}
              onLoadSuccess={handleLoadSuccess}
              fillScreen
            />
          </div>

          {/* 하단 바 */}
          <div className="border-gray-10 bg-gray-12 flex h-12 shrink-0 items-center justify-between border-t px-4">
            {/* 페이지 네비게이션 */}
            <div className="flex items-center gap-2">
              <PageNavBtn
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeftIcon />
              </PageNavBtn>

              <div className="text-gray-4 flex items-center gap-1.5 text-sm">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v))
                      setCurrentPage(Math.min(Math.max(1, v), totalPages));
                  }}
                  className="bg-gray-11 text-gray-3 focus:ring-orange-7 w-10 rounded-lg py-1 text-center text-sm focus:ring-1 focus:outline-none"
                />
                <span className="text-gray-6">/ {totalPages}</span>
              </div>

              <PageNavBtn
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
              >
                <ChevronRightIcon />
              </PageNavBtn>
            </div>

            {/* 줌 */}
            <div className="flex items-center gap-1.5">
              <PageNavBtn
                onClick={() =>
                  setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))
                }
                disabled={zoom <= 0.5}
              >
                <MinusIcon />
              </PageNavBtn>
              <span className="text-gray-4 w-14 text-center text-sm">
                {Math.round(zoom * 100)}%
              </span>
              <PageNavBtn
                onClick={() =>
                  setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))
                }
                disabled={zoom >= 2}
              >
                <PlusIcon />
              </PageNavBtn>
            </div>
          </div>
        </div>

        {/* 우측 PDF 패널 */}
        {isPdfPanelOpen ? (
          <PdfPanel
            pdfFile={uploadedPdf}
            totalPages={totalPages}
            currentPage={currentPage}
            zoom={zoom}
            brightness={brightness}
            rotation={rotation}
            onPdfUpload={handlePdfUpload}
            onPdfRemove={handlePdfRemove}
            onPageChange={setCurrentPage}
            onZoomChange={setZoom}
            onBrightnessChange={setBrightness}
            onRotationChange={setRotation}
            onClose={() => setIsPdfPanelOpen(false)}
          />
        ) : (
          <button
            onClick={() => setIsPdfPanelOpen(true)}
            className="border-gray-10 bg-gray-12 text-gray-5 hover:bg-gray-11 hover:text-gray-3 flex w-8 shrink-0 items-center justify-center border-l transition-colors"
            title="PDF 패널 열기"
          >
            <PdfOpenIcon />
          </button>
        )}
      </div>

      {/* 전체 지우기 확인 모달 */}
      {showClearModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-gray-900">전체 지우기</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              모든 페이지의 필기를 삭제합니다.
              <br />이 작업은 되돌릴 수 없어요.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                전체 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 초과 모달 */}
      {pageLimitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2">
              <WarningIcon />
              <h2 className="text-base font-bold text-gray-900">
                페이지 수 초과
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              업로드한 PDF는 총{' '}
              <span className="font-semibold text-gray-900">
                {pageLimitModal.actualPages}페이지
              </span>
              입니다.
              <br />
              필기는 최대{' '}
              <span className="font-semibold text-orange-600">
                {MAX_PAGES}페이지
              </span>
              까지만 가능해요.
              <br />
              앞에서부터 {MAX_PAGES}페이지만 사용하시겠어요?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setUploadedPdf(null);
                  setTotalPages(5);
                  setPageLimitModal(null);
                }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => setPageLimitModal(null)}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageNavBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-gray-4 hover:bg-gray-10 flex size-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
      />
    </svg>
  );
}

function PdfOpenIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="13"
      />
      <line
        x1="12"
        y1="17"
        x2="12.01"
        y2="17"
      />
    </svg>
  );
}
