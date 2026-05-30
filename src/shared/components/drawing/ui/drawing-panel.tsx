'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
/** 두 손가락으로 하단에서 유지해야 하는 시간(ms) */
const EXPAND_HOLD_MS = 1000;
/** 확장 안내 바 높이(px) */
const EXPAND_HINT_HEIGHT_PX = 72;
/** 미니맵 박스 최대 크기(px) — 캔버스 비율에 맞춰 이 안에 맞춤 */
const MINIMAP_MAX_W = 64;
const MINIMAP_MAX_H = 96;
/** 한 손가락 시도 시 제스처 안내 UI 노출 시간(ms) */
const GESTURE_HINT_MS = 1800;
/** IndexedDB에서 복원할 최대 캔버스 높이 — 비정상 값으로 흰 화면 방지 */
const MAX_CANVAS_HEIGHT = 8000;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
/** 핀치를 줌으로 인정하는 최소 배율 변화 — 손가락 떨림을 줌으로 오인 방지 */
const PINCH_ZOOM_DEADZONE = 0.02;
/**
 * 원래 크기 근처(1.0 ~ 1+threshold)는 MIN_ZOOM으로 스냅.
 * 안 그러면 1.01 등에 끼어 overflow-x가 켜지고 좌우 이동이 생김.
 */
const ZOOM_SNAP_THRESHOLD = 0.05;
/** 두 손가락 정지 중(줌 변화 없음) 스크롤 떨림을 무시하는 임계값(px) */
const PAN_JITTER_DEADZONE_PX = 3;
/** 제스처 의도 잠금: 손가락 간격이 이만큼 변하면 '줌'으로 확정(px) */
const GESTURE_ZOOM_LOCK_PX = 16;
/** 제스처 의도 잠금: 두 손가락 중심이 이만큼 이동하면 '이동'으로 확정(px) */
const GESTURE_PAN_LOCK_PX = 8;

type SaveStatus = 'idle' | 'saved' | 'error';
/** 미니맵: 박스 크기 + 현재 보이는 영역(뷰포트) 사각형 */
type MinimapState = {
  visible: boolean;
  boxW: number;
  boxH: number;
  rectLeft: number;
  rectTop: number;
  rectW: number;
  rectH: number;
};

// ─── 타입 ────────────────────────────────────────────────────────────────────

