'use client';

import {
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

// ─── 상수 ────────────────────────────────────────────────────────────────────

/** 두 손가락으로 하단에서 유지해야 하는 시간(ms) */
const EXPAND_HOLD_MS = 1000;
/** 확장 안내 바 높이(px) — 캔버스 하단 확장 슬롯. JSX에서도 사용 */
export const EXPAND_HINT_HEIGHT_PX = 72;
/** 미니맵 박스 최대 크기(px) — 캔버스 비율에 맞춰 이 안에 맞춤 */
const MINIMAP_MAX_W = 64;
const MINIMAP_MAX_H = 96;
/** 한 손가락 시도 시 제스처 안내 UI 노출 시간(ms) */
const GESTURE_HINT_MS = 1800;
export const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
/** 핀치를 줌으로 인정하는 최소 배율 변화 — 손가락 떨림을 줌으로 오인 방지 */
const PINCH_ZOOM_DEADZONE = 0.02;
/** 원래 크기 근처(1 ~ 1+threshold)는 MIN_ZOOM으로 스냅 → overflow-x off, 좌우 이동 차단 */
const ZOOM_SNAP_THRESHOLD = 0.05;
/** 두 손가락 정지 중(줌 변화 없음) pan 떨림을 무시하는 임계값(px) */
const PAN_JITTER_DEADZONE_PX = 3;
/** 제스처 의도 잠금: 손가락 간격이 이만큼 변하면 '줌'으로 확정(px) */
const GESTURE_ZOOM_LOCK_PX = 16;
/** 제스처 의도 잠금: 두 손가락 중심이 이만큼 이동하면 '이동(pan)'으로 확정(px) */
const GESTURE_PAN_LOCK_PX = 8;

// ─── 타입 ────────────────────────────────────────────────────────────────────

/** 미니맵: 박스 크기 + 현재 보이는 영역(뷰포트) 사각형 */
export type MinimapState = {
  visible: boolean;
  boxW: number;
  boxH: number;
  rectLeft: number;
  rectTop: number;
  rectW: number;
  rectH: number;
};

type UsePanZoomParams = {
  /** 캔버스 논리 높이(px). 확장으로 늘어남 */
  canvasHeight: number;
  /** 패널 외부 가시 높이(px) */
  panelHeight: number;
  /** 하단 확장 슬롯 노출 여부(획이 있거나 이미 늘어난 경우) */
  hasExpandSlot: boolean;
  /** 하단 1초 유지 완료 시 호출 — 캔버스 높이 확장(획 freeze·저장은 호출 측) */
  onExpand: () => void;
  /** 두 손가락 진입 시 진행 중 드로잉을 취소하기 위한 콜백 ref */
  abortDrawingRef: RefObject<(() => void) | null>;
};

// ─── 순수 헬퍼 ─────────────────────────────────────────────────────────────────

/**
 * 세로 pan(이동) 최대치. `expandSlotPx`를 더하면 하단 확장 슬롯까지 닿을 수 있어
 * 두 손가락이 슬롯에서 확장 홀드를 띄울 수 있다(터치 제스처용). 휠·클램프는 0으로 호출.
 */
function maxPanY(
  canvasH: number,
  zoomVal: number,
  expandSlotPx: number,
  clientHeight: number
) {
  return Math.max(0, canvasH * zoomVal + expandSlotPx - clientHeight);
}

function clampZoom(value: number) {
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  // 원래 크기 근처는 정확히 MIN_ZOOM으로 스냅 → overflow-x off, 좌우 이동 차단
  return clamped < MIN_ZOOM + ZOOM_SNAP_THRESHOLD ? MIN_ZOOM : clamped;
}

/**
 * 드로잉 패널의 두 손가락 pan/zoom + 하단 확장 홀드 + 미니맵을 담당하는 훅.
 *
 * 제스처 리스너는 mount-once(deps=[applyZoomVisual])로 등록되고, 변하는 값
 * (canvasWidth/Height, hasExpandSlot, onExpand)은 모두 ref로 읽어 재구독을 막는다.
 */
export function usePanZoom({
  canvasHeight,
  panelHeight,
  hasExpandSlot,
  onExpand,
  abortDrawingRef,
}: UsePanZoomParams) {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [fingerTouchCount, setFingerTouchCount] = useState(0);
  const [expandHoldProgress, setExpandHoldProgress] = useState(0);
  const [isAtExpandScroll, setIsAtExpandScroll] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(false);
  const [minimap, setMinimap] = useState<MinimapState>({
    visible: false,
    boxW: 0,
    boxH: 0,
    rectLeft: 0,
    rectTop: 0,
    rectW: 0,
    rectH: 0,
  });

  // DOM refs (JSX에서 부착)
  const panContainerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasScaledInnerRef = useRef<HTMLDivElement>(null);
  /** 줌 % 배지 — 핀치 중 리렌더 없이 DOM만 갱신 */
  const zoomBadgeRef = useRef<HTMLDivElement>(null);

  const zoomRef = useRef(zoom);
  const canvasSizeRef = useRef({ width: canvasWidth, height: canvasHeight });
  canvasSizeRef.current = { width: canvasWidth, height: canvasHeight };
  const fingerTouchCountRef = useRef(0);
  fingerTouchCountRef.current = fingerTouchCount;
  const isExpandingRef = useRef(false);
  const expandHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandHoldProgressTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const expandHoldStartAtRef = useRef<number | null>(null);
  const gestureHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // 변하는 입력값 — mount-once 제스처 effect에서 ref로 읽는다
  const hasExpandSlotRef = useRef(hasExpandSlot);
  hasExpandSlotRef.current = hasExpandSlot;
  const panelHeightRef = useRef(panelHeight);
  panelHeightRef.current = panelHeight;
  const onExpandRef = useRef(onExpand);
  onExpandRef.current = onExpand;

  /** 제스처 중 React 리렌더 없이 DOM만 갱신 → iPad 핀치처럼 부드럽게 */
  const applyZoomVisual = useCallback((z: number) => {
    zoomRef.current = z;
    const { width: cw, height: ch } = canvasSizeRef.current;
    const wrapper = canvasWrapperRef.current;
    const scaled = canvasScaledInnerRef.current;
    const containerEl = panContainerRef.current;
    if (wrapper && cw > 0) {
      wrapper.style.width = `${cw * z}px`;
      wrapper.style.height = `${ch * z}px`;
    }
    if (scaled) {
      scaled.style.transform = `scale(${z})`;
    }
    if (containerEl) {
      const allowPanX = z > MIN_ZOOM;
      containerEl.classList.toggle('overflow-x-auto', allowPanX);
      containerEl.classList.toggle('overflow-x-hidden', !allowPanX);
    }
    // 줌 % 배지: 확대 상태에서만 표시 (리렌더 없이 DOM 직접 갱신)
    const badge = zoomBadgeRef.current;
    if (badge) {
      const zoomedIn = z > MIN_ZOOM + 0.005;
      badge.style.opacity = zoomedIn ? '1' : '0';
      badge.textContent = `${Math.round(z * 100)}%`;
    }
  }, []);

  /** 로드 직후 호출 — 뷰를 맨 위로 되돌리고 제스처/확장 상태 초기화 */
  const resetView = useCallback(() => {
    requestAnimationFrame(() => {
      const el = panContainerRef.current;
      if (!el) return;
      el.scrollTop = 0;
      fingerTouchCountRef.current = 0;
      setFingerTouchCount(0);
      setIsAtExpandScroll(false);
    });
  }, []);

  // 캔버스 너비 측정 (pan 컨테이너 기준)
  useEffect(() => {
    const el = panContainerRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = el.clientWidth;
      if (w > 0) setCanvasWidth(w);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // zoom state 변경 시 시각 반영
  useEffect(() => {
    zoomRef.current = zoom;
    applyZoomVisual(zoom);
  }, [zoom, applyZoomVisual]);

  // canvasHeight/zoom/슬롯 변경 후 pan 위치 클램프 (확장 슬롯 제외 → 슬롯에 안 머무름)
  useLayoutEffect(() => {
    const el = panContainerRef.current;
    if (!el) return;
    const maxTop = maxPanY(canvasHeight, zoom, 0, el.clientHeight);
    if (el.scrollTop > maxTop) el.scrollTop = maxTop;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    if (el.scrollLeft > maxLeft) el.scrollLeft = maxLeft;
    if (zoom <= MIN_ZOOM && el.scrollLeft > 0) el.scrollLeft = 0;
  }, [canvasHeight, zoom, hasExpandSlot]);

  // 미니맵 + 확장 위치 갱신 (스크롤 thumb 제거 → 두 손가락 이동을 미니맵으로 안내)
  useLayoutEffect(() => {
    const el = panContainerRef.current;
    if (!el) return;

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

    const scheduleUpdate = () => requestAnimationFrame(updateViewport);
    scheduleUpdate();
    el.addEventListener('scroll', scheduleUpdate, { passive: true });
    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', scheduleUpdate);
      ro.disconnect();
    };
  }, [canvasHeight, canvasWidth, zoom, hasExpandSlot, panelHeight]);

  // 제스처 리스너 (mount-once) — 변하는 값은 모두 ref로 읽어 재구독 방지
  useEffect(() => {
    const el = panContainerRef.current;
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

    const expandSlotPx = () =>
      hasExpandSlotRef.current ? EXPAND_HINT_HEIGHT_PX : 0;
    const canvasContentH = (zoomVal: number) =>
      canvasSizeRef.current.height * zoomVal;

    const commitZoomState = () =>
      setZoom((prev) => (prev === zoomRef.current ? prev : zoomRef.current));

    const syncFingerCount = (count: number) => {
      fingerTouchCountRef.current = count;
      setFingerTouchCount(count);
    };

    const clearExpandHoldTimer = () => {
      if (!expandHoldTimerRef.current) return;
      clearTimeout(expandHoldTimerRef.current);
      expandHoldTimerRef.current = null;
      if (expandHoldProgressTimerRef.current) {
        clearInterval(expandHoldProgressTimerRef.current);
        expandHoldProgressTimerRef.current = null;
      }
      expandHoldStartAtRef.current = null;
      setExpandHoldProgress(0);
    };
    const cancelExpandHold = clearExpandHoldTimer;

    const showGestureHintBriefly = () => {
      setShowGestureHint(true);
      if (gestureHintTimerRef.current)
        clearTimeout(gestureHintTimerRef.current);
      gestureHintTimerRef.current = setTimeout(() => {
        setShowGestureHint(false);
        gestureHintTimerRef.current = null;
      }, GESTURE_HINT_MS);
    };
    const hideGestureHint = () => {
      if (gestureHintTimerRef.current) {
        clearTimeout(gestureHintTimerRef.current);
        gestureHintTimerRef.current = null;
      }
      setShowGestureHint(false);
    };

    /** 확장 힌트 종료 시 pan을 확장 슬롯 밖(캔버스 끝)으로 되돌림 */
    const hideExpandHint = () => {
      const maxTop = maxPanY(
        canvasSizeRef.current.height,
        zoomRef.current,
        0,
        el.clientHeight
      );
      if (el.scrollTop > maxTop) el.scrollTop = maxTop;
      syncFingerCount(0);
    };

    const runExpand = () => {
      if (isExpandingRef.current) return;
      isExpandingRef.current = true;
      syncFingerCount(0);
      onExpandRef.current();
      setTimeout(() => {
        isExpandingRef.current = false;
      }, 600);
    };

    const scheduleWheelZoomCommit = () => {
      cancelAnimationFrame(wheelCommitRaf);
      wheelCommitRaf = requestAnimationFrame(() => {
        wheelCommitRaf = 0;
        commitZoomState();
      });
    };

    const isStylus = (t: Touch) =>
      (t as Touch & { touchType?: string }).touchType === 'stylus';

    const countFingerTouches = (touches: TouchList) => {
      let n = 0;
      for (let i = 0; i < touches.length; i++) {
        if (!isStylus(touches[i]!)) n++;
      }
      return n;
    };

    const getCenter = (touches: TouchList) => {
      let sumX = 0;
      let sumY = 0;
      let n = 0;
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        if (isStylus(t)) continue;
        sumX += t.clientX;
        sumY += t.clientY;
        n++;
      }
      return n > 0 ? { x: sumX / n, y: sumY / n } : { x: 0, y: 0 };
    };

    const getPinchDistance = (touches: TouchList) => {
      const finger: Touch[] = [];
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!;
        if (!isStylus(t)) finger.push(t);
      }
      if (finger.length < 2) return 0;
      const dx = finger[0]!.clientX - finger[1]!.clientX;
      const dy = finger[0]!.clientY - finger[1]!.clientY;
      return Math.hypot(dx, dy);
    };

    const isPinchCenterOnCanvas = (clientY: number) => {
      const { width: cw, height: ch } = canvasSizeRef.current;
      if (cw <= 0 || ch <= 0) return false;
      const rect = el.getBoundingClientRect();
      const localY = (el.scrollTop + (clientY - rect.top)) / zoomRef.current;
      return localY >= 0 && localY <= ch;
    };

    const atExpandScroll = () =>
      el.scrollTop + el.clientHeight >= canvasContentH(zoomRef.current) + 1;

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
        runExpand();
      }, EXPAND_HOLD_MS);
    };

    const captureGestureBaseline = (touches: TouchList) => {
      const center = getCenter(touches);
      gestureStartZoom = zoomRef.current;
      gestureStartDist = getPinchDistance(touches);
      gestureStartCenterX = center.x;
      gestureStartCenterY = center.y;
      gestureMode = 'idle';
      const rect = el.getBoundingClientRect();
      gestureWorldX =
        (el.scrollLeft + (center.x - rect.left)) / gestureStartZoom;
      gestureWorldY = (el.scrollTop + (center.y - rect.top)) / gestureStartZoom;
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

    const applyZoomAtPoint = (
      clientX: number,
      clientY: number,
      ratio: number
    ) => {
      if (Math.abs(ratio - 1) < 0.001) return;
      if (!isPinchCenterOnCanvas(clientY)) return;

      const oldZoom = zoomRef.current;
      const newZoom = clampZoom(oldZoom * ratio);
      if (newZoom === oldZoom) return;

      const { width: cw, height: ch } = canvasSizeRef.current;
      const rect = el.getBoundingClientRect();
      const focalX = clientX - rect.left;
      const focalY = clientY - rect.top;
      const localX = Math.min(
        cw,
        Math.max(0, (el.scrollLeft + focalX) / oldZoom)
      );
      const localY = Math.min(
        ch,
        Math.max(0, (el.scrollTop + focalY) / oldZoom)
      );

      const maxTop = maxPanY(ch, newZoom, expandSlotPx(), el.clientHeight);
      const maxLeft = Math.max(0, cw * newZoom - el.clientWidth);

      applyZoomVisual(newZoom);
      el.scrollLeft = Math.max(0, Math.min(maxLeft, localX * newZoom - focalX));
      el.scrollTop = Math.max(0, Math.min(maxTop, localY * newZoom - focalY));
      scheduleWheelZoomCommit();
    };

    /**
     * 제스처 시작 기준 한 번에 pan·줌 계산 (Safari 페이지 핀치와 동일한 focal 고정).
     * touchmove마다 setZoom 하지 않음.
     */
    const applyTwoFingerGesture = (touches: TouchList) => {
      if (!twoFingerActive) return;

      const center = getCenter(touches);
      const dist = getPinchDistance(touches);

      // ── 의도 잠금: 이동/줌 중 하나로 확정 (확정 전엔 데드존) ──
      // pan 우선. 줌은 손가락 간격 변화가 중심 이동보다 확실히 클 때만 잠금
      // (평행 이동이 줌으로 새는 것 방지).
      if (gestureMode === 'idle') {
        const distDelta =
          gestureStartDist > 0 ? Math.abs(dist - gestureStartDist) : 0;
        const centerDelta = Math.hypot(
          center.x - gestureStartCenterX,
          center.y - gestureStartCenterY
        );
        if (centerDelta >= GESTURE_PAN_LOCK_PX && centerDelta >= distDelta) {
          gestureMode = 'pan';
        } else if (distDelta >= GESTURE_ZOOM_LOCK_PX) {
          gestureMode = 'zoom';
        } else {
          // 아직 의도 불명 — 떨림 무시. 원래 크기·하단이면 확장 홀드만 유지
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
        isPinchCenterOnCanvas(center.y)
      ) {
        const target = clampZoom(gestureStartZoom * (dist / gestureStartDist));
        // 경계(원래 크기/최대)에 닿으면 데드존 무시하고 정확히 스냅
        const atBound = target === MIN_ZOOM || target === MAX_ZOOM;
        if (
          target !== prevZoom &&
          (atBound || Math.abs(target - prevZoom) >= PINCH_ZOOM_DEADZONE)
        ) {
          newZoom = target;
        }
      }
      const zoomChanged = newZoom !== prevZoom;

      const { width: cw, height: ch } = canvasSizeRef.current;
      const rect = el.getBoundingClientRect();
      const focalX = center.x - rect.left;
      const focalY = center.y - rect.top;
      const maxTop = maxPanY(ch, newZoom, expandSlotPx(), el.clientHeight);
      const maxLeft = Math.max(0, cw * newZoom - el.clientWidth);

      if (zoomChanged) applyZoomVisual(newZoom);

      const targetLeft = Math.max(
        0,
        Math.min(maxLeft, gestureWorldX * newZoom - focalX)
      );
      const targetTop = Math.max(
        0,
        Math.min(maxTop, gestureWorldY * newZoom - focalY)
      );

      // 줌이 바뀐 프레임은 focal 고정 위해 항상 반영, 줌 변화 없으면 떨림 데드존 이상일 때만
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
        if (touch && !isStylus(touch)) {
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
      // 한/0 손가락(또는 stylus 단독)은 pan/zoom 대상 아님 — 기본 동작만 막음
      if (e.touches.length > 0) e.preventDefault();
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
      if (fingerCount === 0) hideExpandHint();
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
        applyZoomAtPoint(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.008));
        return;
      }
      const { width: cw, height: ch } = canvasSizeRef.current;
      // 휠은 확장 슬롯 미진입(0), 가로는 확대 상태에서만 여유 생김
      const maxTop = maxPanY(ch, zoomRef.current, 0, el.clientHeight);
      const maxLeft = Math.max(0, cw * zoomRef.current - el.clientWidth);
      const nextTop = Math.max(0, Math.min(maxTop, el.scrollTop + e.deltaY));
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
      clearExpandHoldTimer();
      if (gestureHintTimerRef.current)
        clearTimeout(gestureHintTimerRef.current);
    };
  }, [applyZoomVisual, abortDrawingRef]);

  return {
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
  };
}
