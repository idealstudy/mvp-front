'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/shared/lib';

import {
  loadCanvasHeight,
  loadPageStrokes,
  saveCanvasHeight,
  savePageStrokes,
} from '../model/drawing-storage';
import { useStrokes } from '../model/use-strokes';
import type { DrawingTool, Stroke } from '../types';
import { DrawingCanvas } from './drawing-canvas';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const PANEL_COLORS = [
  '#1a1a1a',
  '#e83600',
  '#2563eb',
  '#16a34a',
  '#6b7280',
] as const;

const DEFAULT_PANEL_HEIGHT = 400;
const DEFAULT_EXPAND_RATIO = 0.3;
const AUTO_SAVE_DELAY_MS = 700;
/** 센티넬이 스크롤 뷰포트에 이 시간(ms) 이상 머물면 캔버스 확장 */
const SENTINEL_DWELL_MS = 500;
/** IndexedDB에서 복원할 최대 캔버스 높이 — 비정상 값으로 흰 화면 방지 */
const MAX_CANVAS_HEIGHT = 8000;

// ─── 타입 ────────────────────────────────────────────────────────────────────

type DrawingPanelProps = {
  documentId: string;
  /** 패널 외부 가시 높이(px). 기본값 400 */
  panelHeight?: number;
  /**
   * 캔버스 초기 내부 높이(px). panelHeight보다 커야 내부 스크롤이 생깁니다.
   * 기본값: panelHeight * 1.5
   */
  initialCanvasHeight?: number;
  /**
   * 센티넬이 보일 때 캔버스를 늘리는 비율.
   * 기본값 0.3 (현재 높이의 30%)
   */
  expandRatio?: number;
  /** 하단 바 우측에 렌더링될 커스텀 버튼 */
  actionButton?: React.ReactNode;
};

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export function DrawingPanel({
  documentId,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  initialCanvasHeight,
  expandRatio = DEFAULT_EXPAND_RATIO,
  actionButton,
}: DrawingPanelProps) {
  const defaultCanvasHeight =
    initialCanvasHeight ?? Math.round(panelHeight * 1.5);

  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState<string>(PANEL_COLORS[0]);
  const [size] = useState(4);
  const [canvasHeight, setCanvasHeight] = useState(defaultCanvasHeight);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 스크롤 컨테이너 ref — IntersectionObserver root + 터치 스크롤 대상
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExpandingRef = useRef(false);

  const {
    strokes,
    addStroke,
    eraseStrokes,
    clearStrokes,
    setStrokes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStrokes();

  const strokesForSaveRef = useRef(strokes);
  strokesForSaveRef.current = strokes;

  /** 비동기 로드 완료 전 사용자가 그린 경우 저장 데이터로 덮어쓰지 않음 */
  const userDrewBeforeLoadRef = useRef(false);

  // ── 초기 로드 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    userDrewBeforeLoadRef.current = false;
    let cancelled = false;

    async function load() {
      const [savedStrokes, savedHeight] = await Promise.all([
        loadPageStrokes(documentId, 1),
        loadCanvasHeight(documentId),
      ]);
      if (cancelled) return;

      if (!userDrewBeforeLoadRef.current) {
        setStrokes(savedStrokes);
      }

      if (savedHeight !== null) {
        const clamped = Math.min(
          Math.max(savedHeight, defaultCanvasHeight),
          MAX_CANVAS_HEIGHT
        );
        setCanvasHeight(clamped);
      } else {
        setCanvasHeight(defaultCanvasHeight);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [documentId, setStrokes, defaultCanvasHeight]);

  // ── 캔버스 너비 측정 (스크롤 컨테이너 기준) ───────────────────────────────

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const w = el.clientWidth;
      if (w > 0) setCanvasWidth(w);
    };
    updateWidth();

    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── 센티넬 → 내부 스크롤 끝 도달 시 캔버스 자동 확장 ────────────────────

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root) return;

    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (!entry.isIntersecting) {
          if (dwellTimer) {
            clearTimeout(dwellTimer);
            dwellTimer = null;
          }
          return;
        }

        if (dwellTimer || isExpandingRef.current) return;

        dwellTimer = setTimeout(() => {
          dwellTimer = null;
          if (isExpandingRef.current) return;
          isExpandingRef.current = true;
          setCanvasHeight((prev) => {
            const next = Math.round(prev + prev * expandRatio);
            saveCanvasHeight(documentId, next);
            return next;
          });
          setTimeout(() => {
            isExpandingRef.current = false;
          }, 600);
        }, SENTINEL_DWELL_MS);
      },
      {
        root,
        threshold: 0.5,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [expandRatio, documentId]);

  // ── 스크롤: 펜·한 손가락은 스크롤 안 함, 두 손가락으로만 스크롤 ─────────

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let lastCenterY = 0;

    const getCenterY = (touches: TouchList) =>
      (touches[0]!.clientY + touches[1]!.clientY) / 2;

    /** Apple Pencil은 touchType 'stylus' — preventDefault 하면 pointerdown 누락 가능 */
    const isFingerTouch = (touch: Touch) => {
      const touchType = (touch as Touch & { touchType?: string }).touchType;
      return touchType !== 'stylus';
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        lastCenterY = getCenterY(e.touches);
        e.preventDefault();
        return;
      }
      const touch = e.touches[0];
      if (touch && isFingerTouch(touch)) e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        const centerY = getCenterY(e.touches);
        el.scrollTop -= centerY - lastCenterY;
        lastCenterY = centerY;
        e.preventDefault();
        return;
      }
      const touch = e.touches[0];
      if (touch && isFingerTouch(touch)) e.preventDefault();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // ── 자동 저장 ──────────────────────────────────────────────────────────────

  const scheduleSave = useCallback(
    (getNextStrokes: (prev: Stroke[]) => Stroke[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          const nextStrokes = getNextStrokes(strokesForSaveRef.current);
          await savePageStrokes(documentId, 1, nextStrokes);
        } catch {
          /* silent */
        }
      }, AUTO_SAVE_DELAY_MS);
    },
    [documentId]
  );

  const handleStrokeAdd = useCallback(
    (stroke: Stroke) => {
      userDrewBeforeLoadRef.current = true;
      addStroke(stroke);
      scheduleSave((prev) => [...prev, stroke]);
    },
    [addStroke, scheduleSave]
  );

  const handleStrokeErase = useCallback(
    (ids: string[]) => {
      eraseStrokes(ids);
      scheduleSave((prev) => prev.filter((s) => !ids.includes(s.id)));
    },
    [eraseStrokes, scheduleSave]
  );

  const handleClearAll = useCallback(async () => {
    clearStrokes();
    await savePageStrokes(documentId, 1, []);
    setShowClearConfirm(false);
  }, [clearStrokes, documentId]);

  const handleToolChange = useCallback((next: DrawingTool) => {
    setTool(next);
    if (next === 'pen') setColor(PANEL_COLORS[0]);
  }, []);

  const pageSize = useMemo(
    () => ({ width: canvasWidth, height: canvasHeight }),
    [canvasWidth, canvasHeight]
  );

  const scrollCursorClass =
    tool === 'select'
      ? 'cursor-default'
      : tool === 'eraser'
        ? 'cursor-cell'
        : 'cursor-crosshair';

  return (
    <div className="relative isolate flex flex-col overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 select-none">
      {/* ── 스크롤 캔버스 영역 — 포인터 hit area = panelHeight ── */}
      <div
        ref={scrollContainerRef}
        className={cn(
          'overflow-y-scroll overscroll-y-contain bg-white',
          scrollCursorClass
        )}
        style={{ height: panelHeight, touchAction: 'pan-y' }}
      >
        {/* 캔버스 래퍼 — 내부 높이가 커지면 스크롤 생김 */}
        <div
          ref={canvasWrapperRef}
          className="relative overflow-hidden"
          style={{ height: canvasHeight }}
        >
          {/* 빈 상태 안내 */}
          {strokes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
              <EmptyPencilIcon />
              <p className="text-sm font-bold text-gray-700">풀이 적어봐요</p>
              <p className="text-xs text-gray-400">
                여기에 자유롭게 그림이나 식을 작성해보세요.
              </p>
            </div>
          )}

          {/* 드로잉 캔버스 */}
          {canvasWidth > 0 && (
            <DrawingCanvas
              strokes={strokes}
              tool={tool}
              color={color}
              size={size}
              pageSize={pageSize}
              onStrokeAdd={handleStrokeAdd}
              onStrokeErase={handleStrokeErase}
            />
          )}

          {/* 자동 확장 센티넬 — 캔버스(흰색)와 구분되는 배경 */}
          <div
            ref={sentinelRef}
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 flex h-14 flex-col items-center justify-center gap-0.5 border-t-2 border-orange-400 bg-orange-50 shadow-[0_-4px_12px_rgba(249,115,22,0.12)]"
          >
            <span className="text-xs font-bold text-orange-800">
              ↓ 여기까지 스크롤하면 캔버스가 확장돼요
            </span>
            <span className="text-[10px] font-medium text-orange-700/80">
              두 손가락으로 스크롤 · 펜은 필기 전용
            </span>
          </div>
        </div>
      </div>

      {/* ── 하단 툴바 ── */}
      <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
        {/* 도구 버튼 그룹 */}
        <div className="flex items-center gap-1">
          <PanelToolBtn
            active={tool === 'pen'}
            onClick={() => handleToolChange('pen')}
            label="펜"
          >
            <PanelPenIcon active={tool === 'pen'} />
          </PanelToolBtn>
          <PanelToolBtn
            active={tool === 'eraser'}
            onClick={() => handleToolChange('eraser')}
            label="지우개"
          >
            <PanelEraserIcon active={tool === 'eraser'} />
          </PanelToolBtn>
          <PanelToolBtn
            active={tool === 'select'}
            onClick={() => handleToolChange('select')}
            label="선택"
          >
            <PanelSelectIcon active={tool === 'select'} />
          </PanelToolBtn>
        </div>

        {/* 색상 팔레트 */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-1.5">
            {PANEL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'size-6 rounded-full transition-transform hover:scale-110',
                  color === c &&
                    'scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-50'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        <div className="h-5 w-px shrink-0 bg-gray-200" />

        {/* 전체 지우기 */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ToolbarTrashIcon />
          <span>전체 지우기</span>
        </button>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            title="실행 취소"
          >
            <UndoIcon />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            title="다시 실행"
          >
            <RedoIcon />
          </button>
        </div>

        {actionButton}
      </div>

      {/* ── 전체 지우기 확인 모달 ── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-gray-900">전체 지우기</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              모든 필기를 삭제합니다.
              <br />이 작업은 되돌릴 수 없어요.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
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
    </div>
  );
}

// ─── 하단 툴 버튼 ──────────────────────────────────────────────────────────────

function PanelToolBtn({
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
      className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
    >
      <span className={cn(active ? 'text-orange-500' : 'text-gray-400')}>
        {children}
      </span>
      <span
        className={cn(
          'text-[10px] font-medium',
          active ? 'text-orange-500' : 'text-gray-400'
        )}
      >
        {label}
      </span>
    </button>
  );
}

// ─── 아이콘 ───────────────────────────────────────────────────────────────────

function EmptyPencilIcon() {
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

function PanelPenIcon({ active }: { active: boolean }) {
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

function PanelEraserIcon({ active }: { active: boolean }) {
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

function PanelSelectIcon({ active }: { active: boolean }) {
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
      <path d="M4 4l7 18 3-7 7-3z" />
      <path d="M14 14l4 4" />
    </svg>
  );
}

function ToolbarTrashIcon() {
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

function UndoIcon() {
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

function RedoIcon() {
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
