'use client';

import { useEffect, useRef } from 'react';

import type { Stroke } from '../types';

type MinimapStrokesProps = {
  strokes: Stroke[];
  /** 현재 캔버스 논리 크기(px) — 미니맵 좌표 스케일 기준 */
  canvasWidth: number;
  canvasHeight: number;
  /** 미니맵 박스 크기(px) */
  boxW: number;
  boxH: number;
};

/**
 * 미니맵에 획을 간단(폴리라인)하게 그린다. perfect-freehand 윤곽 대신 점을 잇는
 * 얇은 선으로 그려 가볍게 위치/형태만 표현.
 *
 * 좌표: x = p.x * boxW, y = (p.y * layoutHeight) / canvasHeight * boxH.
 * (획의 y는 자신의 layoutHeight 기준이므로 현재 canvasHeight로 환산해야 위치가 맞음)
 */
export function MinimapStrokes({
  strokes,
  canvasWidth,
  canvasHeight,
  boxW,
  boxH,
}: MinimapStrokesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || boxW <= 0 || boxH <= 0 || canvasHeight <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(boxW * dpr));
    const h = Math.max(1, Math.round(boxH * dpr));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const yScale = (boxH * dpr) / canvasHeight;
    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;
      const layoutH = stroke.layoutHeight ?? canvasHeight;
      const isHighlighter = stroke.tool === 'highlighter';
      ctx.globalAlpha = isHighlighter ? 0.4 : 0.9;
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.lineWidth = Math.max(0.6, (isHighlighter ? 2.5 : 1) * dpr);

      if (stroke.points.length === 1) {
        const p = stroke.points[0]!;
        ctx.beginPath();
        ctx.arc(
          p.x * boxW * dpr,
          p.y * layoutH * yScale,
          ctx.lineWidth,
          0,
          Math.PI * 2
        );
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        const x = p.x * boxW * dpr;
        const y = p.y * layoutH * yScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [strokes, canvasWidth, canvasHeight, boxW, boxH]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ width: boxW, height: boxH }}
      aria-hidden
    />
  );
}
