import { type RefObject, useCallback, useEffect, useRef } from 'react';

import { getStroke } from 'perfect-freehand';

import type { DrawingTool, PageSize, Point, Stroke } from '../types';

const ERASER_RADIUS = 12;
/** iOS: 동일 접촉의 중복 pointerdown (ms) */
const POINTER_DOWN_DEDUPE_MS = 45;

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

function getCoalescedPointerEvents(e: PointerEvent): PointerEvent[] {
  if (typeof e.getCoalescedEvents === 'function') {
    const coalesced = e.getCoalescedEvents();
    if (coalesced.length > 0) return coalesced;
  }
  return [e];
}

function isDrawablePointer(e: PointerEvent): boolean {
  return e.pointerType === 'pen' || e.pointerType === 'mouse';
}

function isPrimaryButtonDown(e: PointerEvent): boolean {
  return (e.buttons & 1) === 1;
}

function ensureMinPoints(
  points: Point[],
  pageSize: PageSize,
  strokeSize: number
): Point[] {
  if (points.length === 0) return points;

  const minPx = Math.max(strokeSize * 2, 8);
  const offsetX = minPx / pageSize.width;
  const offsetY = minPx / pageSize.height;

  if (points.length === 1) {
    const p = points[0]!;
    return [p, { x: p.x + offsetX, y: p.y + offsetY, pressure: p.pressure }];
  }

  const first = points[0]!;
  const last = points[points.length - 1]!;
  const dx = (last.x - first.x) * pageSize.width;
  const dy = (last.y - first.y) * pageSize.height;
  if (Math.hypot(dx, dy) >= minPx) return points;

  return [
    first,
    {
      x: first.x + offsetX,
      y: first.y + offsetY,
      pressure: last.pressure ?? first.pressure,
    },
  ];
}

export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[]
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (const stroke of strokes) {
    const pixelPoints = stroke.points.map((p) => [
      p.x * width,
      p.y * height,
      p.pressure ?? 0.5,
    ]);

    const outlinePoints = getStroke(pixelPoints, {
      size: stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size,
      thinning: stroke.tool === 'highlighter' ? 0 : 0.5,
      smoothing: 0.5,
      streamline: stroke.tool === 'highlighter' ? 0.5 : 0.5,
      simulatePressure: true,
    });

    const path2d = new Path2D(getSvgPathFromStroke(outlinePoints));

    if (stroke.tool === 'highlighter') {
      ctx.globalAlpha = 0.4;
    } else {
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = stroke.color;
    ctx.fill(path2d);
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
}: UseDrawingCanvasOptions) {
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const strokeIdRef = useRef('');
  const activePointerIdRef = useRef<number | null>(null);
  const strokeDownTimeRef = useRef(0);

  const strokesRef = useRef(strokes);

  // persistStroke 직후·setState 반영 전 렌더가 ref를 덮어쓰지 않도록 props와 분리 동기화
  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

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
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    [canvasRef]
  );

  const paintStrokes = useCallback(
    (strokeList: Stroke[]) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      renderStrokes(ctx, strokeList);
    },
    [canvasRef]
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
    paintStrokes([...strokesRef.current, liveStroke]);
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

      const nextStrokes = [...strokesRef.current, stroke];
      strokesRef.current = nextStrokes;
      paintStrokes(nextStrokes);
      onStrokeAddRef.current(stroke);
    },
    [paintStrokes, pageSize]
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
  }, []);

  const beginStroke = useCallback(
    (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      activePointerIdRef.current = e.pointerId;
      isDrawingRef.current = true;
      strokeIdRef.current = crypto.randomUUID();
      strokeDownTimeRef.current = e.timeStamp;

      const { x, y } = getNormalizedCoords(e);
      currentPointsRef.current = [{ x, y, pressure: e.pressure }];
      return true;
    },
    [canvasRef, getNormalizedCoords]
  );

  const finishStroke = useCallback(
    (e: PointerEvent) => {
      if (!isDrawingRef.current) return;

      const pointerId = activePointerIdRef.current ?? e.pointerId;
      releaseCapture(pointerId);

      const { x, y } = getNormalizedCoords(e);
      saveCurrentStroke({ x, y, pressure: e.pressure });
      resetDrawingState();
    },
    [releaseCapture, resetDrawingState, getNormalizedCoords, saveCurrentStroke]
  );

  const finishStrokeAtLastPoint = useCallback(() => {
    if (!isDrawingRef.current) return;

    const pointerId = activePointerIdRef.current;
    if (pointerId !== null) releaseCapture(pointerId);

    const last = currentPointsRef.current.at(-1);
    if (last) {
      saveCurrentStroke({ x: last.x, y: last.y, pressure: last.pressure });
    }
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
    if (needsRedraw) paintStrokes(strokesRef.current);
  }, [pageSize, canvasRef, paintStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
    paintStrokes(strokes);
  }, [strokes, paintStrokes, canvasRef]);

  const appendPoint = useCallback(
    (e: PointerEvent) => {
      const { x, y } = getNormalizedCoords(e);
      const points = currentPointsRef.current;
      const last = points[points.length - 1];
      if (last && last.x === x && last.y === y) return;
      currentPointsRef.current = [...points, { x, y, pressure: e.pressure }];
    },
    [getNormalizedCoords]
  );

  const eraseAtPoint = useCallback(
    (x: number, y: number) => {
      const toErase = strokesRef.current
        .filter((s) =>
          s.points.some((p) => {
            const dx = (p.x - x) * pageSize.width;
            const dy = (p.y - y) * pageSize.height;
            return Math.sqrt(dx * dx + dy * dy) < ERASER_RADIUS;
          })
        )
        .map((s) => s.id);
      if (toErase.length > 0) onStrokeErase(toErase);
    },
    [pageSize.width, pageSize.height, onStrokeErase]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (toolRef.current === 'select') return;

      const { x, y } = getNormalizedCoords(e);

      if (toolRef.current === 'eraser') {
        eraseAtPoint(x, y);
        return;
      }

      if (isDrawingRef.current && activePointerIdRef.current === e.pointerId) {
        if (e.timeStamp - strokeDownTimeRef.current < POINTER_DOWN_DEDUPE_MS) {
          return;
        }
        finishStrokeAtLastPoint();
      }

      beginStroke(e);
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
        if (!isPrimaryButtonDown(e)) return;
        eraseAtPoint(x, y);
        return;
      }

      if (toolRef.current === 'select') return;

      if (!isPrimaryButtonDown(e)) return;

      if (!isDrawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      for (const ev of getCoalescedPointerEvents(e)) {
        appendPoint(ev);
      }
      renderLiveStroke();
    },
    [getNormalizedCoords, eraseAtPoint, appendPoint, renderLiveStroke]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (toolRef.current === 'eraser') {
        resetDrawingState();
        return;
      }
      if (!isDrawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;
      if (e.timeStamp < strokeDownTimeRef.current) return;

      finishStroke(e);
    },
    [finishStroke, resetDrawingState]
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent) => {
      if (!isDrawablePointer(e)) return;
      if (
        isDrawingRef.current &&
        activePointerIdRef.current === e.pointerId &&
        toolRef.current !== 'eraser'
      ) {
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
  };
}