type DrawingPanelProps = {
  documentId: string;
  /** 패널 외부 가시 높이(px). 기본값 400 */
  panelHeight?: number;
  /** 획이 없을 때 캔버스 높이(px). 기본값: panelHeight와 동일 */
  initialCanvasHeight?: number;
  /**
   * 센티넬이 보일 때 캔버스를 늘리는 비율.
   * 기본값 0.3 (현재 높이의 30%)
   */
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
  const [size] = useState(4);
  const [canvasHeight, setCanvasHeight] = useState(emptyCanvasHeight);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [expandHoldProgress, setExpandHoldProgress] = useState(0);
  const [isAtExpandScroll, setIsAtExpandScroll] = useState(false);
  /** iPad: touchstart는 손가락마다 따로 올 수 있어 state로 즉시 UI 반영 */
  const [fingerTouchCount, setFingerTouchCount] = useState(0);
  const [minimap, setMinimap] = useState<MinimapState>({
    visible: false,
    boxW: 0,
    boxH: 0,
    rectLeft: 0,
    rectTop: 0,
    rectW: 0,
    rectH: 0,
  });
  /** 한 손가락 시도 시 잠깐 뜨는 제스처 안내 */
  const [showGestureHint, setShowGestureHint] = useState(false);

  const captureEnabled =
    capturePointerSession === true && process.env.NODE_ENV === 'development';

  // 스크롤 컨테이너 ref — 터치 스크롤 대상
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasScaledInnerRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExpandingRef = useRef(false);
  const expandHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandHoldProgressTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const expandHoldStartAtRef = useRef<number | null>(null);
  const fingerTouchCountRef = useRef(0);
  const zoomRef = useRef(zoom);
  const canvasSizeRef = useRef({ width: canvasWidth, height: canvasHeight });
  canvasSizeRef.current = { width: canvasWidth, height: canvasHeight };
  const abortDrawingRef = useRef<(() => void) | null>(null);
  const loadGenerationRef = useRef(0);
  const loadCompletedRef = useRef(false);
  /** 줌 % 배지 — 핀치 중 리렌더 없이 DOM만 갱신 */
  const zoomBadgeRef = useRef<HTMLDivElement>(null);
  const gestureHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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

  const resetCanvasToComponentSize = useCallback(() => {
    setCanvasHeight(emptyCanvasHeight);
    void saveCanvasHeight(documentId, emptyCanvasHeight);
  }, [documentId, emptyCanvasHeight]);

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
      requestAnimationFrame(() => {
        const scrollEl = scrollContainerRef.current;
        if (!scrollEl) return;
        scrollEl.scrollTop = 0;
        fingerTouchCountRef.current = 0;
        setFingerTouchCount(0);
        setIsAtExpandScroll(false);
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [documentId, setStrokes, emptyCanvasHeight]);

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

  /** 필기 또는 이미 늘어난 캔버스면 하단 확장 슬롯 유지 */
  const hasExpandSlot =
    strokes.length > 0 || canvasHeight > emptyCanvasHeight + 1;

  const getCanvasContentHeight = useCallback(
    () => canvasHeight * zoom,
    [canvasHeight, zoom]
  );

  const getScrollMetrics = useCallback(
    (clientHeight: number) => {
      const canvasH = getCanvasContentHeight();
      const expandSlot = hasExpandSlot ? EXPAND_HINT_HEIGHT_PX : 0;
      const totalH = canvasH + expandSlot;
      const maxScrollCanvas = Math.max(0, canvasH - clientHeight);
      const maxScrollFull = Math.max(0, totalH - clientHeight);
      const scrollable = totalH > clientHeight + 1;
      /** 스크롤 thumb·캔버스 스크롤 범위 (확장 슬롯 제외) */
      const canvasScrollable = canvasH > clientHeight + 1;
      return {
        canvasH,
        expandSlot,
        totalH,
        maxScrollCanvas,
        maxScrollFull,
        scrollable,
        canvasScrollable,
      };
    },
    [getCanvasContentHeight, hasExpandSlot]
  );

  const showExpandHint =
    hasExpandSlot &&
    isAtExpandScroll &&
    (fingerTouchCount >= 2 || expandHoldProgress > 0);

  fingerTouchCountRef.current = fingerTouchCount;

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { maxScrollCanvas } = getScrollMetrics(el.clientHeight);
    if (el.scrollTop > maxScrollCanvas) {
      el.scrollTop = maxScrollCanvas;
    }
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    if (el.scrollLeft > maxLeft) {
      el.scrollLeft = maxLeft;
    }
    if (zoom <= MIN_ZOOM && el.scrollLeft > 0) {
      el.scrollLeft = 0;
    }
  }, [canvasHeight, zoom, hasExpandSlot, getScrollMetrics]);

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // 미니맵 + 확장 위치 갱신. (스크롤 thumb 제거 → 두 손가락 이동을 미니맵으로 안내)
    const updateViewport = () => {
      const viewW = el.clientWidth;
      const viewH = el.clientHeight > 0 ? el.clientHeight : panelHeight;
      const { scrollTop, scrollLeft } = el;
      const z = zoomRef.current;
      const contentW = canvasWidth * z;
      const contentH = canvasHeight * z;
      const expandSlot = hasExpandSlot ? EXPAND_HINT_HEIGHT_PX : 0;

      // 하단(확장 슬롯)에 도달 → 확장 힌트/홀드 조건
      const scrollableForExpand = contentH + expandSlot > viewH + 1;
      setIsAtExpandScroll(
        hasExpandSlot &&
          scrollableForExpand &&
          scrollTop + viewH >= contentH + 1
      );

      // 보여줄 게 있을 때만(확장됐거나 확대됨) 미니맵 표시
      const overflowX = contentW > viewW + 1;
      const overflowY = contentH > viewH + 1;
      if (!overflowX && !overflowY) {
        setMinimap((prev) =>
          prev.visible ? { ...prev, visible: false } : prev
        );
        return;
      }

      // 캔버스 비율에 맞춰 미니맵 박스 크기 결정
      const aspect = canvasWidth > 0 ? canvasWidth / canvasHeight : 1;
      let boxW = MINIMAP_MAX_H * aspect;
      let boxH = MINIMAP_MAX_H;
      if (boxW > MINIMAP_MAX_W) {
        boxW = MINIMAP_MAX_W;
        boxH = MINIMAP_MAX_W / aspect;
      }

      const fracX = contentW > 0 ? scrollLeft / contentW : 0;
      const fracY = contentH > 0 ? scrollTop / contentH : 0;
      const fracW = contentW > 0 ? Math.min(1, viewW / contentW) : 1;
      const fracH = contentH > 0 ? Math.min(1, viewH / contentH) : 1;

      setMinimap({
        visible: true,
        boxW,
        boxH,
        rectLeft: fracX * boxW,
        rectTop: fracY * boxH,
        rectW: fracW * boxW,
        rectH: fracH * boxH,
      });
    };

    const scheduleUpdate = () => {
      requestAnimationFrame(updateViewport);
    };

    scheduleUpdate();
    el.addEventListener('scroll', scheduleUpdate, { passive: true });
    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', scheduleUpdate);
      ro.disconnect();
    };
  }, [
    canvasHeight,
    canvasWidth,
    zoom,
    hasExpandSlot,
    panelHeight,
    strokes.length,
  ]);

  const clearExpandHoldTimer = useCallback(() => {
    if (!expandHoldTimerRef.current) return;
    clearTimeout(expandHoldTimerRef.current);
    expandHoldTimerRef.current = null;
    if (expandHoldProgressTimerRef.current) {
      clearInterval(expandHoldProgressTimerRef.current);
      expandHoldProgressTimerRef.current = null;
    }
    expandHoldStartAtRef.current = null;
    setExpandHoldProgress(0);
  }, []);

  const syncFingerCount = useCallback((count: number) => {
    fingerTouchCountRef.current = count;
    setFingerTouchCount(count);
  }, []);

  /** 한 손가락 시도 시 "두 손가락으로" 안내를 잠깐 띄운다 */
  const showGestureHintBriefly = useCallback(() => {
    setShowGestureHint(true);
    if (gestureHintTimerRef.current) clearTimeout(gestureHintTimerRef.current);
    gestureHintTimerRef.current = setTimeout(() => {
      setShowGestureHint(false);
      gestureHintTimerRef.current = null;
    }, GESTURE_HINT_MS);
  }, []);

  const hideGestureHint = useCallback(() => {
    if (gestureHintTimerRef.current) {
      clearTimeout(gestureHintTimerRef.current);
      gestureHintTimerRef.current = null;
    }
    setShowGestureHint(false);
  }, []);

  const hideExpandHint = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { maxScrollCanvas } = getScrollMetrics(el.clientHeight);
    if (el.scrollTop > maxScrollCanvas) {
      el.scrollTop = maxScrollCanvas;
    }
    syncFingerCount(0);
  }, [getScrollMetrics, syncFingerCount]);

  const expandCanvas = useCallback(() => {
    if (isExpandingRef.current) return;
    isExpandingRef.current = true;
    syncFingerCount(0);
    setCanvasHeight((prev) => {
      const next = Math.round(prev + prev * expandRatio);
      const frozenStrokes = strokesForSaveRef.current.map((stroke) => ({
        ...stroke,
        layoutHeight: stroke.layoutHeight ?? prev,
      }));
      strokesForSaveRef.current = frozenStrokes;
      setStrokes(frozenStrokes);
      void saveCanvasHeight(documentId, next);
      void savePageStrokes(documentId, 1, frozenStrokes);
      return next;
    });
    setTimeout(() => {
      isExpandingRef.current = false;
    }, 600);
  }, [documentId, expandRatio, setStrokes, syncFingerCount]);

  /** 제스처 중 React 리렌더 없이 DOM만 갱신 → iPad 핀치처럼 부드럽게 */
  const applyZoomVisual = useCallback((z: number) => {
    zoomRef.current = z;
    const { width: cw, height: ch } = canvasSizeRef.current;
    const wrapper = canvasWrapperRef.current;
    const scaled = canvasScaledInnerRef.current;
    const scrollEl = scrollContainerRef.current;
    if (wrapper && cw > 0) {
      wrapper.style.width = `${cw * z}px`;
      wrapper.style.height = `${ch * z}px`;
    }
    if (scaled) {
      scaled.style.transform = `scale(${z})`;
    }
    if (scrollEl) {
      const allowPanX = z > MIN_ZOOM;
      scrollEl.classList.toggle('overflow-x-auto', allowPanX);
      scrollEl.classList.toggle('overflow-x-hidden', !allowPanX);
    }
    // 줌 % 배지: 확대 상태에서만 표시 (리렌더 없이 DOM 직접 갱신)
    const badge = zoomBadgeRef.current;
    if (badge) {
      const zoomedIn = z > MIN_ZOOM + 0.005;
      badge.style.opacity = zoomedIn ? '1' : '0';
      badge.textContent = `${Math.round(z * 100)}%`;
    }
  }, []);

  const commitZoomState = useCallback(() => {
    setZoom((prev) => (prev === zoomRef.current ? prev : zoomRef.current));
  }, []);

  useEffect(() => {
    zoomRef.current = zoom;
    applyZoomVisual(zoom);
  }, [zoom, applyZoomVisual]);

  // ── 스크롤: iPad 두 손가락(touch) + 데스크톱 휠 ───────────────────────────

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let twoFingerActive = false;
    let gestureStartZoom = MIN_ZOOM;
    let gestureStartDist = 0;
    /** 제스처 시작 시 손가락 중심 아래 캔버스 좌표(논리 px) */
    let gestureWorldX = 0;
    let gestureWorldY = 0;
    /** 제스처 시작 시 두 손가락 중심(스크린 px) — 의도 판정용 */
    let gestureStartCenterX = 0;
    let gestureStartCenterY = 0;
    /** 'idle' 동안 줌/이동 의도 판정. 한 번 잠기면 제스처 끝까지 유지 */
    let gestureMode: 'idle' | 'pan' | 'zoom' = 'idle';
    let wheelCommitRaf = 0;

    const metrics = () => getScrollMetrics(el.clientHeight);

    /**
     * 제스처 진행 중에는 state `zoom`이 아직 확정 전이므로 라이브 zoom으로
     * 세로 스크롤 한계를 계산해야 확대된 영역 끝까지 이동할 수 있다.
     */
    const liveMaxScroll = (zoomVal: number) => {
      const { height: ch } = canvasSizeRef.current;
      const expandSlot = hasExpandSlot ? EXPAND_HINT_HEIGHT_PX : 0;
      return Math.max(0, ch * zoomVal + expandSlot - el.clientHeight);
    };

    const scheduleWheelZoomCommit = () => {
      cancelAnimationFrame(wheelCommitRaf);
      wheelCommitRaf = requestAnimationFrame(() => {
        wheelCommitRaf = 0;
        commitZoomState();
      });
    };

    const countFingerTouches = (touches: TouchList) => {
      let n = 0;
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        const touchType = (t as Touch & { touchType?: string }).touchType;
        if (touchType !== 'stylus') n++;
      }
      return n;
    };

    const getCenterY = (touches: TouchList) => {
      let sum = 0;
      let n = 0;
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        const touchType = (t as Touch & { touchType?: string }).touchType;
        if (touchType === 'stylus') continue;
        sum += t.clientY;
        n++;
      }
      return n > 0 ? sum / n : 0;
    };

    const getCenterX = (touches: TouchList) => {
      let sum = 0;
      let n = 0;
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        const touchType = (t as Touch & { touchType?: string }).touchType;
        if (touchType === 'stylus') continue;
        sum += t.clientX;
        n++;
      }
      return n > 0 ? sum / n : 0;
    };

    const isPinchCenterOnCanvas = (clientX: number, clientY: number) => {
      const { width: cw, height: ch } = canvasSizeRef.current;
      if (cw <= 0 || ch <= 0) return false;
      const scrollRect = el.getBoundingClientRect();
      const contentY = el.scrollTop + (clientY - scrollRect.top);
      const localY = contentY / zoomRef.current;
      return localY >= 0 && localY <= ch;
    };

    const applyZoomAtPoint = (
      clientX: number,
      clientY: number,
      ratio: number,
      commit = true
    ) => {
      if (Math.abs(ratio - 1) < 0.001) return;
      if (!isPinchCenterOnCanvas(clientX, clientY)) return;

      const oldZoom = zoomRef.current;
      const newZoom = clampZoom(oldZoom * ratio);
      if (newZoom === oldZoom) return;

      const { width: cw, height: ch } = canvasSizeRef.current;
      const scrollRect = el.getBoundingClientRect();
      const focalX = clientX - scrollRect.left;
      const focalY = clientY - scrollRect.top;
      const contentX = el.scrollLeft + focalX;
      const contentY = el.scrollTop + focalY;

      const localX = Math.min(cw, Math.max(0, contentX / oldZoom));
      const localY = Math.min(ch, Math.max(0, contentY / oldZoom));

      const maxScrollFull = liveMaxScroll(newZoom);
      const maxLeft = Math.max(0, cw * newZoom - el.clientWidth);

      applyZoomVisual(newZoom);
      el.scrollLeft = Math.max(0, Math.min(maxLeft, localX * newZoom - focalX));
      el.scrollTop = Math.max(
        0,
        Math.min(maxScrollFull, localY * newZoom - focalY)
      );

      if (commit) scheduleWheelZoomCommit();
    };

    const getPinchDistance = (touches: TouchList) => {
      const finger: Touch[] = [];
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        const touchType = (t as Touch & { touchType?: string }).touchType;
        if (touchType !== 'stylus') finger.push(t);
      }
      if (finger.length < 2) return 0;
      const dx = finger[0]!.clientX - finger[1]!.clientX;
      const dy = finger[0]!.clientY - finger[1]!.clientY;
      return Math.hypot(dx, dy);
    };

    const clampZoom = (value: number) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
      // 원래 크기 근처는 정확히 MIN_ZOOM으로 스냅 → overflow-x off, 좌우 이동 차단
      return clamped < MIN_ZOOM + ZOOM_SNAP_THRESHOLD ? MIN_ZOOM : clamped;
    };

    const atExpandScroll = () => {
      const { canvasH } = metrics();
      return el.scrollTop + el.clientHeight >= canvasH + 1;
    };

    const tryStartExpandHold = () => {
      if (isExpandingRef.current) return;
      if (fingerTouchCountRef.current < 2) return;
      if (!atExpandScroll()) return;
      if (expandHoldTimerRef.current) return;

      expandHoldStartAtRef.current = Date.now();
      setExpandHoldProgress(0);
      expandHoldProgressTimerRef.current = setInterval(() => {
        const startedAt = expandHoldStartAtRef.current;
        if (!startedAt) return;
        const elapsed = Date.now() - startedAt;
        setExpandHoldProgress(Math.min(100, (elapsed / EXPAND_HOLD_MS) * 100));
      }, 16);

      expandHoldTimerRef.current = setTimeout(() => {
        expandHoldTimerRef.current = null;
        if (expandHoldProgressTimerRef.current) {
          clearInterval(expandHoldProgressTimerRef.current);
          expandHoldProgressTimerRef.current = null;
        }
        expandHoldStartAtRef.current = null;
        setExpandHoldProgress(0);
        if (fingerTouchCountRef.current < 2 || !atExpandScroll()) return;
        expandCanvas();
      }, EXPAND_HOLD_MS);
    };

    const cancelExpandHold = () => clearExpandHoldTimer();

    const captureGestureBaseline = (touches: TouchList) => {
      const centerX = getCenterX(touches);
      const centerY = getCenterY(touches);
      gestureStartZoom = zoomRef.current;
      gestureStartDist = getPinchDistance(touches);
      gestureStartCenterX = centerX;
      gestureStartCenterY = centerY;
      gestureMode = 'idle';
      const scrollRect = el.getBoundingClientRect();
      const focalX = centerX - scrollRect.left;
      const focalY = centerY - scrollRect.top;
      gestureWorldX = (el.scrollLeft + focalX) / gestureStartZoom;
      gestureWorldY = (el.scrollTop + focalY) / gestureStartZoom;
    };

    const enterTwoFinger = (touches: TouchList) => {
      const count = countFingerTouches(touches);
      if (count < 2) return false;
      syncFingerCount(count);
      abortDrawingRef.current?.();
      twoFingerActive = true;
      captureGestureBaseline(touches);
      hideGestureHint();
      return true;
    };

    /**
     * 제스처 시작 기준 한 번에 스크롤·줌 계산 (Safari 페이지 핀치와 동일한 focal 고정).
     * touchmove마다 setZoom 하지 않음.
     */
    const applyTwoFingerGesture = (touches: TouchList) => {
      if (!twoFingerActive) return;

      const centerX = getCenterX(touches);
      const centerY = getCenterY(touches);
      const dist = getPinchDistance(touches);

      // ── 의도 잠금: 이동/줌 중 하나로 확정 (확정 전엔 데드존) ──
      // 스크롤(이동)이 주 동작 → pan 우선. 줌은 손가락 간격 변화가
      // 중심 이동보다 확실히 클 때만 잠금(평행 스크롤이 줌으로 새는 것 방지).
      if (gestureMode === 'idle') {
        const distDelta =
          gestureStartDist > 0 ? Math.abs(dist - gestureStartDist) : 0;
        const centerDelta = Math.hypot(
          centerX - gestureStartCenterX,
          centerY - gestureStartCenterY
        );
        if (centerDelta >= GESTURE_PAN_LOCK_PX && centerDelta >= distDelta) {
          gestureMode = 'pan';
        } else if (distDelta >= GESTURE_ZOOM_LOCK_PX) {
          gestureMode = 'zoom';
        } else {
          // 아직 의도 불명 — 떨림 무시하고 아무것도 하지 않음
          if (zoomRef.current <= MIN_ZOOM && atExpandScroll()) {
            tryStartExpandHold();
          }
          return;
        }
      }

      // ── 줌: '줌'으로 잠긴 동안만. 이동(pan) 중엔 손가락 간격 변화 무시 ──
      const prevZoom = zoomRef.current;
      let newZoom = prevZoom;
      if (
        gestureMode === 'zoom' &&
        gestureStartDist > 0 &&
        dist > 0 &&
        isPinchCenterOnCanvas(centerX, centerY)
      ) {
        const target = clampZoom(gestureStartZoom * (dist / gestureStartDist));
        // 경계(원래 크기/최대)에 닿으면 데드존 무시하고 정확히 스냅 —
        // 안 그러면 1.01배 등에서 멈춰 원래 크기인데도 좌우 이동이 생김
        const atBound = target === MIN_ZOOM || target === MAX_ZOOM;
        if (
          target !== prevZoom &&
          (atBound || Math.abs(target - prevZoom) >= PINCH_ZOOM_DEADZONE)
        ) {
          newZoom = target;
        }
      }
      const zoomChanged = newZoom !== prevZoom;

      const { width: cw } = canvasSizeRef.current;
      const scrollRect = el.getBoundingClientRect();
      const focalX = centerX - scrollRect.left;
      const focalY = centerY - scrollRect.top;
      const maxScrollFull = liveMaxScroll(newZoom);
      const maxLeft = Math.max(0, cw * newZoom - el.clientWidth);

      if (zoomChanged) applyZoomVisual(newZoom);

      const targetLeft = Math.max(
        0,
        Math.min(maxLeft, gestureWorldX * newZoom - focalX)
      );
      const targetTop = Math.max(
        0,
        Math.min(maxScrollFull, gestureWorldY * newZoom - focalY)
      );

      // ── 스크롤 적용: 줌이 바뀐 프레임은 focal 고정 위해 항상 반영,
      //    줌 변화 없으면(=정지/순수 pan) 떨림 데드존 이상일 때만 반영 ──
      if (
        zoomChanged ||
        Math.abs(targetLeft - el.scrollLeft) >= PAN_JITTER_DEADZONE_PX
      ) {
        el.scrollLeft = targetLeft;
      }
      if (
        zoomChanged ||
        Math.abs(targetTop - el.scrollTop) >= PAN_JITTER_DEADZONE_PX
      ) {
        el.scrollTop = targetTop;
      }

      if (newZoom <= MIN_ZOOM && atExpandScroll()) {
        tryStartExpandHold();
      } else {
        cancelExpandHold();
      }
    };

    const isFingerTouch = (touch: Touch) => {
      const touchType = (touch as Touch & { touchType?: string }).touchType;
      return touchType !== 'stylus';
    };

    const onTouchStart = (e: TouchEvent) => {
      const fingerCount = countFingerTouches(e.touches);
      if (fingerCount >= 2) {
        enterTwoFinger(e.touches);
        if (zoomRef.current <= MIN_ZOOM) tryStartExpandHold();
        e.preventDefault();
        return;
      }
      if (fingerCount === 1) {
        cancelExpandHold();
        const touch = e.touches[0];
        if (touch && isFingerTouch(touch)) {
          // 한 손가락은 인식하지 않음(펜 예약) → 두 손가락 안내를 잠깐 표시
          showGestureHintBriefly();
          e.preventDefault();
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const fingerCount = countFingerTouches(e.touches);
      if (fingerCount >= 2) {
        if (fingerTouchCountRef.current < 2) {
          enterTwoFinger(e.touches);
        } else {
          syncFingerCount(fingerCount);
        }
        applyTwoFingerGesture(e.touches);
        e.preventDefault();
        return;
      }
      if (fingerTouchCountRef.current >= 2) {
        syncFingerCount(fingerCount);
        cancelExpandHold();
        hideExpandHint();
      }
      const touch = e.touches[0];
      if (!touch) return;
      if (!isFingerTouch(touch)) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const fingerCount = countFingerTouches(e.touches);
      syncFingerCount(fingerCount);

      if (fingerCount >= 2) {
        captureGestureBaseline(e.touches);
        if (zoomRef.current <= MIN_ZOOM) tryStartExpandHold();
        return;
      }

      twoFingerActive = false;
      commitZoomState();
      cancelExpandHold();
      if (fingerCount === 0) {
        hideExpandHint();
      }
    };

    const onTouchCancel = () => {
      syncFingerCount(0);
      twoFingerActive = false;
      commitZoomState();
      cancelExpandHold();
      hideExpandHint();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.008);
        applyZoomAtPoint(e.clientX, e.clientY, factor);
        return;
      }

      const { maxScrollCanvas } = metrics();
      const { width: cw } = canvasSizeRef.current;
      // 가로 이동은 확대 상태에서만 여유가 생긴다(원래 크기에선 maxLeft=0).
      const maxLeft = Math.max(0, cw * zoomRef.current - el.clientWidth);

      const nextTop = Math.max(
        0,
        Math.min(maxScrollCanvas, el.scrollTop + e.deltaY)
      );
      const nextLeft = Math.max(0, Math.min(maxLeft, el.scrollLeft + e.deltaX));

      if (nextTop === el.scrollTop && nextLeft === el.scrollLeft) return;
      el.scrollTop = nextTop;
      el.scrollLeft = nextLeft;
      e.preventDefault();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchCancel, { passive: false });
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(wheelCommitRaf);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
      el.removeEventListener('wheel', onWheel);
      cancelExpandHold();
    };
  }, [
    applyZoomVisual,
    clearExpandHoldTimer,
    commitZoomState,
    expandCanvas,
    getScrollMetrics,
    hideExpandHint,
    syncFingerCount,
    showGestureHintBriefly,
    hideGestureHint,
    canvasWidth,
    canvasHeight,
    hasExpandSlot,
  ]);

  // ── 자동 저장 ──────────────────────────────────────────────────────────────

  const persistStrokes = useCallback(
    async (strokesToSave: Stroke[]) => {
      await savePageStrokes(documentId, 1, strokesToSave);
      setSaveStatus('saved');
    },
    [documentId]
  );

  const scheduleSaveRetry = useCallback(() => {
    if (saveRetryTimerRef.current) clearTimeout(saveRetryTimerRef.current);
    saveRetryTimerRef.current = setTimeout(async () => {
      saveRetryTimerRef.current = null;
      try {
        await persistStrokes(strokesForSaveRef.current);
      } catch {
        setSaveStatus('error');
      }
    }, 2000);
  }, [persistStrokes]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (saveRetryTimerRef.current) clearTimeout(saveRetryTimerRef.current);
      if (gestureHintTimerRef.current)
        clearTimeout(gestureHintTimerRef.current);
      clearExpandHoldTimer();
    };
  }, [clearExpandHoldTimer]);

  const scheduleSave = useCallback(
    (getNextStrokes: (prev: Stroke[]) => Stroke[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        saveTimerRef.current = null;
        const nextStrokes = getNextStrokes(strokesForSaveRef.current);
        try {
          await persistStrokes(nextStrokes);
        } catch {
          setSaveStatus('error');
          scheduleSaveRetry();
        }
      }, AUTO_SAVE_DELAY_MS);
    },
    [persistStrokes, scheduleSaveRetry]
  );

  const scheduleSaveCurrent = useCallback(() => {
    scheduleSave((prev) => prev);
  }, [scheduleSave]);

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
    scheduleSaveCurrent();
  }, [undo, scheduleSaveCurrent]);

  const handleRedo = useCallback(() => {
    redo();
    scheduleSaveCurrent();
  }, [redo, scheduleSaveCurrent]);

  const handleToolChange = useCallback((next: DrawingTool) => {
    setTool(next);
    if (next === 'pen') setColor(PANEL_COLORS[0]);
  }, []);

  const pageSize = useMemo(
    () => ({ width: canvasWidth, height: canvasHeight }),
    [canvasWidth, canvasHeight]
  );

  const scrollCursorClass =
    tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair';

  return (
    <div className="relative isolate flex flex-col select-none">
      {/*
        스크롤바는 스크롤 콘텐츠 맨 아래에 두면 뷰포트에 안 보임.
        왼쪽=스크롤, 오른쪽=고정 트랙(항상 패널 높이에 붙음).
      */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white"
        style={{ height: panelHeight }}
      >
        <div
          ref={scrollContainerRef}
          data-drawing-surface
          data-testid="drawing-scroll-container"
          className={cn(
            'drawing-scroll-container relative min-h-0 min-w-0 flex-1 overscroll-y-contain',
            zoom > MIN_ZOOM
              ? 'overflow-x-auto overflow-y-scroll'
              : 'overflow-x-hidden overflow-y-scroll',
            scrollCursorClass
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
                <div className="sticky bottom-0 z-20 flex h-full flex-col items-center justify-center gap-2.5 bg-gray-50 px-4 text-center">
                  <p className="text-[13px] font-medium text-gray-800">
                    1초간 유지 · 캔버스 확장
                  </p>
                  <div className="h-1 w-full max-w-[180px] overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-[width] duration-75 ease-linear"
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
          className="pointer-events-none absolute top-2 left-2 z-50 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur-sm transition-opacity duration-150"
          style={{ opacity: 0 }}
          aria-hidden
        >
          100%
        </div>

        {/* 미니맵 — 확장/확대로 화면 밖 영역이 있을 때 현재 보이는 위치 표시 */}
        {minimap.visible && (
          <div
            className="pointer-events-none absolute top-2 right-2 z-50 rounded-md border border-gray-300/80 bg-white/85 shadow-sm backdrop-blur-sm"
            data-testid="drawing-minimap"
            style={{ width: minimap.boxW, height: minimap.boxH }}
            aria-hidden
          >
            <div
              className="absolute rounded-[2px] border-[1.5px] border-orange-500 bg-orange-500/15"
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
            <div className="flex items-center gap-2.5 rounded-full bg-gray-900/85 px-4 py-2.5 text-white shadow-lg backdrop-blur-sm">
              <TwoFingerIcon />
              <span className="text-[13px] leading-snug font-medium">
                두 손가락으로 확대 · 이동하세요
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 하단 툴바 (점선 밖) ── */}
      <div className="flex items-center gap-3 bg-white px-4 py-3">
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
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            title="실행 취소"
          >
            <UndoIcon />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            title="다시 실행"
          >
            <RedoIcon />
          </button>
        </div>

        {saveStatus === 'error' && (
          <span
            className="text-[10px] font-medium text-red-500"
            title="IndexedDB 저장 실패 — 2초 후 자동 재시도"
          >
            저장 실패
          </span>
        )}

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

function TwoFingerIcon() {
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
