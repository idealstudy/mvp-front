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
/** 스크롤 thumb 최소 높이(px) */
const SCROLL_THUMB_MIN_HEIGHT_PX = 40;
/** 스크롤 thumb·트랙 너비(px) */
const SCROLL_THUMB_WIDTH_PX = 8;
/** 콘텐츠와 thumb 겹침 방지 패딩(px) */
const SCROLL_THUMB_GUTTER_PX = 12;
/** IndexedDB에서 복원할 최대 캔버스 높이 — 비정상 값으로 흰 화면 방지 */
const MAX_CANVAS_HEIGHT = 8000;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type SaveStatus = 'idle' | 'saved' | 'error';
type ScrollIndicatorState = {
  visible: boolean;
  top: number;
  height: number;
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
  const [isScrollable, setIsScrollable] = useState(false);
  const [showScrollCoach, setShowScrollCoach] = useState(false);
  const [scrollIndicator, setScrollIndicator] = useState<ScrollIndicatorState>({
    visible: false,
    top: 0,
    height: 0,
  });

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
    setShowScrollCoach(false);
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

  useEffect(() => {
    if (!loadCompletedRef.current || !hasExpandSlot) {
      setShowScrollCoach(false);
      return;
    }
    setShowScrollCoach(
      isScrollable && fingerTouchCount === 0 && !isAtExpandScroll
    );
  }, [hasExpandSlot, isScrollable, fingerTouchCount, isAtExpandScroll]);

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

    const TRACK_EDGE_PAD = 8;

    const updateIndicator = () => {
      const viewHeight = el.clientHeight > 0 ? el.clientHeight : panelHeight;
      const { scrollTop } = el;
      const z = zoomRef.current;
      const canvasH = canvasHeight * z;
      const expandSlot = hasExpandSlot ? EXPAND_HINT_HEIGHT_PX : 0;
      const totalH = canvasH + expandSlot;
      const maxScrollCanvas = Math.max(0, canvasH - viewHeight);
      const scrollable = totalH > viewHeight + 1;
      const canvasScrollable = canvasH > viewHeight + 1;

      setIsScrollable(scrollable);
      setIsAtExpandScroll(
        hasExpandSlot && scrollable && scrollTop + viewHeight >= canvasH + 1
      );

      if (!scrollable) {
        setScrollIndicator({ visible: false, top: 0, height: 0 });
        return;
      }

      const trackHeight = Math.max(0, viewHeight - TRACK_EDGE_PAD * 2);
      const scrollTopCanvas = Math.min(scrollTop, maxScrollCanvas);

      // thumb 크기·위치: 캔버스 높이만 기준 (확장 슬롯 제외)
      const thumbHeight = canvasScrollable
        ? Math.max(
            SCROLL_THUMB_MIN_HEIGHT_PX,
            trackHeight * (viewHeight / canvasH)
          )
        : SCROLL_THUMB_MIN_HEIGHT_PX;
      const maxTravel = Math.max(0, trackHeight - thumbHeight);
      const thumbTop =
        canvasScrollable && maxScrollCanvas > 0
          ? maxTravel * (scrollTopCanvas / maxScrollCanvas)
          : maxTravel;

      setScrollIndicator({
        visible: true,
        top: thumbTop,
        height: thumbHeight,
      });
    };

    const scheduleUpdate = () => {
      requestAnimationFrame(updateIndicator);
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
    zoom,
    hasExpandSlot,
    getScrollMetrics,
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
    let wheelCommitRaf = 0;

    const metrics = () => getScrollMetrics(el.clientHeight);

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

      const { maxScrollFull } = metrics();
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

    const clampZoom = (value: number) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

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
      setShowScrollCoach(false);
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

      let newZoom = gestureStartZoom;
      if (
        gestureStartDist > 0 &&
        dist > 0 &&
        isPinchCenterOnCanvas(centerX, centerY)
      ) {
        newZoom = clampZoom(gestureStartZoom * (dist / gestureStartDist));
        cancelExpandHold();
      }

      const { width: cw } = canvasSizeRef.current;
      const scrollRect = el.getBoundingClientRect();
      const focalX = centerX - scrollRect.left;
      const focalY = centerY - scrollRect.top;
      const { maxScrollFull } = metrics();
      const maxLeft = Math.max(0, cw * newZoom - el.clientWidth);

      applyZoomVisual(newZoom);
      el.scrollLeft = Math.max(
        0,
        Math.min(maxLeft, gestureWorldX * newZoom - focalX)
      );
      el.scrollTop = Math.max(
        0,
        Math.min(maxScrollFull, gestureWorldY * newZoom - focalY)
      );

      if (zoomRef.current <= MIN_ZOOM && atExpandScroll()) {
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
        if (touch && isFingerTouch(touch)) e.preventDefault();
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

      const { scrollable, maxScrollCanvas } = metrics();
      if (!scrollable) return;
      const next = Math.max(
        0,
        Math.min(maxScrollCanvas, el.scrollTop + e.deltaY)
      );
      if (next === el.scrollTop) return;
      el.scrollTop = next;
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
    canvasWidth,
    canvasHeight,
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
        {showScrollCoach && (
          <div
            className="pointer-events-none absolute inset-x-3 bottom-3 z-20"
            role="status"
          >
            <p className="rounded-lg bg-gray-900/80 px-3 py-2 text-center text-xs leading-snug text-white backdrop-blur-sm">
              두 손가락으로 아래로 스크롤하세요
            </p>
          </div>
        )}

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
            paddingRight: scrollIndicator.visible
              ? SCROLL_THUMB_GUTTER_PX
              : undefined,
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

        {scrollIndicator.visible && (
          <div
            className="pointer-events-none absolute top-2 right-2 bottom-2 z-50"
            data-testid="drawing-scroll-thumb"
            style={{ width: SCROLL_THUMB_WIDTH_PX }}
            aria-hidden
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'rgba(229, 231, 235, 0.95)' }}
            />
            <div
              className="absolute right-0 left-0 rounded-full"
              style={{
                top: scrollIndicator.top,
                height: scrollIndicator.height,
                backgroundColor: 'rgba(107, 114, 128, 0.92)',
              }}
            />
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
