'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/shared/lib';

import {
  loadCanvasHeight,
  loadPageStrokes,
  saveCanvasHeight,
  savePageStrokes,
} from '../model/drawing-storage';
import { EXPAND_HINT_HEIGHT_PX, usePanZoom } from '../model/use-pan-zoom';
import { useStrokes } from '../model/use-strokes';
import type { DrawingTool, Stroke } from '../types';
import { DrawingCanvas } from './drawing-canvas';
import { MinimapStrokes } from './drawing-minimap-strokes';
import {
  EmptyPencilIcon,
  PanelEraserIcon,
  PanelHighlighterIcon,
  PanelPenIcon,
  PanelToolBtn,
  RedoIcon,
  type SaveStatus,
  SaveStatusIndicator,
  ToolbarTrashIcon,
  TwoFingerIcon,
  UndoIcon,
} from './drawing-panel-icons';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const PANEL_COLORS = [
  '#1a1a1a',
  '#e83600',
  '#2563eb',
  '#16a34a',
  '#6b7280',
] as const;

/** 형광펜 전용 팔레트 (파스텔 — alpha 0.4로 렌더) */
const HIGHLIGHTER_COLORS = [
  '#fde047',
  '#86efac',
  '#93c5fd',
  '#f9a8d4',
  '#fdba74',
] as const;

/** 펜·형광펜 굵기 옵션 */
const PEN_SIZES = [2, 4, 7] as const;

const DEFAULT_PANEL_HEIGHT = 400;
const DEFAULT_EXPAND_RATIO = 0.3;
const AUTO_SAVE_DELAY_MS = 700;
/** 저장 실패 시 자동 재시도 간격 (성공할 때까지 반복) */
const SAVE_RETRY_DELAY_MS = 2000;
/** "저장됨" 표시를 유지하는 시간 — 이후 자동으로 숨김(idle) */
const SAVED_VISIBLE_MS = 1500;
/** IndexedDB에서 복원할 최대 캔버스 높이 — 비정상 값으로 흰 화면 방지 */
const MAX_CANVAS_HEIGHT = 8000;

// ─── 타입 ────────────────────────────────────────────────────────────────────

