import { useCallback, useEffect, useRef } from 'react';

import { getStroke } from 'perfect-freehand';

import type { DrawingTool, PageSize, Point, Stroke } from '../types';

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

// 정규화 좌표(0~1)를 캔버스 픽셀 좌표로 변환 후 렌더링
export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[]
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (const stroke of strokes) {
    // 0~1 → 픽셀 변환
    const pixelPoints = stroke.points.map((p) => [
      p.x * width,
      p.y * height,
      p.pressure ?? 0.5,
    ]);

    const outlinePoints = getStroke(pixelPoints, {
      size: stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size,
      thinning: stroke.tool === 'highlighter' ? 0 : 0.5,
      smoothing: 0.5,
      streamline: 0.5,
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
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
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

  // pageSize 변경 → 캔버스 내부 해상도 설정 + 재렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pageSize.width === 0) return;
    canvas.width = pageSize.width;
    canvas.height = pageSize.height;
    const ctx = canvas.getContext('2d');
    if (ctx) renderStrokes(ctx, strokes);
    // strokes는 의도적으로 deps에서 제외 — pageSize 변경 시만 재설정
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, canvasRef]);

  // strokes 변경 → 재렌더링 (캔버스 크기는 그대로)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (ctx) renderStrokes(ctx, strokes);
  }, [strokes, canvasRef]);

  const getNormalizedCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;

      const { x, y } = getNormalizedCoords(e);

      if (tool === 'eraser') {
        const toErase = strokes
          .filter((s) =>
            s.points.some((p) => {
              const dx = (p.x - x) * pageSize.width;
              const dy = (p.y - y) * pageSize.height;
              return Math.sqrt(dx * dx + dy * dy) < ERASER_RADIUS;
            })
          )
          .map((s) => s.id);
        if (toErase.length > 0) onStrokeErase(toErase);
        return;
      }

      strokeIdRef.current = crypto.randomUUID();
      currentPointsRef.current = [{ x, y, pressure: e.pressure }];
    },

    [tool, strokes, pageSize, onStrokeErase]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;

      const { x, y } = getNormalizedCoords(e);

      if (tool === 'eraser') {
        const toErase = strokes
          .filter((s) =>
            s.points.some((p) => {
              const dx = (p.x - x) * pageSize.width;
              const dy = (p.y - y) * pageSize.height;
              return Math.sqrt(dx * dx + dy * dy) < ERASER_RADIUS;
            })
          )
          .map((s) => s.id);
        if (toErase.length > 0) onStrokeErase(toErase);
        return;
      }

      currentPointsRef.current = [
        ...currentPointsRef.current,
        { x, y, pressure: e.pressure },
      ];

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const liveStroke: Stroke = {
        id: strokeIdRef.current,
        pageNumber: 0,
        points: currentPointsRef.current,
        color,
        size,
        tool,
      };
      renderStrokes(ctx, [...strokes, liveStroke]);
    },

    [tool, strokes, color, size, pageSize, onStrokeErase, canvasRef]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || tool === 'eraser') {
        isDrawingRef.current = false;
        return;
      }
      isDrawingRef.current = false;

      const points = currentPointsRef.current;
      if (points.length < 2) {
        currentPointsRef.current = [];
        return;
      }

      const { x, y } = getNormalizedCoords(e);
      const stroke: Stroke = {
        id: strokeIdRef.current,
        pageNumber: 0,
        points: [...points, { x, y, pressure: e.pressure }],
        color,
        size,
        tool,
      };
      currentPointsRef.current = [];
      onStrokeAdd(stroke);
    },

    [tool, color, size, onStrokeAdd]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
