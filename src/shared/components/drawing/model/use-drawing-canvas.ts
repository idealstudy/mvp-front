import { type RefObject, useCallback, useEffect, useRef } from 'react';

import { createId } from '@/shared/lib/create-id';
import { getStroke } from 'perfect-freehand';

import { densifyLargeGaps } from '../lib/densify-stroke-points';
import { ensureMinPoints } from '../lib/ensure-stroke-points';
import { getStrokeRenderOptions } from '../lib/get-stroke-render-options';
import {
  beginCaptureStroke,
  capturePhase,
  capturePointerEvent,
  flushStrokeCapture,
} from '../lib/pointer-session-capture';
import { appendPointerInput } from '../lib/stroke-input';
import type { DrawingTool, PageSize, Point, Stroke } from '../types';

/** 컴파일 오류 시 /test-drawing 전체 500 — 동일 스코프 `const canvas` 중복 선언 금지. docs/drawing-internal-server-error.md */
const ERASER_RADIUS = 12;

function getSvgPathFromStroke(points: number[][]): string {
  if (points.length < 2) return '';
  const d = points.reduce<string[]>((acc, point, i, arr) => {
    const x0 = point[0] ?? 0;
    const y0 = point[1] ?? 0;
    const next = arr[(i + 1) % arr.length] ?? point;
    const x1 = next[0] ?? 0;
    const y1 = next[1] ?? 0;
    if (i === 0) acc.push(`M ${x0.toFixed(2)},${y0.toFixed(2)}`);
    else
      acc.push(
        `Q ${x0.toFixed(2)},${y0.toFixed(2)} ${((x0 + x1) / 2).toFixed(2)},${((y0 + y1) / 2).toFixed(2)}`
      );
    return acc;
  }, []);
  d.push('Z');
  return d.join(' ');
}

function isDrawablePointer(e: PointerEvent): boolean {
  return e.pointerType === 'pen' || e.pointerType === 'mouse';
}

function isPrimaryButtonDown(e: PointerEvent): boolean {
  return (e.buttons & 1) === 1;
}

/** iPad: Scribble 활성 시에도 펜이 눌린 상태인지 */
function isPenContact(e: PointerEvent): boolean {
  if (e.pointerType !== 'pen') return isPrimaryButtonDown(e);
  return e.pressure > 0 || isPrimaryButtonDown(e);
}

function strokePressure(e: PointerEvent): number {
  return e.pressure > 0 ? e.pressure : 0.5;
}

function fillStrokeDot(
  ctx: CanvasRenderingContext2D,
  pixelPoints: number[][],
  stroke: Stroke
) {
  const first = pixelPoints[0];
  if (!first) return;
  const radius =
    (stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size) / 2;
  ctx.beginPath();
  ctx.arc(first[0] ?? 0, first[1] ?? 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = stroke.color;
  ctx.globalAlpha = stroke.tool === 'highlighter' ? 0.4 : 1;
  ctx.fill();
}

function renderSingleStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  canvasWidth: number,
  canvasHeight: number
) {
  const sampled = densifyLargeGaps(stroke.points, canvasWidth, canvasHeight);
  const pixelPoints = sampled.map((p) => [
    p.x * canvasWidth,
    p.y * canvasHeight,
    p.pressure ?? 0.5,
  ]);

  if (pixelPoints.length === 0) return;

  const outlinePoints = getStroke(pixelPoints, getStrokeRenderOptions(stroke));

  const pathData = getSvgPathFromStroke(outlinePoints);
  if (!pathData) {
    fillStrokeDot(ctx, pixelPoints, stroke);
    return;
  }

  ctx.fillStyle = stroke.color;
  ctx.globalAlpha = stroke.tool === 'highlighter' ? 0.4 : 1;
  ctx.fill(new Path2D(pathData));
}

function strokesSignature(strokes: Stroke[]) {
  return strokes.map((s) => `${s.id}:${s.points.length}`).join('|');
}