type DrawingPanelProps = {
  documentId: string;
  /** 패널 외부 가시 높이(px). 기본값 400 */
  panelHeight?: number;
  /** 획이 없을 때 캔버스 높이(px). 기본값: panelHeight와 동일 */
  initialCanvasHeight?: number;
  /** 확장 시 늘리는 비율. 기본값 0.3 (현재 높이의 30%) */
  expandRatio?: number;
  /** 하단 바 우측에 렌더링될 커스텀 버튼 */
  actionButton?: React.ReactNode;
  /** 개발: 획 완료 시 pointer 로그를 서버로 전송 */
  capturePointerSession?: boolean;
};

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export function DrawingPanel({
  documentId,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  initialCanvasHeight,
  expandRatio = DEFAULT_EXPAND_RATIO,
  actionButton,
  capturePointerSession,
}: DrawingPanelProps) {
  const emptyCanvasHeight = initialCanvasHeight ?? panelHeight;

  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState<string>(PANEL_COLORS[0]);
  // 펜·형광펜 굵기 (툴바 굵기 선택에서 변경)
  const [size, setSize] = useState<number>(PEN_SIZES[1]);
  const [canvasHeight, setCanvasHeight] = useState(emptyCanvasHeight);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const captureEnabled =
    capturePointerSession === true && process.env.NODE_ENV === 'development';

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortDrawingRef = useRef<(() => void) | null>(null);
  const loadGenerationRef = useRef(0);
  const loadCompletedRef = useRef(false);

  // 펜·형광펜이 각각 마지막으로 쓰던 색을 기억(툴 전환 시 복원)
  const penColorRef = useRef<string>(PANEL_COLORS[0]);
  const highlighterColorRef = useRef<string>(HIGHLIGHTER_COLORS[0]);

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

  const resetCanvasToComponentSize = useCallback(() => {
    setCanvasHeight(emptyCanvasHeight);
    void saveCanvasHeight(documentId, emptyCanvasHeight);
  }, [documentId, emptyCanvasHeight]);

  /** 필기 또는 이미 늘어난 캔버스면 하단 확장 슬롯 유지 */
  const hasExpandSlot =
    strokes.length > 0 || canvasHeight > emptyCanvasHeight + 1;

  /** 하단 1초 유지 완료 시: 캔버스 높이를 늘리고 획 layoutHeight를 freeze + 저장 */
  const expandCanvas = useCallback(() => {
    setCanvasHeight((prev) => {
      const next = Math.round(prev + prev * expandRatio);
      const frozen = strokesForSaveRef.current.map((stroke) => ({
        ...stroke,
        layoutHeight: stroke.layoutHeight ?? prev,
      }));
      strokesForSaveRef.current = frozen;
      setStrokes(frozen);
      void saveCanvasHeight(documentId, next);
      void savePageStrokes(documentId, 1, frozen);
      return next;
    });
  }, [documentId, expandRatio, setStrokes]);

  // 두 손가락 pan/zoom + 확장 홀드 + 미니맵 (제스처 로직 일체)
  const {
    panContainerRef,
    canvasWrapperRef,
    canvasScaledInnerRef,
    zoomBadgeRef,
    canvasWidth,
    zoom,
    minimap,
    fingerTouchCount,
    expandHoldProgress,
    isAtExpandScroll,
    showGestureHint,
    resetView,
  } = usePanZoom({
    canvasHeight,
    panelHeight,
    hasExpandSlot,
    onExpand: expandCanvas,
    abortDrawingRef,
  });

  // ── 초기 로드 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const generation = ++loadGenerationRef.current;
    userDrewBeforeLoadRef.current = false;
    loadCompletedRef.current = false;
    let cancelled = false;

    async function load() {
      const [savedStrokes, savedHeight] = await Promise.all([
        loadPageStrokes(documentId, 1),
        loadCanvasHeight(documentId),
      ]);
      if (cancelled || generation !== loadGenerationRef.current) return;

      let loadedCanvasHeight = emptyCanvasHeight;
      if (savedStrokes.length === 0) {
        setCanvasHeight(emptyCanvasHeight);
        if (savedHeight !== null && savedHeight !== emptyCanvasHeight) {
          void saveCanvasHeight(documentId, emptyCanvasHeight);
        }
      } else if (savedHeight !== null) {
        loadedCanvasHeight = Math.min(
          Math.max(savedHeight, emptyCanvasHeight),
          MAX_CANVAS_HEIGHT
        );
        setCanvasHeight(loadedCanvasHeight);
      } else {
        setCanvasHeight(emptyCanvasHeight);
      }

      if (!userDrewBeforeLoadRef.current) {
        setStrokes(
          savedStrokes.map((stroke) => ({
            ...stroke,
            layoutHeight: stroke.layoutHeight ?? loadedCanvasHeight,
          }))
        );
      }

      loadCompletedRef.current = true;
      resetView();
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [documentId, setStrokes, emptyCanvasHeight, resetView]);

  /** 지우개 등으로 획이 모두 사라지면 캔버스 높이를 컴포넌트 크기로 맞춤 */
  useEffect(() => {
    if (!loadCompletedRef.current || strokes.length > 0) return;
    if (canvasHeight === emptyCanvasHeight) return;
    resetCanvasToComponentSize();
  }, [
    strokes.length,
    canvasHeight,
    emptyCanvasHeight,
    resetCanvasToComponentSize,
  ]);

  // ── 자동 저장 ──────────────────────────────────────────────────────────────

  const persistStrokes = useCallback(
    async (strokesToSave: Stroke[]) => {
      await savePageStrokes(documentId, 1, strokesToSave);
      setSaveStatus('saved');
    },
    [documentId]
  );

  // 재시도는 자기 자신을 다시 예약하므로 ref로 최신 함수를 참조한다
  const scheduleSaveRetryRef = useRef<() => void>(() => {});
  const scheduleSaveRetry = useCallback(() => {
    if (saveRetryTimerRef.current) clearTimeout(saveRetryTimerRef.current);
    saveRetryTimerRef.current = setTimeout(async () => {
      saveRetryTimerRef.current = null;
      try {
        await persistStrokes(strokesForSaveRef.current);
      } catch {
        setSaveStatus('error');
        // 성공할 때까지 계속 재시도
        scheduleSaveRetryRef.current();
      }
    }, SAVE_RETRY_DELAY_MS);
  }, [persistStrokes]);
  scheduleSaveRetryRef.current = scheduleSaveRetry;

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (saveRetryTimerRef.current) clearTimeout(saveRetryTimerRef.current);
    };
  }, []);

  // "저장됨"은 일정 시간 후 자동으로 숨김(캔버스 좌하단을 계속 가리지 않도록)
  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const t = setTimeout(() => setSaveStatus('idle'), SAVED_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [saveStatus]);

  /**
   * 디바운스 자동저장. 타이머 발화 시점의 최신 strokes(`strokesForSaveRef`)를
   * 그대로 저장한다. 상태가 이미 반영돼 있으므로 별도 가공이 필요 없다.
   */
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (saveRetryTimerRef.current) {
      clearTimeout(saveRetryTimerRef.current);
      saveRetryTimerRef.current = null;
    }
    setSaveStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      saveTimerRef.current = null;
      try {
        await persistStrokes(strokesForSaveRef.current);
      } catch {
        setSaveStatus('error');
        scheduleSaveRetry();
      }
    }, AUTO_SAVE_DELAY_MS);
  }, [persistStrokes, scheduleSaveRetry]);

  const handleStrokeAdd = useCallback(
    (stroke: Stroke) => {
      userDrewBeforeLoadRef.current = true;
      addStroke(stroke);
      scheduleSave();
    },
    [addStroke, scheduleSave]
  );

  const handleStrokeErase = useCallback(
    (ids: string[]) => {
      eraseStrokes(ids);
      scheduleSave();
    },
    [eraseStrokes, scheduleSave]
  );

  const handleClearAll = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    strokesForSaveRef.current = [];
    clearStrokes();
    resetCanvasToComponentSize();
    setShowClearConfirm(false);
    void persistStrokes([]).catch(() => {
      setSaveStatus('error');
      scheduleSaveRetry();
    });
  }, [
    clearStrokes,
    persistStrokes,
    scheduleSaveRetry,
    resetCanvasToComponentSize,
  ]);

  const handleUndo = useCallback(() => {
    undo();
    scheduleSave();
  }, [undo, scheduleSave]);

  const handleRedo = useCallback(() => {
    redo();
    scheduleSave();
  }, [redo, scheduleSave]);

  // 색 선택 시 현재 툴의 마지막 색으로 기억
  const handleColorSelect = useCallback(
    (c: string) => {
      setColor(c);
      if (tool === 'highlighter') highlighterColorRef.current = c;
      else penColorRef.current = c;
    },
    [tool]
  );

  // 툴 전환 시 해당 툴이 마지막으로 쓰던 색을 복원(지우개는 색 변경 없음)
  const handleToolChange = useCallback((next: DrawingTool) => {
    setTool(next);
    if (next === 'pen') setColor(penColorRef.current);
    else if (next === 'highlighter') setColor(highlighterColorRef.current);
  }, []);

  const paletteColors =
    tool === 'highlighter' ? HIGHLIGHTER_COLORS : PANEL_COLORS;

  const pageSize = useMemo(
    () => ({ width: canvasWidth, height: canvasHeight }),
    [canvasWidth, canvasHeight]
  );

  const panCursorClass = tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair';

  /** 확장 힌트: 하단 도달 + (두 손가락 중 or 홀드 진행 중) */
  const showExpandHint =
    hasExpandSlot &&
    isAtExpandScroll &&
    (fingerTouchCount >= 2 || expandHoldProgress > 0);

  return (
    <div className="relative isolate flex flex-col select-none">
      {/*
        패널 영역: 캔버스(두 손가락 pan/zoom) + 오버레이(미니맵·줌%·제스처 안내).
        오버레이는 이 컨테이너 기준 absolute로 캔버스 위에 떠 있음.
      */}
      <div
        className="border-gray-3 relative overflow-hidden rounded-2xl border-2 border-dashed bg-white"
        style={{ height: panelHeight }}
      >
        <div
          ref={panContainerRef}
          data-drawing-surface
          data-testid="drawing-pan-container"
          className={cn(
            // overflow-x는 usePanZoom의 applyZoomVisual이 단일 소스로 토글(제스처 중
            // 미커밋 zoom 반영). 여기선 초기값(zoom=1 → hidden)만 둔다.
            'drawing-pan-container relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-scroll overscroll-y-contain',
            panCursorClass
          )}
          style={{
            height: panelHeight,
            touchAction: 'none',
            overscrollBehavior: 'none',
          }}
        >
          <div
            ref={canvasWrapperRef}
            data-drawing-surface
            className="relative overflow-hidden"
            style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}
          >
            <div
              ref={canvasScaledInnerRef}
              className="absolute top-0 left-0"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
              }}
            >
              {strokes.length === 0 && (
                <div
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2"
                  aria-hidden
                >
                  <EmptyPencilIcon />
                </div>
              )}

              {canvasWidth > 0 && (
                <DrawingCanvas
                  strokes={strokes}
                  tool={tool}
                  color={color}
                  size={size}
                  pageSize={pageSize}
                  onStrokeAdd={handleStrokeAdd}
                  onStrokeErase={handleStrokeErase}
                  capturePointerSession={captureEnabled}
                  abortDrawingRef={abortDrawingRef}
                />
              )}
            </div>
          </div>

          {hasExpandSlot && (
            <div
              className="shrink-0"
              style={{ height: EXPAND_HINT_HEIGHT_PX }}
              aria-hidden={!showExpandHint}
            >
              {showExpandHint && (
                <div className="bg-gray-1 sticky bottom-0 z-20 flex h-full flex-col items-center justify-center gap-2.5 px-4 text-center">
                  <p className="text-gray-11 text-[13px] font-medium">
                    1초간 유지 · 캔버스 확장
                  </p>
                  <div className="bg-gray-3 h-1 w-full max-w-[180px] overflow-hidden rounded-full">
                    <div
                      className="bg-orange-7 h-full rounded-full transition-[width] duration-75 ease-linear"
                      style={{ width: `${expandHoldProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 줌 % 배지 — 확대 상태에서만 (핀치 중 DOM 직접 갱신) */}
        <div
          ref={zoomBadgeRef}
          className="bg-gray-12/80 pointer-events-none absolute top-2 left-2 z-50 rounded-full px-2.5 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur-sm transition-opacity duration-150"
          style={{ opacity: 0 }}
          aria-hidden
        >
          100%
        </div>

        {/* 미니맵 — 확장/확대로 화면 밖 영역이 있을 때 현재 보이는 위치 표시 */}
        {minimap.visible && (
          <div
            className="border-gray-4/80 pointer-events-none absolute top-2 right-2 z-50 rounded-md border bg-white/85 shadow-sm backdrop-blur-sm"
            data-testid="drawing-minimap"
            style={{ width: minimap.boxW, height: minimap.boxH }}
            aria-hidden
          >
            <MinimapStrokes
              strokes={strokes}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              boxW={minimap.boxW}
              boxH={minimap.boxH}
            />
            <div
              className="border-orange-7 bg-orange-7/15 absolute rounded-[2px] border-[1.5px]"
              style={{
                left: minimap.rectLeft,
                top: minimap.rectTop,
                width: minimap.rectW,
                height: minimap.rectH,
              }}
            />
          </div>
        )}

        {/* 제스처 안내 — 한 손가락 시도 시 잠깐 표시 */}
        {showGestureHint && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-4 z-50 flex justify-center"
            role="status"
          >
            <div className="bg-gray-12/85 flex items-center gap-2.5 rounded-full px-4 py-2.5 text-white shadow-lg backdrop-blur-sm">
              <TwoFingerIcon />
              <span className="text-[13px] leading-snug font-medium">
                두 손가락으로 확대 · 이동하세요
              </span>
            </div>
          </div>
        )}

        {/* 저장 상태 — 캔버스 좌하단 오버레이 (툴바 밖) */}
        <SaveStatusIndicator status={saveStatus} />
      </div>

      {/* ── 하단 툴바 (점선 밖) — 폭 부족 시 아랫줄로 wrap ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-white px-4 py-3">
        {/* 도구 버튼 그룹 */}
        <div className="flex shrink-0 items-center gap-1">
          <PanelToolBtn
            active={tool === 'pen'}
            onClick={() => handleToolChange('pen')}
            label="펜"
          >
            <PanelPenIcon active={tool === 'pen'} />
          </PanelToolBtn>
          <PanelToolBtn
            active={tool === 'highlighter'}
            onClick={() => handleToolChange('highlighter')}
            label="형광펜"
          >
            <PanelHighlighterIcon active={tool === 'highlighter'} />
          </PanelToolBtn>
          <PanelToolBtn
            active={tool === 'eraser'}
            onClick={() => handleToolChange('eraser')}
            label="지우개"
          >
            <PanelEraserIcon active={tool === 'eraser'} />
          </PanelToolBtn>
        </div>

        <div className="bg-gray-3 h-5 w-px shrink-0" />

        {tool === 'eraser' ? (
          /* 전체 지우기 — 지우개를 선택했을 때만 노출 */
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-gray-9 hover:text-gray-11 flex shrink-0 items-center gap-1.5 text-sm whitespace-nowrap transition-colors"
          >
            <ToolbarTrashIcon />
            <span>전체 지우기</span>
          </button>
        ) : (
          <>
            {/* 색상 팔레트 (펜·형광펜에 따라 다른 팔레트) */}
            <div className="flex shrink-0 items-center gap-1.5">
              {paletteColors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorSelect(c)}
                  className={cn(
                    'size-6 rounded-full transition-transform hover:scale-110',
                    color === c &&
                      'ring-offset-gray-1 scale-110 ring-2 ring-white ring-offset-2'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="bg-gray-3 h-5 w-px shrink-0" />

            {/* 굵기 선택 (3단계) */}
            <div className="flex shrink-0 items-center gap-1">
              {PEN_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  title={`굵기 ${s}`}
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
                    size === s
                      ? 'border-orange-7'
                      : 'border-gray-3 hover:bg-gray-1'
                  )}
                >
                  {/* 굵기 미리보기 점 (width/height만 동적 px로 인라인) */}
                  <span
                    className={cn(
                      'block rounded-full',
                      size === s ? 'bg-orange-7' : 'bg-gray-7'
                    )}
                    style={{ width: s * 2 + 2, height: s * 2 + 2 }}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Undo / Redo */}
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="text-gray-6 hover:bg-gray-1 flex size-7 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            title="실행 취소"
          >
            <UndoIcon />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="text-gray-6 hover:bg-gray-1 flex size-7 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
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
            <h2 className="text-gray-12 text-base font-bold">전체 지우기</h2>
            <p className="text-gray-9 mt-3 text-sm leading-relaxed">
              모든 필기를 삭제합니다.
              <br />이 작업은 되돌릴 수 없어요.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="border-gray-3 text-gray-9 hover:bg-gray-1 flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors"
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
