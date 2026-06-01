'use client';

import { useRef } from 'react';

type PdfPanelProps = {
  pdfFile: File | null;
  totalPages: number;
  currentPage: number;
  zoom: number;
  brightness: number;
  rotation: number;
  onPdfUpload: (file: File) => void;
  onPdfRemove: () => void;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onRotationChange: (rotation: number) => void;
  onClose: () => void;
};

export function PdfPanel({
  pdfFile,
  totalPages,
  currentPage,
  zoom,
  brightness,
  rotation,
  onPdfUpload,
  onPdfRemove,
  onPageChange,
  onZoomChange,
  onBrightnessChange,
  onRotationChange,
  onClose,
}: PdfPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') onPdfUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPdfUpload(file);
    e.target.value = '';
  };

  return (
    <div className="border-gray-10 bg-gray-12 flex w-64 shrink-0 flex-col border-l">
      {/* 헤더 */}
      <div className="border-gray-10 flex h-12 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <PdfIcon />
          <span className="text-gray-3 text-sm font-semibold">PDF 추가</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-5 hover:bg-gray-10 hover:text-gray-3 flex size-6 items-center justify-center rounded transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* 업로드 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-gray-9 bg-gray-11 hover:border-gray-7 hover:bg-gray-10 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-colors"
        >
          <UploadIcon />
          <p className="text-gray-5 text-center text-xs leading-relaxed">
            PDF 파일을 드래그거나
            <br />
            클릭하여 업로드
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 업로드된 파일 */}
        {pdfFile && (
          <div>
            <p className="text-gray-5 mb-2 text-xs font-medium">
              업로드된 파일
            </p>
            <div className="bg-gray-11 flex items-center gap-2 rounded-lg px-3 py-2">
              <PdfFileIcon />
              <div className="min-w-0 flex-1">
                <p className="text-gray-3 truncate text-xs font-medium">
                  {pdfFile.name}
                </p>
                <p className="text-gray-6 text-[10px]">{totalPages} 페이지</p>
              </div>
              <button
                onClick={onPdfRemove}
                className="text-gray-6 hover:bg-gray-9 hover:text-gray-3 flex size-5 shrink-0 items-center justify-center rounded transition-colors"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        )}

        {/* 표시 설정 — PDF가 있을 때만 */}
        {pdfFile && (
          <div>
            <p className="text-gray-5 mb-3 text-xs font-medium">표시 설정</p>
            <div className="flex flex-col gap-3">
              {/* 페이지 */}
              <div className="flex items-center justify-between">
                <label className="text-gray-5 text-xs">페이지</label>
                <select
                  value={currentPage}
                  onChange={(e) => onPageChange(Number(e.target.value))}
                  className="bg-gray-11 text-gray-3 border-gray-9 rounded-md border px-2 py-1 text-xs focus:outline-none"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <option
                        key={p}
                        value={p}
                      >
                        {p} / {totalPages}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 확대/축소 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-gray-5 text-xs">확대 / 축소</label>
                  <span className="text-gray-4 text-xs">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={200}
                  step={5}
                  value={Math.round(zoom * 100)}
                  onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* 회전 */}
              <div className="flex items-center justify-between">
                <label className="text-gray-5 text-xs">회전</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      onRotationChange((rotation - 90 + 360) % 360)
                    }
                    className="bg-gray-11 text-gray-4 hover:bg-gray-10 flex size-7 items-center justify-center rounded-md transition-colors"
                    title="반시계 방향 회전"
                  >
                    <RotateCCWIcon />
                  </button>
                  <button
                    onClick={() => onRotationChange((rotation + 90) % 360)}
                    className="bg-gray-11 text-gray-4 hover:bg-gray-10 flex size-7 items-center justify-center rounded-md transition-colors"
                    title="시계 방향 회전"
                  >
                    <RotateCWIcon />
                  </button>
                </div>
              </div>

              {/* 배경 밝기 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-gray-5 text-xs">배경 밝기</label>
                  <span className="text-gray-4 text-xs">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={5}
                  value={brightness}
                  onChange={(e) => onBrightnessChange(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 아이콘 ──────────────────────────────────────────────────────────────────

function PdfIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
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
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 16 12 12 8 16" />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="21"
      />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function PdfFileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function RotateCCWIcon() {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function RotateCWIcon() {
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
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