export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  liveStrokeId?: string | null
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (const stroke of strokes) {
    if (liveStrokeId && stroke.id === liveStrokeId) continue;
    renderSingleStroke(ctx, stroke, width, height);
  }

  if (liveStrokeId) {
    const live = strokes.find((s) => s.id === liveStrokeId);
    if (live) renderSingleStroke(ctx, live, width, height);
  }

  ctx.globalAlpha = 1;
}

type UseDrawingCanvasOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  strokes: Stroke[];
  tool: DrawingTool;
  color: string;
  size: number;
  pageSize: PageSize;
  onStrokeAdd: (stroke: Stroke) => void;
  onStrokeErase: (ids: string[]) => void;
  /** true면 획 완료 시 /api/drawing-session-ingest 로 전송 */
  capturePointerSession?: boolean;
};

export function useDrawingCanvas({
  canvasRef,
  strokes,
  tool,
  color,
  size,
  pageSize,
  onStrokeAdd,
  onStrokeErase,
  capturePointerSession = false,
}: UseDrawingCanvasOptions) {
  const capturePointerSessionRef = useRef(capturePointerSession);
  capturePointerSessionRef.current = capturePointerSession;
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const strokeIdRef = useRef('');
  const activePointerIdRef = useRef<number | null>(null);
  /** 획 시작 시 rect 고정 — 빠른 획 좌표·앞부분 샘플 일관 */
  const strokeRectRef = useRef<DOMRectReadOnly | null>(null);
  const sampleOptsRef = useRef({
    normalized: true as const,
    pageWidth: pageSize.width,
    pageHeight: pageSize.height,
  });

  const strokesRef = useRef(strokes);
  /** persistStroke 직후 React props 동기화 전까지만 캐시 유지용 */
  const localPendingStrokeIdRef = useRef<string | null>(null);
  const committedLayerRef = useRef<HTMLCanvasElement | null>(null);
  const committedCacheRef = useRef({
    signature: '',
    width: 0,
    height: 0,
  });

  const onStrokeAddRef = useRef(onStrokeAdd);
  onStrokeAddRef.current = onStrokeAdd;

  const toolRef = useRef(tool);
  toolRef.current = tool;

  const colorRef = useRef(color);
  colorRef.current = color;

  const sizeRef = useRef(size);
  sizeRef.current = size;

  const getNormalizedCoords = useCallback(
    (e: PointerEvent) => {
      const rect =
        strokeRectRef.current ?? canvasRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return { x: 0, y: 0 };
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    [canvasRef]
  );

  const rebuildCommittedLayer = useCallback(
    (savedStrokes: Stroke[], width: number, height: number) => {
      let layer = committedLayerRef.current;
      if (!layer) {
        layer = document.createElement('canvas');
        committedLayerRef.current = layer;
      }
      if (layer.width !== width) layer.width = width;
      if (layer.height !== height) layer.height = height;

      const layerCtx = layer.getContext('2d');
      if (!layerCtx) return;

      layerCtx.clearRect(0, 0, width, height);
      for (const stroke of savedStrokes) {
        renderSingleStroke(layerCtx, stroke, width, height);
      }
      layerCtx.globalAlpha = 1;

      committedCacheRef.current = {
        signature: strokesSignature(savedStrokes),
        width,
        height,
      };
    },
    []
  );

  const paintStrokes = useCallback(
    (strokeList: Stroke[], liveStrokeId?: string | null) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const { width, height } = canvas;

      if (!liveStrokeId) {
        renderStrokes(ctx, strokeList);
        rebuildCommittedLayer(strokeList, width, height);
        return;
      }

      const savedStrokes = strokesRef.current;
      const cache = committedCacheRef.current;
      if (
        cache.signature !== strokesSignature(savedStrokes) ||
        cache.width !== width ||
        cache.height !== height
      ) {
        rebuildCommittedLayer(savedStrokes, width, height);
      }

      ctx.clearRect(0, 0, width, height);
      const layer = committedLayerRef.current;
      if (layer) ctx.drawImage(layer, 0, 0);

      const liveStroke = strokeList.find((s) => s.id === liveStrokeId);
      if (liveStroke) {
        renderSingleStroke(ctx, liveStroke, width, height);
      }
      ctx.globalAlpha = 1;
    },
    [canvasRef, rebuildCommittedLayer]
  );

  const renderLiveStroke = useCallback(() => {
    if (currentPointsRef.current.length === 0) return;

    const liveStroke: Stroke = {
      id: strokeIdRef.current,
      pageNumber: 0,
      points: currentPointsRef.current,
      color: colorRef.current,
      size: sizeRef.current,
      tool: toolRef.current,
    };
    paintStrokes([...strokesRef.current, liveStroke], strokeIdRef.current);
  }, [paintStrokes]);

  const releaseCapture = useCallback(
    (pointerId: number) => {
      const canvas = canvasRef.current;
      if (canvas?.hasPointerCapture(pointerId)) {
        try {
          canvas.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }
      }
    },
    [canvasRef]
  );

  const persistStroke = useCallback(
    (points: Point[]) => {
      if (points.length === 0) return;

      const normalized = ensureMinPoints(points, pageSize, sizeRef.current);
      const stroke: Stroke = {
        id: strokeIdRef.current,
        pageNumber: 0,
        points: normalized,
        color: colorRef.current,
        size: sizeRef.current,
        tool: toolRef.current,
      };

      localPendingStrokeIdRef.current = stroke.id;
      strokesRef.current = [...strokesRef.current, stroke];
      paintStrokes(strokesRef.current);
      onStrokeAddRef.current(stroke);

      if (capturePointerSessionRef.current) {
        const canvas = canvasRef.current;
        flushStrokeCapture({
          strokeId: stroke.id,
          tool: stroke.tool,
          pointCount: stroke.points.length,
          canvasWidth: canvas?.width ?? pageSize.width,
          canvasHeight: canvas?.height ?? pageSize.height,
        });
      }
    },
    [paintStrokes, pageSize, canvasRef]
  );

  const saveCurrentStroke = useCallback(
    (endPoint?: Point) => {
      const points = [...currentPointsRef.current];
      if (points.length === 0) return;

      if (endPoint) {
        const last = points[points.length - 1];
        if (!last || last.x !== endPoint.x || last.y !== endPoint.y) {
          points.push(endPoint);
        }
      }

      currentPointsRef.current = [];
      persistStroke(points);
    },
    [persistStroke]
  );

  const resetDrawingState = useCallback(() => {
    isDrawingRef.current = false;
    activePointerIdRef.current = null;
    currentPointsRef.current = [];
    strokeRectRef.current = null;
  }, []);

  /** 두 손가락 제스처 시작 시 미완성 획을 버림 (저장하지 않음) */
  const abortActiveStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    const pointerId = activePointerIdRef.current;
    if (pointerId !== null) releaseCapture(pointerId);
    currentPointsRef.current = [];
    resetDrawingState();
    paintStrokes(strokesRef.current);
  }, [releaseCapture, resetDrawingState, paintStrokes]);

  const appendFromEvent = useCallback((e: PointerEvent) => {
    const rect = strokeRectRef.current;
    if (!rect) return;
    currentPointsRef.current = appendPointerInput(
      currentPointsRef.current,
      e,
      rect,
      sampleOptsRef.current
    );
  }, []);

  const beginStroke = useCallback(
    (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      strokeRectRef.current = rect;
      sampleOptsRef.current = {
        normalized: true,
        pageWidth: pageSize.width,
        pageHeight: pageSize.height,
      };
      strokeIdRef.current = createId();
      if (capturePointerSessionRef.current) {
        beginCaptureStroke();
        capturePointerEvent(e, 'pointerdown');
      }

      let points = appendPointerInput([], e, rect, sampleOptsRef.current);
      if (points.length === 0) {
        const { x, y } = getNormalizedCoords(e);
        points = [{ x, y, pressure: strokePressure(e) }];
      }

      currentPointsRef.current = points;
      activePointerIdRef.current = e.pointerId;
      isDrawingRef.current = true;
      return true;
    },
    [canvasRef, pageSize.width, pageSize.height, getNormalizedCoords]
  );

  const finishStroke = useCallback(
    (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      const pointerId = activePointerIdRef.current;
      releaseCapture(pointerId);
      if (capturePointerSessionRef.current) {
        capturePointerEvent(e, 'pointerup');
      }
      appendFromEvent(e);
      saveCurrentStroke();
      resetDrawingState();
    },
    [releaseCapture, appendFromEvent, resetDrawingState, saveCurrentStroke]
  );

  /** 다른 pointerId가 down될 때만 호출 — 획을 분리 저장 */
  const finishStrokeAtLastPoint = useCallback(() => {
    if (!isDrawingRef.current) return;

    const pointerId = activePointerIdRef.current;
    if (pointerId !== null) releaseCapture(pointerId);

    if (capturePointerSessionRef.current) {
      capturePhase('finishAtLastPoint');
    }
    saveCurrentStroke();
    resetDrawingState();
  }, [releaseCapture, resetDrawingState, saveCurrentStroke]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pageSize.width === 0) return;
    let needsRedraw = false;
    if (canvas.width !== pageSize.width) {
      canvas.width = pageSize.width;
      needsRedraw = true;
    }
    if (canvas.height !== pageSize.height) {
      canvas.height = pageSize.height;
      needsRedraw = true;
    }
    if (needsRedraw) {
      committedCacheRef.current = { signature: '', width: 0, height: 0 };
      paintStrokes(strokesRef.current);
    }
  }, [pageSize, canvasRef, paintStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
    if (isDrawingRef.current) return;

    if (strokes.length < strokesRef.current.length) {
      const pendingId = strokesRef.current[strokes.length]?.id;
      const awaitingLocalAdd =
        pendingId !== undefined &&
        pendingId === localPendingStrokeIdRef.current &&
        strokes.length > 0 &&
        strokes.every((s, i) => s.id === strokesRef.current[i]?.id);

      if (awaitingLocalAdd) {
        paintStrokes(strokesRef.current);
        return;
      }
    }

    localPendingStrokeIdRef.current = null;
    strokesRef.current = strokes;
    paintStrokes(strokes);
  }, [strokes, paintStrokes, canvasRef]);

  const eraseAtPoint = useCallback(
    (x: number, y: number) => {
      const toEraseIds: string[] = [];
      for (const s of strokesRef.current) {
        const hit = s.points.some((p) => {
          const dx = (p.x - x) * pageSize.width;
          const dy = (p.y - y) * pageSize.height;
          return dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;
        });
        if (hit) toEraseIds.push(s.id);
      }
      if (toEraseIds.length === 0) return;

      const toEraseSet = new Set(toEraseIds);
      strokesRef.current = strokesRef.current.filter(
        (s) => !toEraseSet.has(s.id)
      );
      localPendingStrokeIdRef.current = null;
      paintStrokes(strokesRef.current);
      onStrokeErase(toEraseIds);
    },
    [pageSize.width, pageSize.height, onStrokeErase, paintStrokes]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      const { x, y } = getNormalizedCoords(e);

      if (toolRef.current === 'eraser') {
        eraseAtPoint(x, y);
        return;
      }

      if (e.pointerType === 'mouse' && !isPrimaryButtonDown(e)) return;

      // iOS: 동일 접촉 중복 down 무시 — 한 획이 둘로 쪼개지거나 이어지지 않게
      if (isDrawingRef.current && activePointerIdRef.current === e.pointerId) {
        if (capturePointerSessionRef.current) {
          capturePhase('dedupe:pointerdown');
        }
        return;
      }

      // 다른 pointer(멀티터치 등)만 이전 획 저장 후 새 획
      if (isDrawingRef.current) {
        finishStrokeAtLastPoint();
      }

      if (!beginStroke(e)) return;
      renderLiveStroke();
    },
    [
      getNormalizedCoords,
      eraseAtPoint,
      beginStroke,
      renderLiveStroke,
      finishStrokeAtLastPoint,
    ]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (e.buttons > 1) return;

      const { x, y } = getNormalizedCoords(e);

      if (toolRef.current === 'eraser') {
        if (!isPenContact(e)) return;
        eraseAtPoint(x, y);
        return;
      }

      if (!isDrawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      // 펜은 네이티브 pointermove에서 coalesced 수집 (iPad)
      if (e.pointerType === 'pen') return;

      if (!isPenContact(e)) return;

      appendFromEvent(e);
      renderLiveStroke();
    },
    [getNormalizedCoords, eraseAtPoint, appendFromEvent, renderLiveStroke]
  );

  const handlePointerDownRef = useRef(handlePointerDown);
  handlePointerDownRef.current = handlePointerDown;

  const handlePointerMoveRef = useRef(handlePointerMove);
  handlePointerMoveRef.current = handlePointerMove;

  const eraseAtPointRef = useRef(eraseAtPoint);
  eraseAtPointRef.current = eraseAtPoint;

  const getNormalizedCoordsRef = useRef(getNormalizedCoords);
  getNormalizedCoordsRef.current = getNormalizedCoords;

  const appendFromEventRef = useRef(appendFromEvent);
  appendFromEventRef.current = appendFromEvent;

  const renderLiveStrokeRef = useRef(renderLiveStroke);
  renderLiveStrokeRef.current = renderLiveStroke;

  /** React 합성 이벤트 대신 캡처 단계 네이티브 — 펜 down/move 인식 지연 완화 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen' || e.pointerType === 'mouse') {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
      }
      handlePointerDownRef.current(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        if (toolRef.current === 'eraser') {
          if (!isPenContact(e)) return;
          const { x, y } = getNormalizedCoordsRef.current(e);
          eraseAtPointRef.current(x, y);
          return;
        }

        if (!isDrawingRef.current) return;
        if (activePointerIdRef.current !== e.pointerId) return;
        if (capturePointerSessionRef.current) {
          capturePointerEvent(e, 'native:pointermove');
        }
        appendFromEventRef.current(e);
        renderLiveStrokeRef.current();
        return;
      }

      if (e.pointerType === 'mouse') {
        handlePointerMoveRef.current(e);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown, { capture: true });
    canvas.addEventListener('pointermove', onPointerMove);
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown, {
        capture: true,
      });
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, [canvasRef, pageSize.width, pageSize.height]);

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (toolRef.current === 'eraser') {
        resetDrawingState();
        return;
      }
      if (!isDrawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      finishStroke(e);
    },
    [finishStroke, resetDrawingState]
  );

  const handlePointerUpRef = useRef(handlePointerUp);
  handlePointerUpRef.current = handlePointerUp;

  useEffect(() => {
    const onWindowPointerEnd = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      if (!isDrawablePointer(e)) return;
      if (activePointerIdRef.current !== e.pointerId) return;
      if (toolRef.current === 'eraser') return;
      handlePointerUpRef.current(e);
    };

    window.addEventListener('pointerup', onWindowPointerEnd, { capture: true });
    window.addEventListener('pointercancel', onWindowPointerEnd, {
      capture: true,
    });
    return () => {
      window.removeEventListener('pointerup', onWindowPointerEnd, {
        capture: true,
      });
      window.removeEventListener('pointercancel', onWindowPointerEnd, {
        capture: true,
      });
    };
  }, []);

  const handlePointerCancel = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (
        isDrawingRef.current &&
        activePointerIdRef.current === e.pointerId &&
        toolRef.current !== 'eraser'
      ) {
        if (capturePointerSessionRef.current) {
          capturePointerEvent(e, 'handler:pointercancel');
        }
        finishStroke(e);
        return;
      }

      releaseCapture(e.pointerId);
      if (activePointerIdRef.current === e.pointerId) {
        resetDrawingState();
      }
    },
    [releaseCapture, finishStroke, resetDrawingState]
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      const canvas = canvasRef.current;
      if (!canvas?.hasPointerCapture(e.pointerId)) return;
      handlePointerUp(e);
    },
    [canvasRef, handlePointerUp]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerLeave,
    abortActiveStroke,
  };
}
