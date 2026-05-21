'use client';

import { cn } from '@/shared/lib';

import type { DrawingTool } from '../types';

const PEN_COLORS = [
  '#1a1a1a',
  '#e83600',
  '#2563eb',
  '#16a34a',
  '#9333ea',
  '#f59e0b',
];

const HIGHLIGHTER_COLORS = [
  '#fde047',
  '#86efac',
  '#93c5fd',
  '#f9a8d4',
  '#fdba74',
  '#d9f99d',
];

const PEN_SIZES = [2, 4, 7];

type DrawingToolbarProps = {
  tool: DrawingTool;
  color: string;
  size: number;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onToolChange: (tool: DrawingTool) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  onSave: () => void;
  onClose: () => void;
};

export function DrawingToolbar({
  tool,
  color,
  size,
  canUndo,
  canRedo,
  saveStatus,
  onToolChange,
  onColorChange,
  onSizeChange,
  onUndo,
  onRedo,
  onClearAll,
  onSave,
  onClose,
}: DrawingToolbarProps) {
  const colors = tool === 'highlighter' ? HIGHLIGHTER_COLORS : PEN_COLORS;

  const handleToolChange = (newTool: DrawingTool) => {
    onToolChange(newTool);
    if (newTool === 'pen') onColorChange(PEN_COLORS[0]!);
    else if (newTool === 'highlighter') onColorChange(HIGHLIGHTER_COLORS[0]!);
  };

  return (
    <div className="border-gray-10 bg-gray-12 flex h-14 shrink-0 items-center border-b px-4">
      {/* 왼쪽 spacer (오른쪽과 균형 맞춰 가운데 정렬) */}
      <div className="flex-1" />

      {/* ── 가운데: 모든 도구 ── */}
      <div className="flex items-center gap-3">
        {/* 도구 선택 */}
        <div className="bg-gray-11 flex items-center gap-0.5 rounded-xl p-1">
          <ToolButton
            active={tool === 'pen'}
            onClick={() => handleToolChange('pen')}
            title="펜"
          >
            <PenIcon />
          </ToolButton>
          <ToolButton
            active={tool === 'highlighter'}
            onClick={() => handleToolChange('highlighter')}
            title="형광펜"
          >
            <HighlighterIcon />
          </ToolButton>
          <ToolButton
            active={tool === 'eraser'}
            onClick={() => handleToolChange('eraser')}
            title="지우개"
          >
            <EraserIcon />
          </ToolButton>
        </div>

        {tool !== 'eraser' && <Divider />}

        {/* 색상 선택 */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                title={c}
                onClick={() => onColorChange(c)}
                className={cn(
                  'size-5 rounded-full transition-transform hover:scale-110',
                  color === c &&
                    'ring-offset-gray-12 scale-110 ring-2 ring-white ring-offset-2'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {tool !== 'eraser' && <Divider />}

        {/* 굵기 선택 */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-1.5">
            {PEN_SIZES.map((s) => (
              <button
                key={s}
                title={`굵기 ${s}`}
                onClick={() => onSizeChange(s)}
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg transition-colors',
                  size === s ? 'bg-orange-7' : 'hover:bg-gray-10'
                )}
              >
                <span
                  className="rounded-full bg-white"
                  style={{ width: s * 2.5 + 2, height: s * 2.5 + 2 }}
                />
              </button>
            ))}
          </div>
        )}

        <Divider />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <IconButton
            onClick={onUndo}
            disabled={!canUndo}
            title="실행 취소"
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            onClick={onRedo}
            disabled={!canRedo}
            title="다시 실행"
          >
            <RedoIcon />
          </IconButton>
        </div>

        <Divider />

        {/* 전체 지우기 */}
        <IconButton
          onClick={onClearAll}
          title="전체 지우기"
        >
          <TrashIcon />
        </IconButton>
      </div>

      {/* 오른쪽: 저장 상태 + 버튼 */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <span
          className={cn(
            'inline-block w-14 text-center text-xs',
            saveStatusClass(saveStatus)
          )}
        >
          {saveStatusText(saveStatus)}
        </span>
        <button
          onClick={onSave}
          className="bg-orange-7 hover:bg-orange-8 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors"
        >
          PDF 저장
        </button>
        <button
          onClick={onClose}
          className="border-gray-9 text-gray-4 hover:bg-gray-11 rounded-xl border px-5 py-2 text-sm font-semibold transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="bg-gray-9 h-5 w-px shrink-0" />;
}

function ToolButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex size-9 items-center justify-center rounded-lg transition-colors',
        active ? 'bg-orange-7 text-white' : 'text-gray-4 hover:bg-gray-10'
      )}
    >
      {children}
    </button>
  );
}

function IconButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="text-gray-4 hover:bg-gray-10 flex size-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function saveStatusText(status: DrawingToolbarProps['saveStatus']) {
  if (status === 'saving') return '저장 중...';
  if (status === 'saved') return '저장됨';
  if (status === 'error') return '저장 실패';
  return '';
}

function saveStatusClass(status: DrawingToolbarProps['saveStatus']) {
  if (status === 'saving') return 'text-gray-5';
  if (status === 'saved') return 'text-system-safe';
  if (status === 'error') return 'text-system-warning';
  return 'text-transparent';
}

// ── 아이콘 ──────────────────────────────────────────────────────────────────

function PenIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function HighlighterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11-6 6v3h9l3-3" />
      <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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

function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function RedoIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
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
