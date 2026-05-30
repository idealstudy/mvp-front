import { cn } from '@/shared/lib';

// 드로잉 패널 전용 프레젠테이션 컴포넌트·아이콘 모음.
// (drawing-panel.tsx 본체 라인 수를 줄이기 위해 분리 — 로직 없음)

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── 하단 툴 버튼 ──────────────────────────────────────────────────────────────

export function PanelToolBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 min-w-[2.75rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-colors hover:bg-gray-50"
    >
      <span className={cn(active ? 'text-orange-500' : 'text-gray-400')}>
        {children}
      </span>
      <span
        className={cn(
          'text-[10px] leading-none font-medium whitespace-nowrap',
          active ? 'text-orange-500' : 'text-gray-400'
        )}
      >
        {label}
      </span>
    </button>
  );
}

// ─── 저장 상태 표시 ────────────────────────────────────────────────────────────

// 캔버스 좌하단에 absolute 오버레이로 표시한다. absolute라 idle 시 null 을 반환해도
// 툴바·캔버스 레이아웃에 영향을 주지 않는다(레이아웃 시프트 없음).
export function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  const saving = status === 'saving';
  return (
    <div
      className="border-gray-3 pointer-events-none absolute bottom-2 left-2 z-50 flex h-6 items-center gap-1 rounded-full border bg-white/85 px-2.5 text-[11px] font-medium whitespace-nowrap shadow-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
      title={
        status === 'error'
          ? 'IndexedDB 저장 실패 — 2초 후 자동 재시도'
          : undefined
      }
    >
      {status === 'error' ? (
        <span className="text-red-500">저장 실패</span>
      ) : (
        <span className="text-gray-9 flex items-center gap-1">
          {saving ? <SpinnerIcon /> : <CheckIcon />}
          {saving ? '저장 중' : '저장됨'}
        </span>
      )}
    </div>
  );
}

// ─── 아이콘 ───────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-spin"
      aria-hidden
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function CheckIcon() {
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
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function EmptyPencilIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d1d5db"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function TwoFingerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 11V5a1.5 1.5 0 0 1 3 0v5" />
      <path d="M11 10V4a1.5 1.5 0 0 1 3 0v6" />
      <path d="M14 10.5V7a1.5 1.5 0 0 1 3 0v6.5a6 6 0 0 1-6 6h-1.2a4 4 0 0 1-3-1.4l-3-3.4a1.5 1.5 0 0 1 2.2-2L8 14" />
    </svg>
  );
}

export function PanelPenIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#f97316' : '#9ca3af'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function PanelHighlighterIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#f97316' : '#9ca3af'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11-6 6v3h9l3-3" />
      <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
    </svg>
  );
}

export function PanelEraserIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#f97316' : '#9ca3af'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  );
}

export function ToolbarTrashIcon() {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function UndoIcon() {
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
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

export function RedoIcon() {
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
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </svg>
  );
}
